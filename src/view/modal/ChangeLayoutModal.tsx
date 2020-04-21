import * as React from 'react';
import Modal from '@material-ui/core/Modal';
import ModalContainer from './ModalContainer';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Button,
} from '@material-ui/core';
import {
  PhysicalLayout,
  getPhysicalLayoutsList,
} from '../../resources/physicalLayouts';
import {
  LogicalLayout,
  getLogicalLayoutsList,
} from '../../resources/logicalLayouts';

interface ChangeLayoutModalResponse {
  selectedPhysicalLayout: PhysicalLayout;
  selectedLogicalLayout: LogicalLayout;
}

interface State {
  open: boolean;
  selectedPhysicalLayout: PhysicalLayout | '';
  selectedLogicalLayout: LogicalLayout | '';
}
export default class ChangeLayoutModal extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      open: false,
      selectedPhysicalLayout: '',
      selectedLogicalLayout: '',
    };
  }

  resolver: null | ((arg0: ChangeLayoutModalResponse) => void) = null;
  rejecter: null | ((arg0: Error) => void) = null;

  openModal(
    currentPhysicalLayout: PhysicalLayout,
    currentLogicalLayout: LogicalLayout
  ): Promise<ChangeLayoutModalResponse> {
    this.setState({
      open: true,
      selectedPhysicalLayout: currentPhysicalLayout,
      selectedLogicalLayout: currentLogicalLayout,
    });

    return new Promise<ChangeLayoutModalResponse>(
      ((
        resolve: (arg0: ChangeLayoutModalResponse) => void,
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
            selectedLogicalLayout:
              this.state.selectedLogicalLayout === ''
                ? 'US' // Avoid defaulting, it's a sign that something's wrong.
                : this.state.selectedLogicalLayout,
            selectedPhysicalLayout:
              this.state.selectedPhysicalLayout === ''
                ? 'ANSI'
                : this.state.selectedPhysicalLayout,
          });
        }
        this.resolver = null;
        this.rejecter = null;
      }
    );
  }

  render(): JSX.Element {
    return (
      <Modal
        open={this.state.open}
        onClose={(_, reason) => this.closeModal(reason)}
      >
        <ModalContainer maxWidth='xs' title='Change Layout'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id='physical-layout-label'>
                  Physical Layout
                </InputLabel>
                <Select
                  labelId='physical-layout-label'
                  id='physical-layout-select'
                  style={{ minWidth: 170 }}
                  value={this.state.selectedPhysicalLayout}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    this.setState({
                      selectedPhysicalLayout: event.target
                        .value as PhysicalLayout,
                    });
                  }}
                >
                  {getPhysicalLayoutsList().map((ph, index) => (
                    <MenuItem
                      key={`physical-layout-option-${index}`}
                      value={ph}
                    >
                      {ph}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id='logical-layout-label'>
                  Logical Layout
                </InputLabel>
                <Select
                  labelId='logical-layout-label'
                  id='logical-layout-select'
                  style={{ minWidth: 170 }}
                  value={this.state.selectedLogicalLayout}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    this.setState({
                      selectedLogicalLayout: event.target
                        .value as LogicalLayout,
                    });
                  }}
                >
                  {getLogicalLayoutsList().map((lg, index) => (
                    <MenuItem key={`logical-layout-option-${index}`} value={lg}>
                      {lg}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant='contained'
                color='primary'
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
