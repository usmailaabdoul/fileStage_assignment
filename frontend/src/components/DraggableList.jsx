import React from 'react'
import {
  Paper,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd';

import DraggableListItem from './DraggableListItem';

const useStyles = makeStyles({
  todosContainer: { marginTop: 10, padding: 10 },
});

const DraggableList = ({ todos, toggleTodoCompleted, deleteTodo, onDragEnd }) => {
  const classes = useStyles();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Paper className={classes.todosContainer}>
              <Box display="flex" flexDirection="column" alignItems="stretch">
                {todos.map(({ id, text, completed }, index) => (
                  <DraggableListItem key={id} {...{ id, text, index, completed, toggleTodoCompleted, deleteTodo }}></DraggableListItem>
                ))}
                {provided.placeholder}
              </Box>
            </Paper>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DraggableList