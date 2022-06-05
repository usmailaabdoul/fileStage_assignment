const baseUrl = "http://localhost:3001/api";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export interface ITodos {
  data: Array<ITodo>;
  currentPage: number;
  totalPages: number;
}

export interface IAddTodo {
  text: string;
  dueDate: string;
}

export interface ITodo {
  id: string;
  text: string;
  completed: boolean;
  index_number: number;
  updated_at: string;
  dueDate: string;
}

export const fetchTodos = async (
  page: number,
  filter: string | undefined
): Promise<ITodos> => {
  const _filter = filter ? `&filter=${filter}` : "";

  let res = await fetch(`${baseUrl}?pageNo=${page}${_filter}`);
  res = await res.json();
  return res as unknown as ITodos;
};

export const addNewTodos = async (todo: IAddTodo) => {
  const body = JSON.stringify(todo);
  let res = await fetch(`${baseUrl}`, {
    method: "POST",
    headers,
    body,
  });

  res = await res.json();
  return res as unknown as ITodos;
};

export const updateTodo = async (id: string, data: { completed: boolean }) => {
  const body = JSON.stringify(data);
  await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers,
    body,
  });

  return;
};

export const deleteTodo = async (id: string) => {
  await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });

  return;
};

export const orderTodo = async (
  id: string,
  data: {
    prevElIndexNumber: number | undefined;
    nextElIndexNumber: number | undefined;
  }
) => {
  const body = JSON.stringify(data);
  await fetch(`${baseUrl}/order-todos/${id}`, {
    method: "PUT",
    headers,
    body,
  });

  return;
};
