import * as React from "react";
import LayerView from "./LayerView";
import { Paper, Typography, Grid, Button, Divider } from "@material-ui/core";
import ChangeLayoutModal from "../modal/ChangeLayoutModal";
import Keyboard from "../../model/Keyboard";
import { Language } from "@material-ui/icons";
import ModifierListView from "./ModifierListView";
import KeyboardModifier from "../../model/KeyboardModifier";
import Layer from "../../model/Layer";

interface Props {
  keyboard: Keyboard;
  /**
   * This callback is invoked when the instance of Keyboard changes for some
   * reason. Note that modifier changes don't fire whenever the selection
   * changes, only when the list of modifiers is changed.
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
  constructor(props: Props) {
    super(props);
    // Initialize state with no selected modifiers.
    this.state = {
      selectedModifiers: [],
    };
  }
  changeLayoutModal: ChangeLayoutModal | null = null;

  /**
   * Finds the layer corresponding to the modifier combination, and returns its
   * index in this keyboard. If no layer matches, returns -1.
   * @param modifiers Modifier combination to look for.
   */
  layerIndexFromModifiers(modifiers: KeyboardModifier[]): number {
    // We could cache this result, but I don't want to optimize prematurely.
    const layers = this.props.keyboard.layers;
    // Loop through the layers looking for the correct one
    for (var i = 0; i < layers.length; i++) {
      const currentLayer = layers[i];
      // The modifier combination must be exactly the same as described in the
      // layer object. However, the layer describes its modifier combination in
      // strings.
      // Testing for same length, and then for presence of every modifier is
      // enough to assert equality.
      if (modifiers.length === currentLayer.modifiers.length) {
        if (
          modifiers.every((selectedModifier) => {
            // Each pressed modifier is present in the layer's modifier list
            return (
              currentLayer.modifiers.findIndex(
                (name) => name === selectedModifier.name
              ) !== -1
            );
          })
        ) {
          return i;
        }
      }
    }
    // If we looped through every layer but didn't find the correct combination:
    return -1;
  }

  render(): JSX.Element {
    const selectedLayerIndex = this.layerIndexFromModifiers(
      this.state.selectedModifiers
    );
    const selectedLayer: Layer | null =
      selectedLayerIndex === -1
        ? null
        : this.props.keyboard.layers[selectedLayerIndex];
    console.log(`INDEX: ${selectedLayerIndex}`);
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
        <Grid container style={{ flexGrow: 0 }}>
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
          remaps={selectedLayer !== null ? selectedLayer.remaps : null}
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
    <Typography
      variant="h4"
      noWrap
      style={{
        color: "#808080",
        fontFamily: "Consolas",
      }}
    >
      {name}
    </Typography>
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
