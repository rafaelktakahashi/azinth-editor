import * as React from "react";
import KeystrokeCommand from "../../model/KeystrokeCommand";

// This length is not configurable, unfortunately.
const UNIT_LENGTH = 35;

interface Props {
  shape: "rectangular" | "iso_return" | "big_return";
  /** Width of this key, in units. Has no effect on non-rectangular keys. */
  width: number;
  /** Height of this key, in units. Has no effect on non-rectangular keys. */
  height: number;
  /** Horizontal offset in relation to this component's parent. */
  xOffset: number;
  /** Vertical offset in relation to this component's parent. */
  yOffset: number;
  keyCommand?: KeystrokeCommand;
  bottomLabel: string;
}

export default class Key extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  static defaultProps: Partial<Props> = {
    shape: "rectangular",
    width: 1,
    height: 1,
    bottomLabel: ""
  };

  renderRectangularKey(): JSX.Element {
    return (
      <div
        id="keycap-border"
        style={{
          position: "absolute",
          left: UNIT_LENGTH * this.props.xOffset,
          top: UNIT_LENGTH * this.props.yOffset,
          flex: 1,
          padding: "1px",
          width: UNIT_LENGTH * this.props.width,
          height: UNIT_LENGTH * this.props.height,
          backgroundColor: "#444444"
        }}
      >
        <div
          id="keycap-side"
          style={{
            position: "relative",
            flex: 1,
            width: "100%",
            height: "100%",
            backgroundColor: "#d8d8d8",
            borderRadius: 4
          }}
        >
          <div
            id="keycap-top"
            style={{
              position: "absolute",
              flex: 1,
              top: 2,
              bottom: 3,
              left: 3,
              right: 3,
              backgroundColor: "white",
              alignItems: "center",
              justifyItems: "center",
              justifyContent: "center"
            }}
          >
            <p
              style={{
                flex: 1,
                margin: "auto",
                textAlign: "center"
              }}
            >
              {this.props.keyCommand?.scancode || ""}
            </p>
            <p
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                margin: 0,
                textAlign: "center",
                fontSize: 8
              }}
            >
              {this.props.bottomLabel}
            </p>
          </div>
        </div>
      </div>
    );
  }

  renderIsoReturnKey(): JSX.Element {
    // TODO: Implement ISO Return key shape
    return <div />;
  }

  renderBigReturnKey(): JSX.Element {
    // TODO: Implement big return key shape
    return <div />;
  }

  render(): JSX.Element {
    switch (this.props.shape) {
      case "iso_return":
        return this.renderIsoReturnKey();
      case "big_return":
        return this.renderBigReturnKey();
      case "rectangular":
      default:
        return this.renderRectangularKey();
    }
  }
}
