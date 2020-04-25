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
} from '@material-ui/core';
import ModalContainer from './ModalContainer';
import KeyboardModifier from '../../model/KeyboardModifier';
import Keyboard from '../../model/Keyboard';
import Scancode from '../../model/Scancode';
import {
  LogicalLayout,
  getLogicalLayout,
} from '../../resources/logicalLayouts';

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
          <TableContainer component={Paper}>
            <Table>
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
                        onDelete={(scIndex: number): void => {
                          const newModList = [...this.state.modifiers];
                          newModList[i].scancodes = this.state.modifiers[
                            i
                          ].scancodes
                            .slice(0, scIndex)
                            .concat(
                              this.state.modifiers[i].scancodes.slice(
                                scIndex + 1
                              )
                            );
                          this.setState({
                            modifiers: newModList,
                          });
                        }}
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

const ScancodeSet: React.FunctionComponent<{
  scancodes: Scancode[];
  labels: any;
  onDelete: (index: number) => void;
}> = ({ scancodes, labels, onDelete }) => {
  return (
    <Box style={{ display: 'flex', flexDirection: 'row' }}>
      {scancodes.map((sc, i) => {
        const label = labels[sc.toLowerCase()];
        const text = label ? `${sc}:${label}` : sc;
        return (
          <Chip
            label={text}
            key={`scancode-chip-${i}`}
            onDelete={() => onDelete(i)}
            style={{ marginLeft: 5, marginRight: 5 }}
          />
        );
      })}
    </Box>
  );
};
