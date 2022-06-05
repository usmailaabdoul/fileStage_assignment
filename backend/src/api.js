const express = require('express');
const { v4: generateId } = require('uuid');
const database = require('./database');

const app = express();
const pageSize = 20;

function requestLogger(req, res, next) {
  res.once('finish', () => {
    const log = [req.method, req.path];
    if (req.body && Object.keys(req.body).length > 0) {
      log.push(JSON.stringify(req.body));
    }
    if (req.query && Object.keys(req.query).length > 0) {
      log.push(JSON.stringify(req.query));
    }
    log.push('->', res.statusCode);
    // eslint-disable-next-line no-console
    console.log(log.join(' '));
  });
  next();
}

app.use(requestLogger);
app.use(require('cors')());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const { pageNo, filter } = req.query;
  const todos = database.client.db('todos').collection('todos');

  const query = {};
  let response;
  if (pageNo < 0 || pageNo === 0) {
    res.status(400);
    res.json({ message: 'invalid page number, should start with 1' });
    return res.json(response);
  }
  query.skip = pageSize * (pageNo - 1);
  query.limit = pageSize;

  // eslint-disable-next-line no-underscore-dangle
  let _filter = {};
  if (filter && filter.length > 0) {
    _filter = { dueDate: filter };
  }

  const totalCount = await todos.countDocuments(_filter);
  const totalPages = Math.ceil(totalCount / pageSize);

  if (pageNo > totalPages) {
    response = { data: [], totalPages, currentPage: totalPages === 0 ? 1 : totalPages };
    res.status(200);
    return res.json(response);
  }

  const data = await todos.find(_filter, query).sort({ index_number: 1 }).toArray();

  response = { data, totalPages, currentPage: Number(pageNo) };
  console.log(response);
  res.status(200);
  return res.json(response);
});

app.post('/', async (req, res) => {
  const { text, dueDate } = req.body;
  const todos = database.client.db('todos').collection('todos');

  if (typeof text !== 'string') {
    res.status(400);
    res.json({ message: "invalid 'text' expected string" });
    return;
  }

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
  res.status(201);
  res.json(response);
});

app.put('/order-todos/:id', async (req, res) => {
  const { id } = req.params;
  const todos = database.client.db('todos').collection('todos');

  const { prevElIndexNumber, nextElIndexNumber } = req.body;
  let currElIndexNumber;

  if (prevElIndexNumber === undefined) {
    currElIndexNumber = nextElIndexNumber - 512;
  } else if (nextElIndexNumber === undefined) {
    currElIndexNumber = prevElIndexNumber + 512;
  } else {
    currElIndexNumber = Math.floor((prevElIndexNumber + nextElIndexNumber) / 2);
  }

  console.log({ currElIndexNumber, prevElIndexNumber, nextElIndexNumber });
  try {
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
    res.status(200);
    res.end();
  } catch (e) {
    res.status(500).send({ e });
  }
});

app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    res.status(400);
    res.json({ message: "invalid 'completed' expected boolean" });
    return;
  }

  await database.client.db('todos').collection('todos').updateOne({ id },
    { $set: { completed } });
  res.status(200);
  res.end();
});

app.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await database.client.db('todos').collection('todos').deleteOne({ id });
  res.status(203);
  res.end();
});

module.exports = app;
