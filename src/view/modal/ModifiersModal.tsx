import * as React from 'react';
import {
  Modal,
  Typography,
  Table,
  Paper,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Box,
  Chip,
  Button,
} from '@material-ui/core';
import ModalContainer from './ModalContainer';
import KeyboardModifier from '../../model/KeyboardModifier';
import Keyboard from '../../model/Keyboard';
import Scancode from '../../model/Scancode';
import {
  LogicalLayout,
  getLogicalLayout,
} from '../../resources/logicalLayouts';
import { Add as AddIcon } from '@material-ui/icons';
import ModifiersNewModifierModal from './ModifiersNewModifierModal';
import ModifiersNewScancodeModal from './ModifiersNewScancodeModal';

type ModifiersModalResponse =
  | {
      changed: false;
    }
  | {
      changed: true;
      newModifiers: KeyboardModifier[];
    };

interface State {
  open: boolean;
  modifiers: KeyboardModifier[];
  layout: LogicalLayout;
}

export default class ModifiersModal extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    // The state is properly initialized when this modal is opened.
    this.state = {
      open: false,
      modifiers: [],
      layout: 'US', // Default, should be properly set later.
    };
  }

  // Reference to a modal for adding a new modifier.
  modifiersNewModifierModal: ModifiersNewModifierModal | null = null;

  // Reference to a modal for adding a scancode to an existing modifier.
  modifiersNewScancodeModal: ModifiersNewScancodeModal | null = null;

  resolver: null | ((arg0: ModifiersModalResponse) => void) = null;
  rejecter: null | ((arg0: Error) => void) = null;

  openModal(keyboard: Keyboard): Promise<ModifiersModalResponse> {
    // Make a sufficiently deep copy of the keyboard's modifiers
    const modifiersCopy = keyboard.modifiers.map((m) => {
      return {
        ...m,
        scancodes: m.scancodes.slice(),
      };
    });
    this.setState({
      open: true,
      modifiers: modifiersCopy,
      layout: keyboard.logicalLayout,
    });

    return new Promise<ModifiersModalResponse>(
      ((
        resolve: (arg: ModifiersModalResponse) => void,
        reject: (arg0: Error) => void
      ) => {
        this.resolver = resolve;
        this.rejecter = reject;
      }).bind(this)
    );
  }

  closeModal(canceledReason?: string) {
    this.setState(
      {
        open: false,
      },
      () => {
        if (canceledReason) {
          // Reject with an error whose message is the reason for canceling
          this.rejecter?.(new Error(canceledReason));
        } else {
          // Resolve with a response object
          this.resolver?.({
            changed: true,
            newModifiers: this.state.modifiers,
          });
        }
      }
    );
  }

  /// Callback for each modifier's 'add' button.
  onAddScancodePressed(index: number) {
    // Obtain the new scancode from a prompt.
    this.modifiersNewScancodeModal?.openModal?.().then((sc) => {
      // Obtain the current scancodes, and make a new list that also contains
      // the new scancode.
      const newScancodes: Scancode[] = this.state.modifiers[
        index
      ].scancodes.concat([sc.newScancode]);
      // Make a new list of modifiers to replace the current one in the state.
      let newModifiers = [...this.state.modifiers];
      newModifiers[index] = {
        ...this.state.modifiers[index],
        scancodes: newScancodes,
      };
      this.setState({
        modifiers: newModifiers,
      });
    });
  }

  render(): JSX.Element {
    return (
      <Modal
        open={this.state.open}
        onClose={(_, reason) => this.closeModal(reason)}
      >
        <ModalContainer
          maxWidth='md'
          title='Modifiers'
          onClose={() => {
            this.closeModal('closeButton');
          }}
        >
          <ModifiersNewModifierModal
            ref={(r) => (this.modifiersNewModifierModal = r)}
          />
          <ModifiersNewScancodeModal
            ref={(r) => (this.modifiersNewScancodeModal = r)}
            scancodeLabels={getLogicalLayout(this.state.layout)?.labels}
          />
          <Button
            variant='contained'
            color='primary'
            endIcon={<AddIcon />}
            onClick={() => {
              this.modifiersNewModifierModal?.openModal()?.then((r) => {
                const newModifiers = this.state.modifiers.concat([
                  {
                    name: r.newModifierName,
                    scancodes: [],
                  },
                ]);
                this.setState({
                  modifiers: newModifiers,
                });
              });
            }}
          >
            Add Modifier
          </Button>
          <TableContainer component={Paper}>
            <Table style={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableCell>Name</TableCell>
                <TableCell>Keys</TableCell>
              </TableHead>
              <TableBody>
                {this.state.modifiers.map((mod, i) => (
                  <TableRow key={`modifier-table-row-${i}`}>
                    <TableCell>{mod.name}</TableCell>
                    <TableCell>
                      <ScancodeSet
                        scancodes={mod.scancodes}
                        labels={getLogicalLayout(this.state.layout)?.labels}
                        onChange={(newScancodes) => {
                          // Change the modifiers list to contain the new
                          // scancodes.
                          let newModifiers = [...this.state.modifiers];
                          newModifiers[i] = {
                            ...this.state.modifiers[i],
                            scancodes: newScancodes,
                          };
                          this.setState({
                            modifiers: newModifiers,
                          });
                        }}
                        onAddScancodePressed={() =>
                          this.onAddScancodePressed(i)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ModalContainer>
      </Modal>
    );
  }
}

// TODO: Implement changeable names. Because modifiers are identified by names,
// that implies changing the rest of the keyboard object.

// This renders as a collection of scancodes, to render the scancodes associated
// with a modifier.
const ScancodeSet: React.FunctionComponent<{
  scancodes: Scancode[];
  labels: { [key: string]: string };
  onChange: (newScancodes: Scancode[]) => void;
  onAddScancodePressed: () => void;
}> = ({ scancodes, labels, onChange, onAddScancodePressed }) => {
  // Button to add after the scancodes.
  const addButton = (
    <Button
      color='primary'
      onClick={() => {
        onAddScancodePressed?.();
      }}
    >
      Add
    </Button>
  );

  return (
    <Box style={{ display: 'flex', flexDirection: 'row' }}>
      {scancodes
        .map((sc, i) => {
          const label = labels[sc.toLowerCase()];
          const text = label ? `${sc} (${label})` : sc;
          return (
            <Chip
              label={text}
              key={`scancode-chip-${i}`}
              onDelete={() => {
                // Call onChange with an array of scancodes that doesn't have the
                // element at index i.
                const newScancodes = scancodes
                  .slice(0, i)
                  .concat(scancodes.slice(i + 1));
                onChange(newScancodes);
              }}
              style={{ marginLeft: 5, marginRight: 5 }}
            />
          );
        })
        // Add this item after the chips
        .concat([addButton])}
    </Box>
  );
};
