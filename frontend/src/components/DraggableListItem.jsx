import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Typography, Button, Icon, Box, Checkbox } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles({
  todoContainer: {
    borderBottom: "1px solid #bfbfbf",
    marginBottom: 5,
    "&:last-child": {
      margin: 0,
      borderBottom: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  deleteTodo: {
    visibility: "hidden",
  },
  draggingListItem: {
    background: "rgb(235,235,235)",
  },
});

const DraggableListItem = ({
  id,
  text,
  dueDate,
  index,
  completed,
  toggleTodoCompleted,
  deleteTodo,
}) => {
  const classes = useStyles();

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          display="flex"
          flex="1"
          alignItems="center"
          className={clsx(
            classes.todoContainer,
            snapshot.isDragging ? classes.draggingListItem : ""
          )}
        >
          <Box flex={1}>
            <Checkbox
              checked={completed}
              onChange={() => toggleTodoCompleted(id)}
            ></Checkbox>
          </Box>
          <Box flex={3}>
            <Typography
              className={completed ? classes.todoTextCompleted : ""}
              variant="body1"
            >
              {text}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body1">{moment(dueDate).fromNow()}</Typography>
          </Box>
          <Box flex={1}>
            <Button
              className={classes.deleteTodo}
              startIcon={<Icon>delete</Icon>}
              onClick={() => deleteTodo(id)}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
