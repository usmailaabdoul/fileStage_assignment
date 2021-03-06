import { FC, ReactElement } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import CssBaseline from "@material-ui/core/CssBaseline";
import { render } from "@testing-library/react";

const renderWithProvider = (ui: ReactElement) => {
  const Wrapper: FC = ({ children }) => {
    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <CssBaseline />
        {children}
      </LocalizationProvider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper }),
  };
};

export { renderWithProvider };
