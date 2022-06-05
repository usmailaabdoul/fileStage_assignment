import { ITodos } from "../api/todo";

export const reOrderTodos = (
  todos: ITodos["data"],
  startIndex: number,
  endIndex: number
): ITodos["data"] => {
  const result = Array.from(todos);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
