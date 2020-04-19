import * as React from "react";
import * as ReactDOM from "react-dom";
import LayerView from "./view/layout/LayerView";
import Titlebar from "./view/titlebar/Titlebar";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import Theme from "./theme";
import Button from "@material-ui/core/Button";
import ChangeLayoutModal from "./view/modal/changeLayoutModal";
import KeyboardView from "./view/layout/KeyboardView";
import Keyboard from "./model/Keyboard";

const sampleKeyboard: Keyboard = {
  alias: "Example Keyboard",
  name: "1234567890",
  logicalLayout: "ABNT_2",
  physicalLayout: "ABNT",
  modifiers: [
    {
      name: "Shift",
      scancodes: ["2a", "3e"],
    },
    {
      name: "AltGr",
      scancodes: ["3a"],
    },
  ],
  layers: [
    {
      alias: "Example layer",
      modifiers: [],
      remaps: [],
    },
  ],
};

const Index = () => {
  const [kb, setKb] = React.useState(sampleKeyboard);
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
      <MuiThemeProvider theme={Theme}>
        <StyledComponentsThemeProvider theme={Theme}>
          {/** To use a custom titlebar, wrap this view in it */}

          <KeyboardView
            keyboard={kb}
            onKeyboardChanged={(k, _) => {
              setKb(k);
            }}
          />
        </StyledComponentsThemeProvider>
      </MuiThemeProvider>
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("app"));
