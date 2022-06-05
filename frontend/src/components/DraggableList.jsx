import { useRef, useCallback } from "react";
import { Paper, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import DraggableListItem from "./DraggableListItem";

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
    fontWeight: "700",
  },
  listArea: {
    backgroundColor: "#eee",
    borderRadius: "5px",
    marginTop: "10px",
    padding: "10px",
    height: "70vh",
  },
  lists: {
    height: "95%",
    overflow: "scroll",
  },
});

const DraggableList = ({
  todos,
  toggleTodoCompleted,
  deleteTodo,
  onDragEnd,
  loading,
  hasMore,
  loadMore,
}) => {
  const classes = useStyles();

  const observer = useRef();
  const lastTodoElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, loadMore, loading]
  );

  return (
    <Box className={classes.listArea}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        className={classes.todoContainer}
      >
        <Box flexGrow={1}>
          <Typography className={classes.heading}>Status</Typography>
        </Box>
        <Box flexGrow={4} marginLeft={-5}>
          <Typography className={classes.heading}>Todo</Typography>
        </Box>
        <Box flexGrow={1} marginLeft={-10}>
          <Typography className={classes.heading}>Due Date</Typography>
        </Box>
        <Box flexGrow={1}>
          <Typography className={classes.heading}>Action</Typography>
        </Box>
      </Box>
      <div className={classes.lists}>
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
      </div>
    </Box>
  );
};

export default DraggableList;
