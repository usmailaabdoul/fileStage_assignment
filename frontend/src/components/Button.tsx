import { FC } from 'react';
import {
  Button,
  Icon
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface IButton {
  label: string;
  icon: string;
  dataTestid: string;
  onClick: () => void;
}

const useStyles = makeStyles({
  button: {
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
});

const ButtonComponent: FC<IButton> = (
  { label, icon, onClick, dataTestid }
) => {
  const classes = useStyles();

  return (
    <Button
      className={classes.button}
      startIcon={<Icon>{icon}</Icon>}
      onClick={() => onClick()}
      data-testid={dataTestid}
    >
      {label}
    </Button>
  )
}

export default ButtonComponent