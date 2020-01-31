import * as React from "react";
import * as ReactDOM from "react-dom";
import Key from "./view/Key";
import KeystrokeCommand from "./model/KeystrokeCommand";
import UnicodeCommand from "./model/KeystrokeCommands/UnicodeCommand";
import Titlebar from "./view/titlebar/Titlebar";
import styled from "styled-components";

const Index = () => {
  const keyCommand: KeystrokeCommand = new UnicodeCommand(
    "2A",
    [45, 45, 45],
    true
  );
  return (
    <Titlebar title="Azinth editor">
      <Key keyCommand={keyCommand} bottomLabel="Top" />
      <Key keyCommand={keyCommand} width={1.5} bottomLabel="Charm" />
      <Key keyCommand={keyCommand} height={2} bottomLabel="Strange" />
    </Titlebar>
  );
};

ReactDOM.render(<Index />, document.getElementById("app"));
