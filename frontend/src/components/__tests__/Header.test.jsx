import React from "react";
import { fireEvent } from "@testing-library/react";

import Header from "../Header";
import { renderWithProvider } from "../../tests/utils/renderWithProvider";

describe("<Header />", () => {
  it("should render properly Header", () => {
    const { getByText } = renderWithProvider(<Header />);

    expect(getByText("Todos")).toBeVisible();
  });

  it("should be able to add a todo", () => {
    const addTodo = jest.fn();
    const { getByTestId } = renderWithProvider(<Header addTodo={addTodo} />);

    const button = getByTestId("addTodo-btn");
    fireEvent.click(button);
    expect(addTodo).toBeCalled();
  });
});
