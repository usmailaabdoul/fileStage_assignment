const router = require('express').Router();
const database = require('../database');

const TodoService = require('../services/todos');

router.get('/', async (req, res) => {
  const { pageNo, filter } = req.query;
  const todos = database.client.db('todos').collection('todos');

  if (pageNo < 0 || pageNo === 0) {
    res.status(400);
    const response = { message: 'invalid page number, should start with 1' };
    return res.json(response);
  }

  const response = await TodoService.getTodos(todos, pageNo, filter);

  res.status(200);
  return res.json(response);
});

router.get('/custom-fetch', async (req, res) => {
  const { pageNo } = req.query;
  const todos = database.client.db('todos').collection('todos');

  if (pageNo < 0 || pageNo === 0) {
    res.status(400);
    const response = { message: 'invalid page number, should start with 1' };
    return res.json(response);
  }

  const response = await TodoService.customGetTodos(todos, pageNo);

  res.status(200);
  return res.json(response);
});

router.post('/', async (req, res) => {
  const { text, dueDate } = req.body;
  const todos = database.client.db('todos').collection('todos');

  if (typeof text !== 'string') {
    res.status(400);
    res.json({ message: "invalid 'text' expected string" });
    return;
  }

  const response = await TodoService.addTodo(todos, text, dueDate);
  res.status(201);
  res.json(response);
});

router.put('/order-todos/:id', async (req, res) => {
  const { id } = req.params;
  const todos = database.client.db('todos').collection('todos');

  const {
    targetPosition, initalPosition,
  } = req.body;

  const data = await todos.find({}).sort({ index_number: 1 }).toArray();
  const targetPositionIndex = data[targetPosition].index_number;
  const currentPositionIndex = data[initalPosition].index_number;

  const direction = targetPositionIndex > currentPositionIndex ? 'down' : 'up';
  console.log({ direction });
  console.log({ targetPositionIndex, currentPositionIndex });
  let newPositionIndex;

  if (direction === 'down') {
    newPositionIndex = targetPositionIndex + 1;
  }
  if (direction === 'up') {
    newPositionIndex = targetPositionIndex - 1;
  }

  console.log({ newPositionIndex });

  try {
    await TodoService.orderTodos({
      todos, id, newPositionIndex,
    });

    res.status(200);
    res.end();
  } catch (e) {
    res.status(500).send({ e });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const todos = database.client.db('todos').collection('todos');

  if (typeof completed !== 'boolean') {
    res.status(400);
    res.json({ message: "invalid 'completed' expected boolean" });
    return;
  }

  await TodoService.updateTodo(todos, id, completed);
  res.status(200);
  res.end();
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const todos = database.client.db('todos').collection('todos');

  await TodoService.deleteTodo(todos, id);
  res.status(203);
  return res.end();
});

module.exports = router;
