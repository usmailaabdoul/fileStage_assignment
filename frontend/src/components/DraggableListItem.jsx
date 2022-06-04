import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Icon,
  Paper,
  Box,
  Checkbox,
} from "@material-ui/core";

const useStyles = makeStyles({
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    "&:first-child": {
      margin: 0,
      borderTop: "none",
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
    background: 'rgb(235,235,235)'
  }
});

const DraggableListItem = ({id, text, dueDate, index, completed, toggleTodoCompleted, deleteTodo}) => {
  const classes = useStyles();

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          display="flex"
          flexDirection="row"
          alignItems="center"
          className={[classes.todoContainer, snapshot.isDragging ? classes.draggingListItem : '']}
        >
          <Checkbox
            checked={completed}
            onChange={() => toggleTodoCompleted(id)}
          ></Checkbox>
          <Box flexGrow={1}>
            <Typography
              className={completed ? classes.todoTextCompleted : ""}
              variant="body1"
            >
              {text}
            </Typography>
          </Box>
          <Box flexGrow={1}>
            <Typography
              variant="body1"
            >
              {dueDate}
            </Typography>
          </Box>
          <Button
            className={classes.deleteTodo}
            startIcon={<Icon>delete</Icon>}
            onClick={() => deleteTodo(id)}
          >
            Delete
          </Button>
        </Box>
      )}
    </Draggable>
  )
}

export default DraggableListItem