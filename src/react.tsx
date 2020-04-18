import * as React from "react";
import * as ReactDOM from "react-dom";
import Layer from "./view/layout/Layer";
import Titlebar from "./view/titlebar/Titlebar";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import Theme from "./theme";
import Button from "@material-ui/core/Button";
import ChangeLayoutModal from "./view/modal/changeLayoutModal";
import KeyboardView from "./view/layout/KeyboardView";
import Keyboard from "./model/Keyboard";

const Index = () => {
  const sampleKeyboard: Keyboard = {
    alias: "Example Keyboard",
    name: "1234567890",
    logicalLayout: "ABNT_2",
    physicalLayout: "ABNT",
    modifiers: [],
    layers: [
      {
        alias: "Example layer",
        modifiers: [],
        remaps: [],
      },
    ],
  };
  return (
    <MuiThemeProvider theme={Theme}>
      <StyledComponentsThemeProvider theme={Theme}>
        <Titlebar title="Azinth editor">
          <KeyboardView keyboard={sampleKeyboard} />
        </Titlebar>
      </StyledComponentsThemeProvider>
    </MuiThemeProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById("app"));
