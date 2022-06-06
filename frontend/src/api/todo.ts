import axios from "axios";

const baseUrl = "http://localhost:3001/api";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export interface ITodosResponse {
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

export const fetchTodos = async (page: number, filter: string | undefined) => {
  const _filter = filter ? `&filter=${filter}` : "";
  const url = `${baseUrl}?pageNo=${page}${_filter}`;

  try {
    let { data } = await axios.get<ITodosResponse>(url, { headers });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
};

export interface IAddNewTodoResponse {
  data: ITodo;
  totalPages: number;
}

export const addNewTodo = async (todo: IAddTodo) => {
  try {
    let { data } = await axios.post<IAddNewTodoResponse>(baseUrl, todo, {
      headers,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
};

export const updateTodo = async (id: string, data: { completed: boolean }) => {
  const url = `${baseUrl}/${id}`;

  try {
    await axios.put<IAddNewTodoResponse>(url, data, {
      headers,
    });
    return;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
};

export const deleteTodo = async (id: string) => {
  const url = `${baseUrl}/${id}`;

  try {
    await axios.delete<IAddNewTodoResponse>(url);
    return;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
};

export const orderTodo = async (
  id: string,
  data: {
    prevElIndexNumber: number | undefined;
    nextElIndexNumber: number | undefined;
  }
) => {
  const url = `${baseUrl}/order-todos/${id}`;

  try {
    await axios.put<IAddNewTodoResponse>(url, data);
    return;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
};
