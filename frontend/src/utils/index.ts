import { ITodo } from "../api/todo";

export const reOrderTodos = (
  todos: ITodo[],
  startIndex: number,
  endIndex: number
): ITodo[] => {
  const result = Array.from(todos);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
