import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import { DropResult } from "react-beautiful-dnd";

import { DraggableList, Header, Footer } from "./components";
import { reOrderTodos } from "./utils";
import {
  fetchTodos,
  addNewTodo,
  updateTodo,
  deleteTodo,
  orderTodo,
  ITodosResponse,
  IAddNewTodoResponse,
} from "./api/todo";
import axios from "axios";

const useStyles = makeStyles({
  container: {
    maxWidth: 900,
  },
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

interface IAlert {
  alert: boolean;
  message: string;
  type: "error" | "warning" | "info";
}

interface ApiError {
  message: string;
}

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState<ITodosResponse["data"]>([]);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dueDate, setDueDate] = useState<string>(
    new Date().toLocaleDateString()
  );
  const [fetchedDueTodos, setFetchedDueTodos] = useState<boolean>(false);
  const [alert, setAlert] = useState<IAlert>({
    alert: false,
    message: "",
    type: "error",
  });

  const showAlert = (error: any) => {
    if (axios.isAxiosError(error)) {
      return setAlert({
        alert: true,
        message: error.message,
        type: "error",
      });
    }
    setAlert({
      alert: true,
      message: "An unexpected error occurred",
      type: "error",
    });
  };

  const fetchAllTodos = async (page: number, filter: string | undefined) => {
    setLoading(true);
    try {
      let res: ITodosResponse | string = await fetchTodos(page, filter);

      if (typeof res !== "string") {
        let value = res;
        setTodos((prev: ITodosResponse["data"]) => [...prev, ...value.data]);
        setCurrentPage(value.currentPage);
        setHasMore(value.totalPages > value.currentPage);
        setLoading(false);

        if (value.data.length === 0 && filter && filter.length > 0) {
          setAlert({
            alert: true,
            message: "No due todos today",
            type: "info",
          });
        }
      }
    } catch (error) {
      setLoading(false);
      showAlert(error);
    }
  };

  useEffect(() => {
    fetchAllTodos(currentPage, undefined);
  }, []);

  useEffect(() => {
    if (alert.alert) {
      setTimeout(() => {
        setAlert({ alert: false, message: "", type: "error" });
      }, 5000);
    }
  }, [alert]);

  const addTodo = async (text: string) => {
    setLoading(true);

    if (text.length === 0 || !dueDate) {
      setLoading(false);
      return setAlert({
        alert: true,
        message: "Enter valid text and due Date to proceed",
        type: "error",
      });
    }

    try {
      let res: IAddNewTodoResponse | string = await addNewTodo({
        text,
        dueDate: new Date(dueDate).toLocaleDateString(),
      });

      if (typeof res !== "string") {
        if (res.totalPages === currentPage) {
          const newTodos = [...todos, res.data];
          setTodos(newTodos);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      showAlert(error);
    }
    setNewTodoText("");
    setDueDate(new Date().toLocaleDateString());
  };

  const toggleTodoCompleted = async (id: string) => {
    setLoading(true);
    try {
      await updateTodo(id, {
        completed: !todos.find((todo) => todo.id === id)?.completed,
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
      showAlert(error);
    }
  };

  const deleteATodo = async (id: string) => {
    setLoading(true);
    try {
      await deleteTodo(id);

      setTodos(todos.filter((todo) => todo.id !== id));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showAlert(error);
    }
  };

  const onDragEnd = async ({ destination, source }: DropResult) => {
    const dragEleId: string = todos[source.index].id;

    // dropped outside the list
    if (!destination) return;

    const newTodos = reOrderTodos(todos, source.index, destination.index);
    setTodos(newTodos);

    try {
      setLoading(true);
      await orderTodo(dragEleId, {
        initalPosition: source.index,
        targetPosition: destination.index, 
      });

      setLoading(false);
    } catch (error) {
      fetchAllTodos(currentPage, undefined);
      showAlert(error);
    }
  };

  const loadMore = () => {
    const num = currentPage + 1;
    fetchAllTodos(num, undefined);
  };

  const viewDueTodos = () => {
    let filter: string | undefined = new Date().toLocaleDateString();

    setTodos([]);
    if (fetchedDueTodos) {
      filter = undefined;
    }
    fetchAllTodos(1, filter);
  };

  return (
    <Container className={classes.container}>
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
            deleteTodo={(id: string) => deleteATodo(id)}
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
