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
  listArea: {
    backgroundColor: "#eee",
    borderRadius: "5px",
    marginTop: "10px",
    height: "500px",
    overflow: "scroll",
    padding: "10px",
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
  const [alert, setAlert] = useState({
    alert: false,
    message: "",
    type: "error",
  });

  const fetchAllTodos = async (page, filter) => {
    setLoading(true);
    try {
      let res = await fetchTodos(page, filter);
      setTodos((prev) => [...prev, ...res.data]);
      setCurrentPage(res.currentPage);
      setHasMore(res.totalPages > res.currentPage);
      setLoading(false);

      if (res.data.length === 0 && filter.length > 0) {
        setAlert({ alert: true, message: "No due todos today", type: "info" });
      }
    } catch (error) {
      setLoading(false);
      setAlert({ alert: true, message: error.message });
    }
  };

  useEffect(() => {
    fetchAllTodos(currentPage);
  }, []);

  useEffect(() => {
    if (alert.alert) {
      setTimeout(() => {
        setAlert({ alert: false, message: "" });
      }, 5000);
    }
  }, [alert]);

  const addTodo = async (text) => {
    setLoading(true);

    if (text.length === 0 || !dueDate) {
      setLoading(false);
      return setAlert({
        alert: true,
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
      setAlert({ alert: true, message: error.message });
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
      setAlert({ alert: true, message: error.message });
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
      setAlert({ alert: true, message: error.message });
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
      setAlert({ alert: true, message: error.message });
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
      <div className={classes.listArea}>
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
      </div>

      <Footer
        {...{ loading, fetchedDueTodos }}
        onClick={() => {
          setFetchedDueTodos((prev) => !prev);
          viewDueTodos();
        }}
      />

      {alert.alert && (
        <div className={classes.alert}>
          <Alert severity={alert.type}>{alert.message}</Alert>
        </div>
      )}
    </Container>
  );
}

export default Todos;
