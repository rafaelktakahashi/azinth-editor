import * as React from "react";
import KeystrokeCommand from "../model/KeystrokeCommand";

interface KeyProps {
  keyCommand: KeystrokeCommand;
}

export default class Key extends React.Component<KeyProps> {
  constructor(props: KeyProps) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div
        style={{
          width: 40,
          height: 40,
          backgroundColor: "grey",
          alignItems: "center",
          justifyItems: "center"
        }}
      >
        <p>{this.props.keyCommand.scancode}</p>
      </div>
    );
  }
}
