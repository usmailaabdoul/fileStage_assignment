const { v4: generateId } = require('uuid');

const pageSize = 20;

const addTodo = async (todos, text, dueDate) => {
  let lastEle = await todos.find({}).sort({ $natural: -1 })
    .limit(1);
  lastEle = await lastEle.toArray();

  const index = lastEle.length > 0 ? lastEle[0].index_number + 1024 : 1024;
  const todo = {
    id: generateId(),
    text,
    completed: false,
    index_number: index,
    updated_at: new Date(),
    dueDate,
  };

  await todos.insertOne(todo);

  const totalCount = await todos.countDocuments({});
  const totalPages = Math.ceil(totalCount / pageSize);
  const response = { data: todo, totalPages };

  return response;
};

const getTodos = async (todos, pageNo, filter) => {
  const query = {};

  query.skip = pageSize * (pageNo - 1);
  query.limit = pageSize;

  // eslint-disable-next-line no-underscore-dangle
  let _filter = {};
  if (filter && filter.length > 0) {
    _filter = { dueDate: filter };
  }

  const totalCount = await todos.countDocuments(_filter);
  const totalPages = Math.ceil(totalCount / pageSize);

  let response;
  if (pageNo > totalPages) {
    response = { data: [], totalPages, currentPage: totalPages === 0 ? 1 : totalPages };
    return response;
  }

  const data = await todos.find(_filter, query).sort({ index_number: 1 }).toArray();
  response = { data, totalPages, currentPage: Number(pageNo) };
  return response;
};

const updateTodo = async (todos, id, completed) => {
  await todos.updateOne({ id }, { $set: { completed } });
};

const deleteTodo = async (todos, id) => {
  await todos.deleteOne({ id });
};

const orderTodos = async ({
  todos, id, currElIndexNumber, prevElIndexNumber, nextElIndexNumber,
}) => {
  await todos.updateOne({ id }, { $set: { index_number: currElIndexNumber } });

  if (
    Math.abs(currElIndexNumber - prevElIndexNumber) <= 1
    || Math.abs(currElIndexNumber - nextElIndexNumber) <= 1
  ) {
    // eslint-disable-next-line no-underscore-dangle
    const _todos = await todos.find({}).sort({ index_number: 1 }).toArray();
    const sameIndexNums = [];
    const indexs = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < _todos.length; i++) {
      if (_todos[i].index_number === currElIndexNumber) {
        sameIndexNums.push(_todos[i]);
        indexs.push(i);
        if (_todos[i + 1] && _todos[i + 1].index_number === currElIndexNumber) {
          sameIndexNums.push(_todos[i + 1]);
          indexs.push(i + 1);
        }
        break;
      }
    }

    sameIndexNums.sort((a, b) => b.updated_at - a.updated_at);
    _todos.splice(indexs[0], 2);
    _todos.splice(indexs[0], 0, ...sameIndexNums);

    await Promise.all(
      _todos.map(async (ele, i) => {
        const newIndex = (i + 1) * 1024;

        todos.updateOne({ id: ele.id }, {
          $set: {
            index_number: newIndex,
            updated_at: new Date(),
          },
        });
      }),
    );
  }
};

module.exports = {
  updateTodo, deleteTodo, orderTodos, addTodo, getTodos,
};
