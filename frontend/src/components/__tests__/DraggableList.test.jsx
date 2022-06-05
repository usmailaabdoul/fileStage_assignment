import React from "react";
import { fireEvent } from "@testing-library/react";
import DraggableList from "../DraggableList";
import { renderWithProvider } from "../../tests/utils/renderWithProvider";
import { todos } from "../../tests/mocks/todoMock";

describe("<DraggableList />", () => {
  it("should render properly", () => {
    const { getByText } = renderWithProvider(<DraggableList />);

    expect(getByText("Status")).toBeVisible();
    expect(getByText("Todo")).toBeVisible();
    expect(getByText("Due Date")).toBeVisible();
    expect(getByText("Action")).toBeVisible();
  });

  it("should render properly all Todos", () => {
    const { getByText } = renderWithProvider(<DraggableList todos={todos} />);

    expect.assertions(todos.length);

    todos.forEach((todo) => {
      expect(getByText(todo.text)).toBeInTheDocument();
    });
  });

  it("should be draggable", (done) => {
    const onDragOver = jest.fn(() => done());
    const { getByTestId } = renderWithProvider(
      <DraggableList todos={todos} onDragOver={onDragOver} />
    );

    const list = getByTestId("draggable-list");
    const listItem = list.lastChild;
    list.addEventListener("dragover", () => {
      done();
    });
    fireEvent.dragStart(listItem);
    fireEvent.dragOver(list);
    fireEvent.dragEnter(list);
    fireEvent.drop(listItem);
    fireEvent.dragEnd(list);
  });
});
