import * as React from "react";
import Key, { UNIT_LENGTH } from "./Key";
import { Container, Paper, Button } from "@material-ui/core";
import { Language } from "@material-ui/icons";
import {
  getPhysicalLayout,
  PhysicalLayout,
} from "../../resources/physicalLayouts/index";
import {
  getLogicalLayout,
  LogicalLayout,
} from "../../resources/logicalLayouts/index";
import ChangeLayoutModal from "../modal/changeLayoutModal";

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

    return {
      currentPhysicalLayout: physLayout,
      currentLogicalLayout: getLogicalLayout(props.logicalLayout),
      dimensions: {
        width: UNIT_LENGTH * physLayout.width,
        height: UNIT_LENGTH * physLayout.height,
      },
    };
  }

  changeLayoutModal: ChangeLayoutModal | null = null;

  changeLayout(): void {
    this.changeLayoutModal
      ?.openModal(
        this.state.currentPhysicalLayout,
        this.state.currentLogicalLayout
      )
      .then((r) => {
        this.setState({
          currentPhysicalLayout: r.selectedPhysicalLayout,
          currentLogicalLayout: r.selectedLogicalLayout,
        });
      })
      .catch((e) => {
        console.warn(`Error: ${e.message}`);
      });
  }

  render(): JSX.Element {
    return (
      <Paper
        style={{
          position: "relative",
          padding: 10,
          overflow: "auto",
          backgroundColor: "#e8e8e8",
          maxWidth: this.state.dimensions.width,
        }}
      >
        <ChangeLayoutModal ref={(r) => (this.changeLayoutModal = r)} />
        <Container
          style={{
            height: this.state.dimensions.height,
            width: this.state.dimensions.width,
            position: "relative",
          }}
        >
          {/** Render one key for each item in the physical layout */}
          {Object.keys(this.state.currentPhysicalLayout.keys).map(
            (scancode) => {
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
            }
          )}
          {/** Render an options button at the top right */}
          <Button
            onClick={this.changeLayout.bind(this)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              minHeight: 30,
              maxHeight: 30,
              minWidth: 30,
              maxWidth: 30,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Language fontSize="small" />
          </Button>
        </Container>
      </Paper>
    );
  }
}
