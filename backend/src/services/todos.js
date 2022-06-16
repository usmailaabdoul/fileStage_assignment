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
    dueDay: new Date(dueDate).toLocaleDateString(),
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
    _filter = { dueDay: filter };
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

const customGetTodos = async (todos, pageNo) => {
  const query = {};

  query.skip = 0;
  query.limit = pageSize * pageNo;

  const totalCount = await todos.countDocuments();
  const totalPages = Math.ceil(totalCount / pageSize);

  let response;
  if (pageNo > totalPages) {
    response = { data: [], totalPages, currentPage: totalPages === 0 ? 1 : totalPages };
    return response;
  }

  const data = await todos.find({}, query).sort({ index_number: 1 }).toArray();
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
  todos, id, newPositionIndex,
}) => {
  await todos.updateOne({ id }, {
    $set: {
      index_number: newPositionIndex,
      updated_at: new Date(),
    },
  });
  // eslint-disable-next-line no-underscore-dangle
  const _todos = await todos.find({}).sort({ index_number: 1 }).toArray();
  console.log({ _todos });
};

module.exports = {
  updateTodo, deleteTodo, orderTodos, addTodo, getTodos, customGetTodos,
};
