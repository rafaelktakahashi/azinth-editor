import * as React from "react";
import KeystrokeCommand from "../model/KeystrokeCommand";

const UNIT_LENGTH = 40;

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
          width: UNIT_LENGTH,
          height: UNIT_LENGTH,
          border: "2px solid black",
          backgroundColor: "#d8d8d8",
          borderRadius: 4,
          alignItems: "center",
          justifyItems: "center"
        }}
      >
        <p
          style={{
            textAlign: "center",
            verticalAlign: "center",
            fontFamily: "Trebuchet MS"
          }}
        >
          {this.props.keyCommand.scancode}
        </p>
      </div>
    );
  }
}
