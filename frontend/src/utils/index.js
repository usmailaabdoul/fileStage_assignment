export const reOrderTodos = (todos, startIndex, endIndex) => {
  const result = Array.from(todos);
  console.log({ startIndex, endIndex });
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
