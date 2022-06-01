const express = require('express');
const { v4: generateId } = require('uuid');
const database = require('./database');

const app = express();

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
  const todos = database.client.db('todos').collection('todos');
  // TODO - PAGINATION TASK: the end point will have a new value (pageNum) to determine which page
  // number to query from, using mongo db
  const response = await todos.find({}).sort({ position: 1 }).toArray();
  res.status(200);
  res.json(response);
});

app.post('/', async (req, res) => {
  const { text } = req.body;

  if (typeof text !== 'string') {
    res.status(400);
    res.json({ message: "invalid 'text' expected string" });
    return;
  }

  let lastEle = await database.client.db('todos').collection('todos').find({}).sort({ $natural: -1 })
    .limit(1);
  lastEle = await lastEle.toArray();

  const todoPosition = lastEle.length > 0 ? lastEle[0].position + 1 : 1;

  const todo = {
    id: generateId(), text, completed: false, position: todoPosition,
  };

  // TODO - SORTING TASK: Get the last element in the db and gets is position and increment this
  // value for the new todo

  // TODO - DUE DATE TASK: We will need to add a due date value, when data is returned the filter
  // can can be handled on the front end
  await database.client.db('todos').collection('todos').insertOne(todo);
  res.status(201);
  res.json(todo);
});

// TODO - SORTING TASK: Add an end point for the sorting it should have 2 values (from and to), we
// will use this to update the 2 todos who's position have been updated
app.put('/sort/:id', async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.body;

  if (from === 0 || to === 0 || id === '') {
    res.status(400);
    res.json({ message: "invalid 'from' or 'to' parameters are required" });
    return;
  }

  const updateTodo = await database.client.db('todos').collection('todos').findOne({ position: to });

  await database.client.db('todos').collection('todos').updateOne({ id },
    { $set: { position: to } });
  await database.client.db('todos').collection('todos').updateOne({ id: updateTodo.id },
    { $set: { position: from } });

  const response = await database.client.db('todos').collection('todos').find({}).sort({ position: 1 })
    .toArray();
  res.status(200);
  res.json(response);
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
