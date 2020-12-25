import * as React from 'react';
import KeyView, { UNIT_LENGTH } from './KeyView';
import { Container, Paper, Button } from '@material-ui/core';
import { Language } from '@material-ui/icons';
import {
  getPhysicalLayout,
  PhysicalLayout,
} from '../../resources/physicalLayouts/index';
import {
  getLogicalLayout,
  LogicalLayout,
} from '../../resources/logicalLayouts/index';
import ChangeLayoutModal from '../modal/ChangeLayoutModal';
import KeystrokeCommand from '../../model/KeystrokeCommand';
import Scancode from '../../model/Scancode';

interface Props {
  physicalLayout: PhysicalLayout;
  logicalLayout: LogicalLayout;
  // Use null for an empty layer (a layer with no registered remaps).
  remaps: KeystrokeCommand[] | null;
  // Callback for when a key is clicked on the on-screen keyboard.
  onKeyClicked: (scancode: Scancode, command?: KeystrokeCommand) => void;
}

interface State {
  // Dynamic; read from a json
  currentPhysicalLayout: any;
  // Dynamic; read from a json
  currentLogicalLayout: any;
  /** Size of this component, based on the keys rendered in it. */
  dimensions: { width: number; height: number };
}

/**
 * Collection of keys arranged according to a physical layout. Each key is also
 * given labels that depend on the logical layout.
 */
export default class LayerView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentPhysicalLayout: {},
      currentLogicalLayout: {},
      dimensions: { width: 0, height: 0 },
    };
  }

  // Derive the physical and logical layouts from their names.
  // Note that all objects are preloaded and getting them has little cost.
  static getDerivedStateFromProps(
    props: Props,
    prevState: State
  ): Partial<State> | null {
    const physLayout = getPhysicalLayout(props.physicalLayout);

    return {
      currentPhysicalLayout: physLayout,
      currentLogicalLayout: getLogicalLayout(props.logicalLayout),
      dimensions: {
        width: UNIT_LENGTH * physLayout.width,
        height: UNIT_LENGTH * physLayout.height,
      },
    };
  }

  changeLayoutModal: ChangeLayoutModal | null = null;

  changeLayout(): void {
    this.changeLayoutModal
      ?.openModal(
        this.state.currentPhysicalLayout,
        this.state.currentLogicalLayout
      )
      .then((r) => {
        this.setState({
          currentPhysicalLayout: r.selectedPhysicalLayout,
          currentLogicalLayout: r.selectedLogicalLayout,
        });
      })
      .catch((e) => {
        console.warn(`Error: ${e.message}`);
      });
  }

  render(): JSX.Element {
    return (
      <div
        style={{
          position: 'relative',
          overflow: 'auto',
          maxWidth: this.state.dimensions.width,
        }}
      >
        <ChangeLayoutModal ref={(r) => (this.changeLayoutModal = r)} />
        <Container
          style={{
            height: this.state.dimensions.height,
            width: this.state.dimensions.width,
            position: 'relative',
          }}
        >
          {/** Render one key for each item in the physical layout */}
          {Object.keys(this.state.currentPhysicalLayout.keys).map(
            (scancode, index) => {
              const key = this.state.currentPhysicalLayout.keys[scancode];
              const commandIndex = this.props.remaps?.findIndex(
                (remap) => remap.scancode === scancode
              );
              const command =
                commandIndex === -1 || commandIndex === undefined
                  ? undefined
                  : this.props.remaps?.[commandIndex];
              return (
                <KeyView
                  key={`keyview-${index}`}
                  width={key.width}
                  height={key.height}
                  xOffset={key.xOffset}
                  yOffset={key.yOffset}
                  bottomLabel={this.state.currentLogicalLayout.labels[scancode]}
                  keyCommand={command}
                  onClick={() => {
                    this.props.onKeyClicked?.(scancode, command);
                  }}
                />
              );
            }
          )}
        </Container>
      </div>
    );
  }
}
