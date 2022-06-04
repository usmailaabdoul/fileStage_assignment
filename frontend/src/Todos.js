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
  CircularProgress,
} from "@material-ui/core";
import Alert from "@mui/material/Alert";

import { DraggableList } from "./components";
import { reOrderTodos } from "./utils";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const useStyles = makeStyles({
  addTodoContainer: {
    padding: 10,
  },
  addTodoButton: {
    marginLeft: 5,
    background: "#2A85FF",
    borderRadius: "8px",
    height: "45px",
    padding: "0 20px",
    color: "#FFFFFF",
    fontWeight: "bold",

    "&:hover": {
      background: "#0069f6",
    },
  },
  datePicker: {
    margin: "0px 20px",
  },
  dueBtn: {
    marginTop: "20px",
    marginLeft: 0,
  },
  alert: {
    position: "absolute",
    top: "70px",
    right: "50px",
    width: "300px",
  },
  footer: {
    display: "flex",
  },
});

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dueDate, setDueDate] = useState();
  const [fetchedDueTodos, setFetchedDueTodos] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });

  const fetchAllTodos = (page, filter) => {
    setLoading(true);
    const _filter = filter ? `&filter=${filter}` : "";
    fetch(`http://localhost:3001?pageNo=${page}${_filter}`)
      .then((response) => response.json())
      .then((res) => {
        setTodos((prev) => [...prev, ...res.data]);
        setCurrentPage(res.currentPage);
        setHasMore(res.totalPages > res.currentPage);
        setLoading(false);
      })
      .catch((err) => setError({ error: true, message: err.message }));
  };

  useEffect(() => {
    fetchAllTodos(currentPage);
  }, []);

  useEffect(() => {
    if (error.error) {
      setTimeout(() => {
        setError({ error: false, message: "" });
      }, 5000);
    }
  }, [error]);

  function addTodo(text) {
    setLoading(true);

    if (text.length === 0 || !dueDate) {
      setLoading(false);
      return setError({
        error: true,
        message: "Enter valid text and due Date to proceed",
      });
    }

    fetch("http://localhost:3001/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        text,
        dueDate: new Date(dueDate).toLocaleDateString(),
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res.totalPages, currentPage);
        if (res.totalPages === currentPage) {
          const newTodos = [...todos, res.data];
          setTodos(newTodos);
        }
        setLoading(false);
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
    const currEleID = todos[source.index].id;
    let prevElIndexNumber;
    let nextElIndexNumber;

    // dropped outside the list
    if (!destination) return;

    console.log({ todos });

    console.log({
      prev: todos[destination.index - 1]?.index_number ?? undefined,
      next: todos[destination.index + 1]?.index_number ?? undefined,
      curr: todos[source.index],
    });

    if (todos[destination.index - 1]) {
      prevElIndexNumber = todos[destination.index].index_number;
    }

    if (todos[destination.index + 1]) {
      nextElIndexNumber = todos[destination.index].index_number;
    }

    console.log({ prevNum: prevElIndexNumber, nextNum: nextElIndexNumber });

    const newTodos = reOrderTodos(todos, source.index, destination.index);
    console.log({ newTodos });
    setTodos(newTodos);

    fetch(`http://localhost:3001/order-todos/${currEleID}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        prevElIndexNumber,
        nextElIndexNumber,
      }),
    })
      .then()
      .catch((e) => {
        fetchAllTodos();
      });
  };

  const loadMore = () => {
    const num = currentPage + 1;
    fetchAllTodos(num);
  };

  const viewDueTodos = () => {
    let filter = new Date().toLocaleDateString();

    setTodos([]);
    if (fetchedDueTodos) {
      filter = undefined;
    }
    fetchAllTodos(1, filter);
  };

  return (
    <Container maxWidth="md" position="relative">
      <Box paddingTop="10px">
        <Typography variant="h3" component="h1" gutterBottom>
          Todos
        </Typography>
      </Box>
      <Paper className={classes.addTodoContainer}>
        <Box display="flex" flexDirection="row" alignItems="flex-end">
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
          <Box className={classes.datePicker}>
            <DesktopDatePicker
              renderInput={(props) => <TextField {...props} />}
              label="Date desktop"
              inputFormat="MM/dd/yyyy"
              value={dueDate}
              onChange={(newValue) => {
                setDueDate(newValue);
              }}
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
        <DraggableList
          {...{
            todos,
            toggleTodoCompleted,
            deleteTodo,
            onDragEnd,
            loading,
            hasMore,
            loadMore,
          }}
        ></DraggableList>
      )}

      <Box className={classes.footer}>
        <Button
          className={[classes.addTodoButton, classes.dueBtn]}
          startIcon={<Icon>event</Icon>}
          onClick={() => {
            setFetchedDueTodos((prev) => !prev);
            viewDueTodos();
          }}
        >
          {fetchedDueTodos ? "See All todos" : "See Due todos"}
        </Button>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              marginLeft: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      {error.error && (
        <div className={classes.alert}>
          <Alert severity="error">{error.message}</Alert>
        </div>
      )}
    </Container>
  );
}

export default Todos;
