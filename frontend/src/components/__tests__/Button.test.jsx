import { fireEvent } from "@testing-library/react";

import Button from "../Button";
import { renderWithProvider } from "../../tests/utils/renderWithProvider";

describe("<Button />", () => {
  it("should render properly Button", () => {
    const { getByText } = renderWithProvider(<Button label="button label" />);

    expect(getByText("button label")).toBeVisible();
  });

  it("should be able to click button", () => {
    const onClick = jest.fn();
    const { getByText } = renderWithProvider(<Button label="button label" onClick={onClick} />);

    const button = getByText("button label");
    fireEvent.click(button);
    expect(onClick).toBeCalled();
  });
});
