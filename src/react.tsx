import * as React from "react";
import * as ReactDOM from "react-dom";
import Layer from "./view/layout/Layer";
import Titlebar from "./view/titlebar/Titlebar";

const Index = () => {
  return (
    <Titlebar title="Azinth editor">
      <Layer logicalLayout="JIS" physicalLayout="JIS" />
    </Titlebar>
  );
};

ReactDOM.render(<Index />, document.getElementById("app"));
