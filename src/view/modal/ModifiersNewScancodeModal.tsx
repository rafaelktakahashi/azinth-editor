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
  Input,
  TextField,
  Grid,
  Select,
  MenuItem,
} from '@material-ui/core';
import ModalContainer from './ModalContainer';
import KeyboardModifier from '../../model/KeyboardModifier';
import Keyboard from '../../model/Keyboard';
import Scancode, { ScancodeComparator } from '../../model/Scancode';
import {
  LogicalLayout,
  getLogicalLayout,
} from '../../resources/logicalLayouts';

type ModifiersNewScancodeModalResponse = { newScancode: string };

interface Props {
  // This prop is an object map of scancode -> label. Only the scancodes
  // contained in it will be presented as options. Futurally, we should also
  // let the user press a key on the keyboard.
  scancodeLabels: { [key: string]: string };
}

interface State {
  open: boolean;
  scancode: string;
  // This should've been a Scancode[], but has to be string to be indexable.
  orderedScancodeList: string[];
}

export default class ModifiersNewScancodeModal extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    // Also set the ordered list of scancodes, to use in the dropdown.
    const orderedScancodes: string[] = Object.keys(props.scancodeLabels);
    orderedScancodes.sort(ScancodeComparator);
    this.state = {
      open: false,
      scancode: '',
      orderedScancodeList: orderedScancodes,
    };
  }

  resolver: null | ((arg0: ModifiersNewScancodeModalResponse) => void) = null;
  rejecter: null | ((arg0: Error) => void) = null;

  openModal(): Promise<ModifiersNewScancodeModalResponse> {
    this.setState({ open: true, scancode: '' });

    return new Promise<ModifiersNewScancodeModalResponse>(
      ((
        resolve: (arg: ModifiersNewScancodeModalResponse) => void,
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
          this.resolver?.({
            newScancode: this.state.scancode,
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
          maxWidth='xs'
          title='Add scancode'
          onClose={() => {
            this.closeModal('closeButton');
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Select
                value={this.state.scancode}
                label={
                  this.props.scancodeLabels[this.state.scancode] ||
                  this.state.scancode
                }
                onChange={(e) => {
                  this.setState({
                    scancode: e.target.value as string,
                  });
                }}
              >
                {this.state.orderedScancodeList.map((key) => (
                  <MenuItem value={key} key={key}>
                    <Typography>
                      {key} <b>{this.props.scancodeLabels[key]}</b>
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid xs={12}>
              <Button
                color='primary'
                style={{ alignSelf: 'end' }}
                onClick={() => {
                  this.closeModal();
                }}
              >
                OK
              </Button>
            </Grid>
          </Grid>
        </ModalContainer>
      </Modal>
    );
  }
}
