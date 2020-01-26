import * as React from "react";
import * as ReactDOM from "react-dom";
import Key from "./view/Key";
import KeystrokeCommand from "./model/KeystrokeCommand";
import UnicodeCommand from "./model/KeystrokeCommands/UnicodeCommand";

const Index = () => {
  const keyCommand: KeystrokeCommand = new UnicodeCommand(
    "2A",
    [45, 45, 45],
    true
  );
  return <Key keyCommand={keyCommand} />;
};

ReactDOM.render(<Index />, document.getElementById("app"));
