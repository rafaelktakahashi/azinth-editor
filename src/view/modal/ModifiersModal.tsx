import * as React from 'react';
import { Modal, Typography } from '@material-ui/core';
import ModalContainer from './ModalContainer';
import KeyboardModifier from '../../model/KeyboardModifier';
import Keyboard from '../../model/Keyboard';

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
}

export default class ModifiersModal extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      open: false,
    };
  }

  resolver: null | ((arg0: ModifiersModalResponse) => void) = null;
  rejecter: null | ((arg0: Error) => void) = null;

  openModal(keyboard: Keyboard): Promise<ModifiersModalResponse> {
    this.setState({
      open: true,
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
            // TODO
            changed: true,
            newModifiers: [],
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
        <ModalContainer maxWidth='xs' title='Modifiers'>
          <Typography>Text</Typography>
        </ModalContainer>
      </Modal>
    );
  }
}
