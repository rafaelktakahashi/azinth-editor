import { createMuiTheme } from "@material-ui/core/styles";
import { blue, amber } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    primary: blue,
    secondary: amber,
    background: {
      // paper: "#e8e8e8",
      default: "#f8f8f8",
    },
  },
  props: {
    MuiMenuItem: {
      dense: true,
    },
    MuiMenuList: {
      dense: true,
    },
  },
  typography: {
    fontFamily: ["Roboto", "Segoe UI", "Arial"].join(","),
    h1: {
      fontSize: 24,
    },
    h2: {
      fontSize: 20,
    },
    h3: {
      fontSize: 18,
    },
    h4: {
      fontSize: 16,
    },
    h5: {
      fontSize: 14,
    },
    h6: {
      fontSize: 12,
    },
  },
});
