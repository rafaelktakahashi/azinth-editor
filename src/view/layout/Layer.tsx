import * as React from "react";
import Key, { UNIT_LENGTH } from "./Key";
import { Container, Paper } from "@material-ui/core";
import {
  getPhysicalLayout,
  PhysicalLayout
} from "../../resources/physicalLayouts/index";
import {
  getLogicalLayout,
  LogicalLayout
} from "../../resources/logicalLayouts/index";

interface Props {
  physicalLayout: PhysicalLayout;
  logicalLayout: LogicalLayout;
}

interface State {
  currentPhysicalLayout: any;
  currentLogicalLayout: any;
  /** Size of this component, based on the keys rendered in it. */
  dimensions: { width: number; height: number };
}

export default class Layer extends React.Component<Props, State> {
  static getDerivedStateFromProps(
    props: Props,
    prevState: State
  ): Partial<State> | null {
    const physLayout = getPhysicalLayout(props.physicalLayout);
    // If it stayed the same, skip this method
    if (prevState && physLayout === prevState.currentPhysicalLayout) {
      return null;
    }

    return {
      currentPhysicalLayout: physLayout,
      currentLogicalLayout: getLogicalLayout(props.logicalLayout),
      dimensions: {
        width: UNIT_LENGTH * physLayout.width,
        height: UNIT_LENGTH * physLayout.height
      }
    };
  }

  render(): JSX.Element {
    return (
      <Paper
        style={{
          position: "relative",
          padding: 10,
          overflow: "auto",
          backgroundColor: "#e8e8e8",
          maxWidth: this.state.dimensions.width
        }}
      >
        <Container
          style={{
            height: this.state.dimensions.height,
            width: this.state.dimensions.width,
            position: "relative"
          }}
        >
          {Object.keys(this.state.currentPhysicalLayout.keys).map(scancode => {
            const key = this.state.currentPhysicalLayout.keys[scancode];
            return (
              <Key
                width={key.width}
                height={key.height}
                xOffset={key.xOffset}
                yOffset={key.yOffset}
                bottomLabel={this.state.currentLogicalLayout.labels[scancode]}
              />
            );
          })}
        </Container>
      </Paper>
    );
  }
}
