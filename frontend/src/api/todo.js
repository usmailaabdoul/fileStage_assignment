const baseUrl = "http://localhost:3001/api";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const fetchTodos = async (page, filter) => {
  const _filter = filter ? `&filter=${filter}` : "";
  let res = await fetch(`${baseUrl}?pageNo=${page}&filter=${_filter}`);
  res = await res.json();
  return res;
};

export const addNewTodos = async (todo) => {
  const body = JSON.stringify(todo);
  let res = await fetch(`${baseUrl}`, {
    method: "POST",
    headers,
    body,
  });

  res = await res.json();
  return res;
};

export const updateTodo = async (id, completed) => {
  const body = JSON.stringify(completed);
  await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers,
    body,
  });

  return;
};

export const deleteTodo = async (id) => {
  await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });

  return;
};

export const orderTodo = async (id, data) => {
  const body = JSON.stringify(data);
  await fetch(`${baseUrl}/order-todos/${id}`, {
    method: "PUT",
    headers,
    body,
  });

  return;
};
