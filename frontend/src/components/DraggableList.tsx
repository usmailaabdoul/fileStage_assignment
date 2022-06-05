import { useRef, useCallback, FC } from "react";
import { Paper, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";

import DraggableListItem from "./DraggableListItem";
import { ITodos } from "../api/todo";

const useStyles = makeStyles({
  todosContainer: { marginTop: 10, padding: 10 },
  todoContainer: {
    margin: 0,
    borderTop: "none",
    padding: "0 10px",
  },
  heading: {
    color: "#000",
    fontSize: "18px",
    fontWeight: 700,
  },
});

interface IDraggableList {
  todos: ITodos["data"];
  loading: boolean;
  hasMore: boolean;
  toggleTodoCompleted: (id: string) => void;
  deleteTodo: (id: string) => void;
  onDragEnd: OnDragEndResponder;
  loadMore: () => void;
}

const DraggableList: FC<IDraggableList> = ({
  todos,
  toggleTodoCompleted,
  deleteTodo,
  onDragEnd,
  loading,
  hasMore,
  loadMore,
}) => {
  const classes = useStyles();

  const observer = useRef<IntersectionObserver>();
  const lastTodoElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("fetching more...");
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, loadMore, loading]
  );

  return (
    <Box>
      <Box
        display="flex"
        flex="1"
        alignItems="center"
        className={classes.todoContainer}
      >
        <Box flex={1}>
          <Typography className={classes.heading}>Completed?</Typography>
        </Box>
        <Box flex={3}>
          <Typography className={classes.heading}>Todo</Typography>
        </Box>
        <Box flex={1}>
          <Typography className={classes.heading}>Due Date</Typography>
        </Box>
        <Box flex={1}>
          <Typography className={classes.heading}>Action</Typography>
        </Box>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Paper className={classes.todosContainer}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="stretch"
                  data-testid="draggable-list"
                >
                  {todos &&
                    todos.map(({ id, text, completed, dueDate }, index) => {
                      if (todos.length === index + 1) {
                        return (
                          <div ref={lastTodoElementRef} key={id}>
                            <DraggableListItem
                              key={id}
                              {...{
                                id,
                                text,
                                index,
                                completed,
                                dueDate,
                                toggleTodoCompleted,
                                deleteTodo,
                              }}
                            ></DraggableListItem>
                          </div>
                        );
                      }
                      return (
                        <DraggableListItem
                          key={id}
                          {...{
                            id,
                            text,
                            index,
                            completed,
                            dueDate,
                            toggleTodoCompleted,
                            deleteTodo,
                          }}
                        ></DraggableListItem>
                      );
                    })}
                  {provided.placeholder}
                </Box>
              </Paper>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default DraggableList;
