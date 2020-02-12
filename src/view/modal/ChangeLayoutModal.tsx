import * as React from "react";
import Modal from "@material-ui/core/Modal";
import ModalContainer from "./ModalContainer";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid
} from "@material-ui/core";
import {
  PhysicalLayout,
  getPhysicalLayoutsList
} from "../../resources/physicalLayouts";
import {
  LogicalLayout,
  getLogicalLayoutsList
} from "../../resources/logicalLayouts";

interface State {
  open: boolean;
  selectedPhysicalLayout?: PhysicalLayout;
  selectedLogicalLayout?: LogicalLayout;
}
export default class ChangeLayoutModal extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      open: false,
      selectedPhysicalLayout: null,
      selectedLogicalLayout: null
    };
  }

  openModal(
    currentPhysicalLayout: PhysicalLayout,
    currentLogicalLayout: LogicalLayout
  ) {
    this.setState({
      open: true,
      selectedPhysicalLayout: currentPhysicalLayout,
      selectedLogicalLayout: currentLogicalLayout
    });
  }

  render(): JSX.Element {
    return (
      <Modal
        open={this.state.open}
        onClose={() => this.setState({ open: false })}
      >
        <ModalContainer maxWidth="xs" title="Change Layout">
          <Grid container>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="physical-layout-label">
                  Physical Layout
                </InputLabel>
                <Select
                  labelId="physical-layout-label"
                  id="physical-layout-select"
                  style={{ minWidth: 170 }}
                  value={this.state.selectedPhysicalLayout}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    this.setState({
                      selectedPhysicalLayout: event.target
                        .value as PhysicalLayout
                    });
                  }}
                >
                  {getPhysicalLayoutsList().map(ph => (
                    <MenuItem value={ph}>{ph}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="logical-layout-label">
                  Logical Layout
                </InputLabel>
                <Select
                  labelId="logical-layout-label"
                  id="logical-layout-select"
                  style={{ minWidth: 170 }}
                  value={this.state.selectedLogicalLayout}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    this.setState({
                      selectedLogicalLayout: event.target.value as LogicalLayout
                    });
                  }}
                >
                  {getLogicalLayoutsList().map(lg => (
                    <MenuItem value={lg}>{lg}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </ModalContainer>
      </Modal>
    );
  }
}
