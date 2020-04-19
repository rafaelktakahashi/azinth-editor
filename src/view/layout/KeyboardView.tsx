import * as React from "react";
import LayerView from "./LayerView";
import { Paper, Typography, Grid, Button, Divider } from "@material-ui/core";
import ChangeLayoutModal from "../modal/ChangeLayoutModal";
import Keyboard from "../../model/Keyboard";
import { Language } from "@material-ui/icons";
import ModifierListView from "./ModifierListView";
import KeyboardModifier from "../../model/KeyboardModifier";

interface Props {
  keyboard: Keyboard;
  /**
   * This callback is invoked when the instance of Keyboard changes for some
   * reason. Note that modifier changes don't fire whenever the selection
   * changes, only when the list of modifiers is changes.
   */
  onKeyboardChanged: (
    newObj: Keyboard,
    type: "layout" | "modifier" | "command"
  ) => void;
}

interface State {
  selectedModifiers: KeyboardModifier[];
}

/**
 * Collection of layers (which are themselves collections of keys). Each layer
 * is given a modifier combination.
 */
export default class KeyboardView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    // Initialize state with no selected modifiers.
    this.state = {
      selectedModifiers: [],
    };
  }
  changeLayoutModal: ChangeLayoutModal | null = null;

  render(): JSX.Element {
    return (
      <Paper
        style={{
          position: "relative",
          display: "inline-block",
          margin: 10,
          padding: 10,
          backgroundColor: "#e8e8e8",
        }}
      >
        <ChangeLayoutModal ref={(r) => (this.changeLayoutModal = r)} />
        <Grid container>
          <Grid xs={10}>
            <KeyboardTitle
              alias={this.props.keyboard.alias}
              name={this.props.keyboard.name}
            />
          </Grid>
          <Grid xs={2}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <ChangeLayoutButton
                onClick={() => {
                  this.changeLayoutModal
                    ?.openModal(
                      this.props.keyboard.physicalLayout,
                      this.props.keyboard.logicalLayout
                    )
                    .then((r) => {
                      const newKeyboard: Keyboard = {
                        ...this.props.keyboard,
                        logicalLayout: r.selectedLogicalLayout,
                        physicalLayout: r.selectedPhysicalLayout,
                      };
                      this.props.onKeyboardChanged(newKeyboard, "layout");
                    })
                    .catch((e) => {
                      console.warn(`Error: ${e.message || e}`);
                    });
                }}
              />
            </div>
          </Grid>
          <Grid xs={12} style={{ paddingTop: 10, paddingBottom: 10 }}>
            <ModifierListView
              keyboardModifiers={this.props.keyboard.modifiers}
              selectedKeyboardModifiers={this.state.selectedModifiers}
              onSelectionChanged={(newSelection, _) => {
                this.setState({
                  selectedModifiers: newSelection,
                });
              }}
            />
          </Grid>
        </Grid>
        <LayerView
          physicalLayout={this.props.keyboard.physicalLayout}
          logicalLayout={this.props.keyboard.logicalLayout}
        />
      </Paper>
    );
  }
}

const KeyboardTitle = ({ alias, name }: { alias: string; name: string }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
    }}
  >
    <Typography variant="h1" color="primary">
      {alias}
    </Typography>
    <div style={{ width: 10 }} />
    <Typography variant="h2">{name}</Typography>
  </div>
);

const ChangeLayoutButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    onClick={onClick}
    style={{
      // Defining size normally doesn't seem to work for buttons
      minHeight: 30,
      maxHeight: 30,
      minWidth: 30,
      maxWidth: 30,
    }}
  >
    <Language fontSize="small" />
  </Button>
);
