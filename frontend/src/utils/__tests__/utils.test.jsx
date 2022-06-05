import { reOrderTodos } from "../index";
import { todos } from "../../tests/mocks/todoMock";

describe("ReOrder Todos", () => {
  it("should be able to reorder todos", () => {
    const from = 0;
    const to = 2;

    const response = reOrderTodos(todos, from, to);

    expect(response[2].text).toEqual(todos[0].text);
  });
});
