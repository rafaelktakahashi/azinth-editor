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
  AppBar,
  Tabs,
  Tab,
  IconButton,
} from '@material-ui/core';
import ModalContainer from './ModalContainer';
import KeyboardModifier from '../../model/KeyboardModifier';
import Keyboard from '../../model/Keyboard';
import Scancode, { ScancodeComparator } from '../../model/Scancode';
import {
  LogicalLayout,
  getLogicalLayout,
} from '../../resources/logicalLayouts';
import KeystrokeCommand from '../../model/KeystrokeCommand';
import {
  getPhysicalLayout,
  PhysicalLayout,
} from '../../resources/physicalLayouts';
import UnicodeCommand from '../../model/KeystrokeCommands/UnicodeCommand';
import MacroCommand, {
  VirtualKeypress,
} from '../../model/KeystrokeCommands/MacroCommand';
import DeadKeyCommand, {
  Replacement,
} from '../../model/KeystrokeCommands/DeadKeyCommand';
import ExecutableCommand from '../../model/KeystrokeCommands/ExecutableCommand';
import { Close } from '@material-ui/icons';

function TabPanel(props: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

type RemapKeyModalResponse = { command: KeystrokeCommand };

const initialState = {
  open: false,
  currentTab: 0,
  unicodeCodepoints: [],
  macroKeypresses: [],
  deadKeyIndependentCodepoints: [],
  deadKeySubstitutions: [],
  executableFilename: '',
  executableArguments: '',
  scancodeList: [],
};

interface Props {}

interface State {
  open: boolean;
  // 0: Unicode command;
  // 1: Macro command;
  // 2: Dead key command;
  // 3: Executable command.
  currentTab: number;
  // State for the unicode tab:
  unicodeCodepoints: number[];
  // State for the macro tab:
  macroKeypresses: VirtualKeypress[];
  // State for the dead key tab:
  deadKeyIndependentCodepoints: number[];
  deadKeySubstitutions: Replacement[];
  // State for the executable tab:
  executableFilename: string;
  executableArguments: string | undefined;
  // This is for the dropdown options when choosing a sequence of macro
  // keypresses.
  scancodeList: {
    scancode: Scancode;
    keyName: string; // Name varies depending on the physical layout.
  }[];
}

export default class RemapKeyModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  resolver: null | ((arg0: RemapKeyModalResponse) => void) = null;
  rejecter: null | ((arg0: Error) => void) = null;

  openModal(
    scancode: Scancode,
    currentCommand: KeystrokeCommand | undefined,
    logicalLayout: LogicalLayout
  ): Promise<RemapKeyModalResponse> {
    // Initialize with an initial state that depends on the existing command,
    // if one was given.
    const firstState = currentCommand
      ? this.applyExistingKeystrokeCommand(currentCommand)
      : initialState;
    // Also set the ordered list of scancodes, to use in the dropdown.
    const layoutFile = getLogicalLayout(logicalLayout);
    const orderedKeys = Object.keys(layoutFile.labels);
    orderedKeys.sort(ScancodeComparator);
    // In addition, reset the other fields using the initial state.
    this.setState({
      ...firstState,
      open: true,
      scancodeList: orderedKeys.map((sc) => ({
        scancode: sc,
        keyName: (layoutFile.labels as { [key: string]: string })[sc],
      })),
    });

    return new Promise<RemapKeyModalResponse>(
      ((
        resolve: (arg: RemapKeyModalResponse) => void,
        reject: (arg0: Error) => void
      ) => {
        this.resolver = resolve;
        this.rejecter = reject;
      }).bind(this)
    );
  }

  // 'Adds' a keystroke command to the default state. Returns the state, but
  // with its fields changed to contain the information in the informed
  // command.
  applyExistingKeystrokeCommand(command: KeystrokeCommand): State {
    if (command.type == 'unicode') {
      // In case of unicode command, set the unicode text and choose the
      // first tab.
      return {
        ...initialState,
        unicodeCodepoints: (command as UnicodeCommand).codepoints,
        currentTab: 0,
      };
    } else if (command.type == 'macro') {
      // In case of macro command, set the macro scancodes and choose the
      // second tab.
      return {
        ...initialState,
        macroKeypresses: (command as MacroCommand).keypresses,
        currentTab: 1,
      };
    } else if (command.type == 'deadkey') {
      // In case of dead key, set the independent codepoints and the
      // substitution map, and set the third tab.
      return {
        ...initialState,
        deadKeyIndependentCodepoints: (command as DeadKeyCommand).codepoints,
        deadKeySubstitutions: (command as DeadKeyCommand).replacements,
        currentTab: 2,
      };
    } else if (command.type == 'executable') {
      // In case of an executable, set the executable's filename and the args,
      // and choose the fourth tab.
      return {
        ...initialState,
        executableFilename: (command as ExecutableCommand).path,
        executableArguments: (command as ExecutableCommand).arguments,
        currentTab: 3,
      };
    } else {
      return initialState;
    }
  }

  closeModal(canceledReason?: string) {
    this.setState(
      {
        open: false,
      },
      () => {
        if (canceledReason) {
          // Reject with an error whose message is the reason for canceling.
          this.rejecter?.(new Error(canceledReason));
        } else {
          // TODO! Create the correct command here.
          this.resolver?.({ command: new UnicodeCommand('01', [55], false) });
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
          clear
          onClose={() => {
            this.closeModal('closeButton');
          }}
        >
          <AppBar
            position='static'
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Tabs value={this.state.currentTab}>
              <Tab
                label='Unicode'
                onClick={(_) => {
                  this.setState({ currentTab: 0 });
                }}
              />
              <Tab
                label='Macro'
                onClick={(_) => {
                  this.setState({ currentTab: 1 });
                }}
              />
              <Tab
                label='Dead key'
                onClick={(_) => {
                  this.setState({ currentTab: 2 });
                }}
              />
              <Tab
                label='Executable'
                onClick={(_) => {
                  this.setState({ currentTab: 3 });
                }}
              />
            </Tabs>
            <IconButton
              onClick={() => {
                this.closeModal();
              }}
            >
              <Close style={{ color: 'white' }} />
            </IconButton>
          </AppBar>
          <TabPanel value={this.state.currentTab} index={0}>
            <Typography>Unicode tab content</Typography>
          </TabPanel>
          <TabPanel value={this.state.currentTab} index={1}>
            <Typography>Macro tab content</Typography>
          </TabPanel>
          <TabPanel value={this.state.currentTab} index={2}>
            <Typography>Dead key tab content</Typography>
          </TabPanel>
          <TabPanel value={this.state.currentTab} index={3}>
            <Typography>Executable tab content</Typography>
          </TabPanel>
        </ModalContainer>
      </Modal>
    );
  }
}
