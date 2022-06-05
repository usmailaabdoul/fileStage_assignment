import React from "react";
import { fireEvent } from "@testing-library/react";

import Footer from "../Footer";
import { renderWithProvider } from "../../tests/utils/renderWithProvider";

describe("<Footer />", () => {
  it("should render footer", () => {
    const { getByText } = renderWithProvider(<Footer />);

    expect(getByText("Due today")).toBeVisible();
  });

  it("should be able to fetch Due Todos", () => {
    const fetchDueTodos = jest.fn();
    const { getByTestId } = renderWithProvider(
      <Footer onClick={fetchDueTodos} />
    );

    const button = getByTestId("fetch-dueTodos-btn");
    fireEvent.click(button);
    expect(fetchDueTodos).toBeCalled();
  });

  it("should see loader", () => {
    const { getByTestId } = renderWithProvider(<Footer loading={true} />);

    const loader = getByTestId("loader");
    expect(loader).toBeVisible();
  });
});
