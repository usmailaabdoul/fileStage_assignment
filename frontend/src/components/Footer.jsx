import React from "react";
import { Button, Icon, Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  dueBtn: {
    background: "#2A85FF",
    borderRadius: "8px",
    height: "45px",
    padding: "0 20px",
    color: "#FFFFFF",
    fontWeight: "bold",

    "&:hover": {
      background: "#0069f6",
    },
    marginTop: "20px",
    marginLeft: 0,
  },
  footer: {
    display: "flex",
  },
});

const Footer = ({ loading, fetchedDueTodos, onClick }) => {
  const classes = useStyles();

  return (
    <Box className={classes.footer}>
      <Button
        className={classes.dueBtn}
        startIcon={<Icon>event</Icon>}
        onClick={onClick}
        data-testid="fetch-dueTodos-btn"
      >
        {fetchedDueTodos ? "All todos" : "Due today"}
      </Button>

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            marginLeft: "200px",
          }}
          data-testid="loader"
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Footer;
