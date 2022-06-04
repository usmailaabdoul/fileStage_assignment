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
  CircularProgress
} from "@material-ui/core";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { DraggableList } from './components';
import { reOrderTodos } from './utils';

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
  listArea: {
    backgroundColor: 'teal',
    borderRadius: '5px',
    marginTop: '10px',
    height: '200px',
    overflow: 'scroll',
    padding: '10px',
  }
});

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    fetchAllTodos(currentPage)
  }, []);

  const fetchAllTodos = (page) => {
    setLoading(true)
    console.log('fetching todos', { page })
    fetch(`http://localhost:3001?pageNo=${page}`)
      .then((response) => response.json())
      .then((res) => {
        const newTodos = [...todos, ...res.data]
        console.log(res.data)
        setTodos(newTodos)
        setCurrentPage(Number(res.currentPage))
        setHasMore(res.data.length > 0);
        setLoading(false)
      });
  }

  function addTodo(text) {
    setLoading(true)
    fetch("http://localhost:3001/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.totalPages === currentPage) {
          const newTodos = [...todos, res.data];
          setTodos(newTodos)
        }
        setLoading(false)
      });
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

  const loadMore = () => {
    const num = currentPage + 1;
    fetchAllTodos(num)
  }

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  console.log({ newTodoText, dueDate: value })

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
          <Box>
            <DateTimePicker
              label="Date&Time picker"
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
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

      <div className={classes.listArea}>
        {todos.length > 0 && (
          <DraggableList
            {...{
              todos,
              toggleTodoCompleted,
              deleteTodo,
              onDragEnd,
              loading,
              hasMore,
              loadMore
            }}
          ></DraggableList>
        )}
      </div>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}

export default Todos;
