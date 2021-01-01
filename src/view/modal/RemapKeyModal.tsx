import * as React from 'react';
import {
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  Card,
  CardContent,
  TextField,
  Grid,
  AppBar,
  Tabs,
  Tab,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  FormControlLabel,
  Paper,
  TablePagination,
  Divider,
  Button,
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

interface UnicodeData {
  symbol: string;
  codepoint: number; // 32-bit unsigned integer
  category: string; // Unicode's general category
}

function codepointsFromText(text: string): number[] {
  return Array.from(text)
    .map((char) => char.codePointAt(0) || -1)
    .filter((cp) => cp > 0);
}

function textFromCodepoints(codepoints: number[]): string {
  return String.fromCodePoint(...codepoints);
}

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
  unicodeText: '',
  unicodeDataArray: [],
  unicodeSelectedCharacterIndex: -1,
  unicodeTriggerOnRepeat: true,
  macroKeypresses: [],
  macroTriggerOnRepeat: false,
  deadKeyIndependentText: '',
  deadKeySubstitutions: [],
  executableFilename: '',
  executableArguments: '',
  scancodeList: [],
};

interface Props {}

// TODO: Get unicharadata to implement the unicode data array.

interface State {
  open: boolean;
  // 0: Unicode command;
  // 1: Macro command;
  // 2: Dead key command;
  // 3: Executable command.
  currentTab: number;
  // State for the unicode tab:
  unicodeText: string;
  unicodeDataArray: UnicodeData[]; // <- Reflect the input text
  unicodeSelectedCharacterIndex: number; // <- Use -1 for none selected.
  unicodeTriggerOnRepeat: boolean;
  // State for the macro tab:
  macroKeypresses: VirtualKeypress[];
  macroTriggerOnRepeat: boolean;
  // State for the dead key tab:
  deadKeyIndependentText: string;
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
        unicodeText: textFromCodepoints((command as UnicodeCommand).codepoints),
        unicodeDataArray: this.dataArrayFromCodepoints(
          (command as UnicodeCommand).codepoints
        ),
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
        deadKeyIndependentText: textFromCodepoints(
          (command as DeadKeyCommand).codepoints
        ),
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

  _updateUnicodeDataArrayTimer?: number; // Handler for a setTimeout.

  /**
   * Don't call this directly from the components; this is used during
   * initialization, and also called by updateUnicodeDataArray. Call that
   * method from the components instead.
   */
  dataArrayFromCodepoints(codepoints: number[]): UnicodeData[] {
    return codepoints.map((codepoint) => ({
      symbol: '*',
      codepoint: codepoint,
      category: 'Placeholder', // TODO!
    }));
  }

  /**
   * This will wait for a short interval, and then update the unicode data array
   * in the state to reflect the text.
   * @param text New text inserted in the textbox.
   */
  updateUnicodeDataArray(text: string): void {
    // Trying to clear an invalid id silently fails and does nothing.
    clearTimeout(this._updateUnicodeDataArrayTimer);
    // The new timeout defines the real bulk of the work, which is done after a
    // delay.
    this._updateUnicodeDataArrayTimer = setTimeout(() => {
      // Read the state to get the unicode text, then turn it into codepoints.
      // Each codepoint will get its entry in the data array.
      const codepoints = codepointsFromText(text);
      this.setState({
        unicodeDataArray: this.dataArrayFromCodepoints(codepoints),
      });
    }, 800);
  }

  handleUnicodeTextChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      unicodeText: e.target.value,
    });

    this.updateUnicodeDataArray(e.target.value);
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
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              height: 450,
            }}
          >
            <AppBar
              position='static'
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 0,
              }}
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
            <div style={{ flexGrow: 1 }}>
              <TabPanel value={this.state.currentTab} index={0}>
                <Grid container spacing={4} style={{ height: '100%' }}>
                  <Grid item xs={12}>
                    <TextField
                      style={{ width: '100%' }}
                      value={this.state.unicodeText}
                      multiline
                      variant='outlined'
                      title='Text'
                      rows='3'
                      placeholder='Insert one or more characters'
                      onChange={this.handleUnicodeTextChange.bind(this)}
                    />
                  </Grid>
                  {/* List of characters, displaying letters and codepoints. */}
                  <Grid item xs={5}>
                    <_UnicodeCharacterList
                      rows={this.state.unicodeDataArray}
                      selectedIndex={this.state.unicodeSelectedCharacterIndex}
                      onRowSelected={(index) => {
                        this.setState({
                          unicodeSelectedCharacterIndex: index,
                        });
                      }}
                    />
                  </Grid>
                  {/* Details on the selected character. */}
                  <Grid item xs={7}>
                    <_UnicodeCharacterDetails
                      data={
                        this.state.unicodeDataArray[
                          this.state.unicodeSelectedCharacterIndex
                        ]
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={this.state.unicodeTriggerOnRepeat}
                          onChange={(e) => {
                            this.setState({
                              unicodeTriggerOnRepeat: e.target.checked,
                            });
                          }}
                        />
                      }
                      label='Trigger repeatedly while pressed down'
                    />
                  </Grid>
                </Grid>
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
            </div>
            <Divider />
            <Button color='primary'>Assign</Button>
          </div>
        </ModalContainer>
      </Modal>
    );
  }
}

const _UnicodeCharacterList = ({
  rows,
  selectedIndex,
  onRowSelected,
}: {
  rows: UnicodeData[];
  selectedIndex: number;
  onRowSelected: (n: number) => void;
}) => {
  return (
    <Paper style={{ height: 190, overflowY: 'scroll' }}>
      <TableContainer>
        <Table size='small'>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                selected={index == selectedIndex}
                onClick={(_) => onRowSelected(index)}
              >
                <TableCell align='left'>{row.symbol}</TableCell>
                <TableCell align='right'>{`U+${row.codepoint.toString(
                  16
                )}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const _UnicodeCharacterDetails = ({ data }: { data?: UnicodeData }) => {
  if (!data) {
    data = {
      symbol: '',
      category: '-',
      codepoint: -1,
    };
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h1' style={{ height: 30 }}>
          {data.symbol}
        </Typography>
        <Typography>
          Codepoint:{' '}
          {data.codepoint > 0 ? `U+${data.codepoint.toString(16)}` : '-'}
        </Typography>
        <Typography>Category: {data.category}</Typography>
      </CardContent>
    </Card>
  );
};
