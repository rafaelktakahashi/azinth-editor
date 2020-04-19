import { createMuiTheme } from "@material-ui/core/styles";
import { blue, amber } from "@material-ui/core/colors";
import { Overrides as CoreOverrides } from "@material-ui/core/styles/overrides";
import { ToggleButtonClassKey } from "@material-ui/lab";
import { CSSProperties } from "@material-ui/styles";

interface Overrides extends CoreOverrides {
  MuiToggleButton?:
    | Partial<
        Record<ToggleButtonClassKey, CSSProperties | (() => CSSProperties)>
      >
    | undefined;
}

const overrides: Overrides = {
  MuiToggleButton: {
    root: {
      // Default is uppercase, for some reason.
      textTransform: "none",
      // Also, this component doesn't seem to actually care about its own
      // 'selected' class, and instead uses the regular button's class.
    },
  },
};

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
  overrides,
});
