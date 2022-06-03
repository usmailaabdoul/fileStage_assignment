import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  Button,
  Icon,
  Paper,
  Box,
  TextField,
  Checkbox,
} from "@material-ui/core";

import { DraggableList } from './components';
import { reOrderTodos } from './utils';

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
});

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");

  useEffect(() => {
    fetchAllTodos()
  }, []);

  const fetchAllTodos = () => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((todos) => setTodos(todos));
  }

  function addTodo(text) {
    fetch("http://localhost:3001/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text }),
    })
      .then((response) => response.json())
      .then((todo) => setTodos([...todos, todo]));
    setNewTodoText("");
  }

  function toggleTodoCompleted(id) {
    fetch(`http://localhost:3001/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };
      setTodos(newTodos);
    });
  }

  function deleteTodo(id) {
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  }

  const onDragEnd = ({ destination, source }) => {
    const currEleID = todos[source.index].id
    let prevElIndexNumber;
    let nextElIndexNumber;

    // dropped outside the list
    if (!destination) return;

    console.log({ todos })

    console.log({ prev: todos[destination.index - 1]?.index_number ?? undefined, next: todos[destination.index + 1]?.index_number ?? undefined, curr: todos[source.index] })

    if (todos[destination.index - 1]) {
      prevElIndexNumber = todos[destination.index].index_number;
    }

    if (todos[destination.index + 1]) {
      nextElIndexNumber = todos[destination.index].index_number;
    }
    // if (todos[destination.index + 1] && todos[destination.index - 1]) {
    //   nextElIndexNumber = todos[destination.index + 1].index_number;
    // }

    // if (todos[destination.index + 1] && !todos[destination.index - 1]) {
    //   nextElIndexNumber = todos[destination.index].index_number;
    // }

    console.log({ prevNum: prevElIndexNumber, nextNum: nextElIndexNumber })

    const newTodos = reOrderTodos(todos, source.index, destination.index);
    console.log({ newTodos })
    setTodos(newTodos);

    fetch(`http://localhost:3001/order-todos/${currEleID}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        prevElIndexNumber,
        nextElIndexNumber
      }),
    }).then()
      .catch(e => {
        fetchAllTodos()
      })
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
      <Paper className={classes.addTodoContainer}>
        <Box display="flex" flexDirection="row">
          <Box flexGrow={1}>
            <TextField
              fullWidth
              value={newTodoText}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  addTodo(newTodoText);
                }
              }}
              onChange={(event) => setNewTodoText(event.target.value)}
            />
          </Box>
          <Button
            className={classes.addTodoButton}
            startIcon={<Icon>add</Icon>}
            onClick={() => addTodo(newTodoText)}
          >
            Add
          </Button>
        </Box>
      </Paper>

      {todos.length > 0 && (
        <DraggableList {...{ todos, toggleTodoCompleted, deleteTodo, onDragEnd }}></DraggableList>
      )}
    </Container>
  );
}

export default Todos;
