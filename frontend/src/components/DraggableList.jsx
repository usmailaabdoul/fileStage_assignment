import { useRef, useCallback } from 'react'
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

const DraggableList = ({ todos, toggleTodoCompleted, deleteTodo, onDragEnd, loading, hasMore, loadMore }) => {
  const classes = useStyles();

  const observer = useRef();
  const lastTodoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    })

    if (node) observer.current.observe(node);
  }, [loading]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Paper className={classes.todosContainer}>
              <Box display="flex" flexDirection="column" alignItems="stretch">
                {todos.map(({ id, text, completed }, index) => {
                  if (todos.length === index + 1) {
                    return (
                      <div
                        ref={lastTodoElementRef}
                        key={id}
                      >
                        <DraggableListItem
                          key={id}
                          {...{ id, text, index, completed, toggleTodoCompleted, deleteTodo }}
                        ></DraggableListItem>
                      </div>
                    )
                  }
                  return (
                    <DraggableListItem
                      key={id}
                      {...{ id, text, index, completed, toggleTodoCompleted, deleteTodo }}
                    ></DraggableListItem>
                  )
                })}
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