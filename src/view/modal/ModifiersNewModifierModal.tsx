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
} from '@material-ui/core';
import ModalContainer from './ModalContainer';
import KeyboardModifier from '../../model/KeyboardModifier';
import Keyboard from '../../model/Keyboard';
import Scancode from '../../model/Scancode';
import {
  LogicalLayout,
  getLogicalLayout,
} from '../../resources/logicalLayouts';

type ModifiersNewModifierModalResponse = { newModifierName: string };

interface State {
  open: boolean;
  name: string;
}

export default class ModifiersNewModifierModal extends React.Component<
  {},
  State
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      open: false,
      name: '',
    };
  }

  resolver: null | ((arg0: ModifiersNewModifierModalResponse) => void) = null;
  rejecter: null | ((arg0: Error) => void) = null;

  openModal(): Promise<ModifiersNewModifierModalResponse> {
    this.setState({
      open: true,
      name: '',
    });

    return new Promise<ModifiersNewModifierModalResponse>(
      ((
        resolve: (arg: ModifiersNewModifierModalResponse) => void,
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
            newModifierName: this.state.name,
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
          title='New modifier'
          onClose={() => {
            this.closeModal('closeButton');
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label='name'
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </Grid>
            <Grid xs={12}>
              <Button
                color='primary'
                style={{
                  alignSelf: 'end',
                }}
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
