import * as React from "react";
import KeyView, { UNIT_LENGTH } from "./KeyView";
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

/**
 * Collection of keys arranged according to a physical layout. Each key is also
 * given labels that depend on the logical layout.
 */
export default class LayerView extends React.Component<Props, State> {
  // Derive the physical and logical layouts from their names.
  // Note that all objects are preloaded and getting them has little cost.
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
      <div
        style={{
          position: "relative",
          overflow: "auto",
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
                <KeyView
                  width={key.width}
                  height={key.height}
                  xOffset={key.xOffset}
                  yOffset={key.yOffset}
                  bottomLabel={this.state.currentLogicalLayout.labels[scancode]}
                />
              );
            }
          )}
        </Container>
      </div>
    );
  }
}
