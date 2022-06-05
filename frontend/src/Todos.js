import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import Alert from "@mui/material/Alert";

import { DraggableList, Header, Footer } from "./components";
import { reOrderTodos } from "./utils";
import {
  fetchTodos,
  addNewTodos,
  updateTodo,
  deleteTodo,
  orderTodo,
} from "./api/todo";

const useStyles = makeStyles({
  alert: {
    position: "absolute",
    top: "70px",
    right: "50px",
    width: "300px",
  },
});

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dueDate, setDueDate] = useState(new Date().toLocaleDateString());
  const [fetchedDueTodos, setFetchedDueTodos] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });

  const fetchAllTodos = async (page, filter) => {
    setLoading(true);
    try {
      let res = await fetchTodos(page, filter);
      setTodos((prev) => [...prev, ...res.data]);
      setCurrentPage(res.currentPage);
      setHasMore(res.totalPages > res.currentPage);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError({ error: true, message: error.message });
    }
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

  const addTodo = async (text) => {
    setLoading(true);

    if (text.length === 0 || !dueDate) {
      setLoading(false);
      return setError({
        error: true,
        message: "Enter valid text and due Date to proceed",
      });
    }

    try {
      let res = await addNewTodos({
        text,
        dueDate: new Date(dueDate).toLocaleDateString(),
      });

      console.log(res.totalPages, currentPage);
      if (res.totalPages === currentPage) {
        const newTodos = [...todos, res.data];
        setTodos(newTodos);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError({ error: true, message: error.message });
    }
    setNewTodoText("");
  };

  const toggleTodoCompleted = async (id) => {
    setLoading(true);
    try {
      await updateTodo(id, {
        completed: !todos.find((todo) => todo.id === id).completed,
      });

      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };
      setTodos(newTodos);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError({ error: true, message: error.message });
    }
  };

  const deleteATodo = async (id) => {
    setLoading(true);
    try {
      await deleteTodo(id);

      setTodos(todos.filter((todo) => todo.id !== id));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError({ error: true, message: error.message });
    }
  };

  const onDragEnd = async ({ destination, source }) => {
    const currEleID = todos[source.index].id;
    let prevElIndexNumber;
    let nextElIndexNumber;

    // dropped outside the list
    if (!destination) return;

    if (todos[destination.index - 1]) {
      prevElIndexNumber = todos[destination.index].index_number;
    }

    if (todos[destination.index + 1]) {
      nextElIndexNumber = todos[destination.index].index_number;
    }

    const newTodos = reOrderTodos(todos, source.index, destination.index);
    setTodos(newTodos);

    try {
      setLoading(true);
      await orderTodo(currEleID, {
        prevElIndexNumber,
        nextElIndexNumber,
      });

      setLoading(false);
    } catch (error) {
      fetchAllTodos(currentPage);
      setLoading(false);
      setError({ error: true, message: error.message });
    }
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
      <Header
        {...{
          newTodoText,
          addTodo,
          setNewTodoText,
          dueDate,
          setDueDate,
        }}
      />
      {todos.length > 0 && (
        <DraggableList
          {...{
            todos,
            toggleTodoCompleted,
            onDragEnd,
            loading,
            hasMore,
            loadMore,
          }}
          deleteTodo={(id) => deleteATodo(id)}
        />
      )}

      <Footer
        {...{ loading, fetchedDueTodos }}
        onClick={() => {
          setFetchedDueTodos((prev) => !prev);
          viewDueTodos();
        }}
      />
      {error.error && (
        <div className={classes.alert}>
          <Alert severity="error">{error.message}</Alert>
        </div>
      )}
    </Container>
  );
}

export default Todos;
