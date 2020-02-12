import { createMuiTheme } from "@material-ui/core/styles";
import { cyan, amber } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    primary: cyan,
    secondary: amber,
    background: {
      // paper: "#e8e8e8",
      default: "#f8f8f8"
    }
  },
  props: {
    MuiMenuItem: {
      dense: true
    },
    MuiMenuList: {
      dense: true
    }
  }
});
