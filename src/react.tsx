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

import SampleLayout from "../../azinth-core/azinth.json";
import Layout from "./model/Layout";
import LayoutView from "./view/layout/LayoutView";

const Index = () => {
  const [layout, setLayout] = React.useState<Layout>(SampleLayout as Layout);
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
      <MuiThemeProvider theme={Theme}>
        <StyledComponentsThemeProvider theme={Theme}>
          {/** To use a custom titlebar, wrap this view in it */}
          <LayoutView
            layout={layout}
            onKeyboardChanged={(newLayout, index, type) => {
              setLayout(newLayout);
            }}
          />
        </StyledComponentsThemeProvider>
      </MuiThemeProvider>
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("app"));
