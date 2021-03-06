import React from "react";
import {
  Typography,
  Paper,
  Box,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Button } from '../components';

const useStyles = makeStyles({
  addTodoContainer: {
    padding: 10,
  },
  addTodoButton: {
    marginLeft: 5,
    background: "#2A85FF",
    borderRadius: "8px",
    height: "45px",
    padding: "0 20px",
    color: "#FFFFFF",
    fontWeight: "bold",

    "&:hover": {
      background: "#0069f6",
    },
  },
  datePicker: {
    margin: "0px 20px",
  },
});

const Header = ({
  newTodoText,
  addTodo,
  setNewTodoText,
  dueDate,
  setDueDate,
}) => {
  const classes = useStyles();

  return (
    <Box>
      <Box paddingTop="10px">
        <Typography variant="h3" component="h1" gutterBottom>
          Todos
        </Typography>
      </Box>
      <Paper className={classes.addTodoContainer}>
        <Box display="flex" flexDirection="row" alignItems="flex-end">
          <Box flexGrow={1}>
            <TextField
              placeholder="Enter a todo..."
              fullWidth
              value={newTodoText}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  addTodo(newTodoText);
                }
              }}
              onChange={(event) => setNewTodoText(event.target.value)}
            />
          </Box>
          <Box className={classes.datePicker}>
            <DesktopDatePicker
              renderInput={(props) => <TextField {...props} />}
              label="Due date"
              inputFormat="DD/MM/YYYY"
              value={dueDate}
              onChange={(newValue) => {
                setDueDate(newValue);
              }}
            />
          </Box>
          <Button
            icon="add"
            onClick={() => addTodo(newTodoText)}
            label="Add"
            dataTestid="addTodo-btn"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Header;
