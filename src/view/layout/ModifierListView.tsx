import * as React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import KeyboardModifier from '../../model/KeyboardModifier';
import { Typography, IconButton, withTheme } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { ThemedComponentProps } from '@material-ui/core/styles/withTheme';

interface Props {
  keyboardModifiers: KeyboardModifier[];
  // This should use the same references as keyboardModifiers
  selectedKeyboardModifiers: KeyboardModifier[];
  // Callback for when the selection changes.
  onSelectionChanged: (
    newSelection: KeyboardModifier[],
    toggledItem: KeyboardModifier
  ) => void;
  onEditClicked: () => void;
}

/**
 * Control for an interactive list of modifiers. This is a controlled component.
 */
class ModifierListView extends React.Component<
  Props & ThemedComponentProps,
  {}
> {
  render(): JSX.Element {
    const theme = this.props.theme;
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <ToggleButtonGroup value={this.props.selectedKeyboardModifiers}>
          {this.props.keyboardModifiers.map((m, index) => {
            const isSelected = this.props.selectedKeyboardModifiers.includes(m);
            return (
              <ToggleButton
                key={`modifier-toggle-${index}`}
                onClick={() => {
                  const newSelection: KeyboardModifier[] = isSelected
                    ? this.props.selectedKeyboardModifiers.filter(
                        (it) => it.name.localeCompare(m.name) !== 0
                      )
                    : this.props.selectedKeyboardModifiers.concat(m);
                  this.props.onSelectionChanged(newSelection, m);
                }}
                color='primary'
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 0,
                  paddingBottom: 0,
                  backgroundColor: isSelected
                    ? theme?.palette?.primary?.dark
                    : undefined,
                  color: isSelected ? 'white' : undefined,
                }}
                value={m}
              >
                <Typography>{m.name}</Typography>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
        <div style={{ width: 10 }} />
        <IconButton
          color='primary'
          onClick={() => {
            this.props.onEditClicked();
          }}
          style={{ height: 25, padding: 0 }}
        >
          <Edit />
        </IconButton>
      </div>
    );
  }
}

export default withTheme(ModifierListView);
