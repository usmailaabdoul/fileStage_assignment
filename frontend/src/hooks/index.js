import { useState, useEffect } from "react";
import { reOrderTodos } from "../utils";

export const useTodos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });
  const [todos, setTodos] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError({ error: false, message: "" });
    fetchAllTodos();
    console.log("fetching data");
  }, [pageNumber]);

  const fetchAllTodos = () => {
    fetch(`http://localhost:3001?pageNo=${pageNumber}`)
      .then((response) => response.json())
      .then((res) => {
        console.log({ res });
        setTodos((preTodos) => [...preTodos, ...res.data]);
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError({ error: true, message: err.message });
        setLoading(false);
      });
  };

  const addTodo = (text) => {
    fetch("http://localhost:3001?pageNo=1", {
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
  };

  const toggleTodoCompleted = (id) => {
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
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  };

  const orderTodo = (destination, source) => {
    const currEleID = todos[source.index].id;
    let prevElIndexNumber;
    let nextElIndexNumber;

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

  return {
    loading,
    error,
    hasMore,
    todos,
    newTodoText,
    pageNumber,
    addTodo,
    toggleTodoCompleted,
    deleteTodo,
    orderTodo,
    setNewTodoText,
    setPageNumber,
  };
};
