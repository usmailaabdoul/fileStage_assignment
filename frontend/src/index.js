import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Todos from "./Todos";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

ReactDOM.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <CssBaseline />
      <Todos />
    </LocalizationProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
