import * as React from 'react';
import LayerView from './LayerView';
import { Paper, Typography, Grid, Button, Divider } from '@material-ui/core';
import ChangeLayoutModal from '../modal/ChangeLayoutModal';
import Keyboard from '../../model/Keyboard';
import { Language } from '@material-ui/icons';
import ModifierListView from './ModifierListView';
import KeyboardModifier from '../../model/KeyboardModifier';
import Layer from '../../model/Layer';
import ModifiersModal from '../modal/ModifiersModal';
import RemapKeyModal from '../modal/RemapKeyModal';
import Scancode from '../../model/Scancode';
import KeystrokeCommand from '../../model/KeystrokeCommand';

interface Props {
  keyboard: Keyboard;
  /**
   * This callback is invoked when the instance of Keyboard changes for some
   * reason. Note that modifier changes don't fire whenever the selection
   * changes, only when the list of modifiers is changed.
   */
  onKeyboardChanged: (
    newObj: Keyboard,
    type: 'layout' | 'modifier' | 'command'
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
  // Reference to a modal for changing layout
  changeLayoutModal: ChangeLayoutModal | null = null;
  // Reference to a modal for editing modifiers
  modifiersModal: ModifiersModal | null = null;
  // Reference to a modal for editing commands
  remapKeyModal: RemapKeyModal | null = null;

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

  // Update the keyboard's modifiers. Some layers may be changed.
  updateModifiers(modifiers: KeyboardModifier[]) {
    // Get both old and new modifiers.
    const prevModifiers = this.props.keyboard.modifiers;
    const nextModifiers = modifiers;

    let newLayers = this.props.keyboard.layers;
    // Loop through the old modifiers to find any that has been removed.
    for (let i = 0; i < prevModifiers.length; i++) {
      const prevMod = prevModifiers[i];
      // We don't expect so many modifiers to exist as to make this slow.
      const stillExists =
        nextModifiers.findIndex(
          (it) => it.name.localeCompare(prevMod.name) == 0
        ) != -1;
      if (!stillExists) {
        // Then, the special handling happens here; we need to remove all layers
        // that use the deleted modifier.
        newLayers = newLayers.filter(
          (l) => !l.modifiers.some((m) => m.localeCompare(prevMod.name) == 0)
        );
      }
    }

    // Set the new modifiers, and also set the new layers in case it changed.
    this.props.onKeyboardChanged(
      {
        ...this.props.keyboard,
        modifiers: modifiers,
        layers: newLayers,
      },
      'modifier'
    );
  }

  // TODO: We'll eventually need a different method for changing a modifier's
  // name. We'll have to look through the existing layers to update them.
  // Might be more doable to simply add an 'alias' and use a uuid or something
  // for the modifier names.

  // Assign a new keystroke command to the key of specified scancode in the
  // currently selected layer. The remap is saved to the keyboard object.
  replaceCommand(scancode: Scancode, command: KeystrokeCommand) {
    // First, find the selected layer's index.
    const selectedLayerIndex = this.layerIndexFromModifiers(
      this.state.selectedModifiers
    );
    if (selectedLayerIndex == -1) {
      // This may be an empty layer, in which case we must instantiate a new
      // layer with just this remap and add it to the keyboard.
      const newLayer: Layer = {
        // New alias is "Neutral layer" if it's activated by pressing down no
        // modifiers, and it's a list of the modifiers' names otherwise.
        alias:
          this.state.selectedModifiers.length == 0
            ? 'Neutral layer'
            : this.state.selectedModifiers.map((mod) => mod.name).join(' + '),
        modifiers: this.state.selectedModifiers.map((mod) => mod.name),
        remaps: [command],
      };
      // Now make the new keyboard that simply has this added layer in it.
      const newKeyboard: Keyboard = {
        ...this.props.keyboard,
        layers: this.props.keyboard.layers.concat(newLayer),
      };
      this.props.onKeyboardChanged?.(newKeyboard, 'command');
    } else {
      // Create a copy of the layer, except that it has the new command at the
      // specified scancode.
      // This is a little complicated because scancodes aren't indexes of an
      // object; the commands exist in a list, and the scancodes are a field in
      // each command. Thus, we must look for a command with the same scancode
      // and replace it if it exists.
      const existingLayer = this.props.keyboard.layers[selectedLayerIndex];
      const existingCommands: KeystrokeCommand[] = existingLayer.remaps;
      const existingRemapIndex = existingCommands.findIndex(
        (it) => it.scancode.localeCompare(scancode) == 0
      );
      let newCommands: KeystrokeCommand[];
      if (existingRemapIndex == -1) {
        // Append to the old list.
        newCommands = [...existingCommands].concat(command);
      } else {
        // Replace the item with the same scancode.
        newCommands = [...existingCommands];
        newCommands[existingRemapIndex] = command;
      }
      // Make the new array of layers; it's the same as the old one, except that
      // it has the new array of commands.
      const newLayer: Layer = {
        ...existingLayer,
        remaps: newCommands,
      };
      const newLayerArray: Layer[] = [...this.props.keyboard.layers];
      newLayerArray[selectedLayerIndex] = newLayer;
      // Make the new keyboard; it's the same as the old one, except that it has
      // the new layer.
      const newKeyboard: Keyboard = {
        ...this.props.keyboard,
        layers: newLayerArray,
      };
      this.props.onKeyboardChanged?.(newKeyboard, 'command');
    }
  }

  render(): JSX.Element {
    const selectedLayerIndex = this.layerIndexFromModifiers(
      this.state.selectedModifiers
    );
    const selectedLayer: Layer | null =
      selectedLayerIndex === -1
        ? null
        : this.props.keyboard.layers[selectedLayerIndex];
    return (
      <Paper
        style={{
          position: 'relative',
          display: 'inline-block',
          margin: 10,
          padding: 10,
          backgroundColor: '#e8e8e8',
        }}
      >
        <ChangeLayoutModal ref={(r) => (this.changeLayoutModal = r)} />
        <ModifiersModal ref={(r) => (this.modifiersModal = r)} />
        <RemapKeyModal ref={(r) => (this.remapKeyModal = r)} />
        <Grid container style={{ flexGrow: 0 }}>
          <Grid item xs={10}>
            <KeyboardTitle
              alias={this.props.keyboard.alias}
              name={this.props.keyboard.name}
            />
          </Grid>
          <Grid item xs={2}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <ChangeLayoutButton
                onClick={() => {
                  this.changeLayoutModal
                    ?.openModal(
                      this.props.keyboard.physicalLayout,
                      this.props.keyboard.logicalLayout
                    )
                    ?.then((r) => {
                      const newKeyboard: Keyboard = {
                        ...this.props.keyboard,
                        logicalLayout: r.selectedLogicalLayout,
                        physicalLayout: r.selectedPhysicalLayout,
                      };
                      this.props.onKeyboardChanged(newKeyboard, 'layout');
                    })
                    ?.catch((e) => {
                      console.warn(`Error: ${e.message || e}`);
                    });
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} style={{ paddingTop: 10, paddingBottom: 10 }}>
            <ModifierListView
              keyboardModifiers={this.props.keyboard.modifiers}
              selectedKeyboardModifiers={this.state.selectedModifiers}
              onSelectionChanged={(newSelection, _) => {
                this.setState({
                  selectedModifiers: newSelection,
                });
              }}
              onEditClicked={() => {
                this.modifiersModal
                  ?.openModal(this.props.keyboard)
                  ?.then((response) => {
                    if (response.changed) {
                      this.updateModifiers(response.newModifiers);
                    }
                  });
              }}
            />
          </Grid>
        </Grid>
        <LayerView
          physicalLayout={this.props.keyboard.physicalLayout}
          logicalLayout={this.props.keyboard.logicalLayout}
          remaps={selectedLayer !== null ? selectedLayer.remaps : null}
          onKeyClicked={(scancode, command) => {
            this.remapKeyModal
              ?.openModal(scancode, command, this.props.keyboard.logicalLayout)
              ?.then((response) => {
                this.replaceCommand(scancode, response.command);
              });
          }}
        />
      </Paper>
    );
  }
}

const KeyboardTitle = ({ alias, name }: { alias: string; name: string }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
    }}
  >
    <Typography variant='h1' color='primary'>
      {alias}
    </Typography>
    <div style={{ width: 10 }} />
    <Typography
      variant='h4'
      noWrap
      style={{
        color: '#808080',
        fontFamily: 'Consolas',
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
    <Language fontSize='small' />
  </Button>
);
