import React from "react";
import Todos from "../Todos";
import { renderWithProvider } from "../tests/utils/renderWithProvider";

describe("<Todos />", () => {
  it("should render properly Todos page", () => {
    const { getByText } = renderWithProvider(<Todos />);

    expect(getByText("Todos")).toBeVisible();
  });
});
