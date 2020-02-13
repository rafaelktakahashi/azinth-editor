import * as React from "react";
import * as ReactDOM from "react-dom";
import Layer from "./view/layout/Layer";
import Titlebar from "./view/titlebar/Titlebar";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import Theme from "./theme";
import Button from "@material-ui/core/Button";
import ChangeLayoutModal from "./view/modal/changeLayoutModal";

const Index = () => {
  return (
    <MuiThemeProvider theme={Theme}>
      <StyledComponentsThemeProvider theme={Theme}>
        <Titlebar title="Azinth editor">
          <ChangeLayoutModal ref={r => (this.changeLayoutModalRef = r)} />
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              (this.changeLayoutModalRef as ChangeLayoutModal)
                ?.openModal("ABNT", "ABNT_2")
                .then(r => {
                  console.log(JSON.stringify(r));
                })
                .catch(e => {
                  console.log(`Error: ${e.message}`);
                });
            }}
          >
            ChangeLayoutModal
          </Button>
          <Layer logicalLayout="ABNT_2" physicalLayout="ABNT" />
          <div style={{ height: 10 }} />
          <Layer logicalLayout="JIS" physicalLayout="JIS" />
          <div style={{ height: 10 }} />
          <Layer logicalLayout="US" physicalLayout="ANSI" />
          <div style={{ height: 60 }} />
        </Titlebar>
      </StyledComponentsThemeProvider>
    </MuiThemeProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById("app"));
