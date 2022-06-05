export const reOrderTodos = (todos, startIndex, endIndex) => {
  const result = Array.from(todos);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
