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
  return (
    <div>
      <Key keyCommand={keyCommand} bottomLabel="Top" />
      <Key keyCommand={keyCommand} width={1.5} bottomLabel="Charm" />
      <Key keyCommand={keyCommand} height={2} bottomLabel="Strange" />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("app"));
