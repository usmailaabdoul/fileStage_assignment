import { FC } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from '../components';

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
    marginTop: "20px"
  },
});

interface IFooter {
  loading: boolean;
  fetchedDueTodos: boolean;
  onClick: () => void;
}

const Footer: FC<IFooter> = ({ loading, fetchedDueTodos, onClick }) => {
  const classes = useStyles();

  return (
    <Box className={classes.footer}>
      <Button
        icon="event"
        onClick={onClick}
        label={fetchedDueTodos ? "All todos" : "Due today"}
        dataTestid="fetch-dueTodos-btn"
      />
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
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
