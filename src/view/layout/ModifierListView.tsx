import * as React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import KeyboardModifier from "../../model/KeyboardModifier";
import { Typography, withTheme } from "@material-ui/core";
import { ThemedComponentProps } from "@material-ui/core/styles/withTheme";

interface Props {
  keyboardModifiers: KeyboardModifier[];
  // This should use the same references as keyboardModifiers
  selectedKeyboardModifiers: KeyboardModifier[];
  // Callback for when the selection changes.
  onSelectionChanged: (
    newSelection: KeyboardModifier[],
    toggledItem: KeyboardModifier
  ) => void;
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
      <ToggleButtonGroup value={this.props.selectedKeyboardModifiers}>
        {this.props.keyboardModifiers.map((m) => {
          const isSelected = this.props.selectedKeyboardModifiers.includes(m);
          return (
            <ToggleButton
              onClick={() => {
                const newSelection: KeyboardModifier[] = isSelected
                  ? this.props.selectedKeyboardModifiers.filter(
                      (it) => it.name.localeCompare(m.name) !== 0
                    )
                  : this.props.selectedKeyboardModifiers.concat(m);
                this.props.onSelectionChanged(newSelection, m);
              }}
              color="primary"
              style={{
                height: 25,
                backgroundColor: isSelected
                  ? theme.palette.primary.dark
                  : undefined,
                color: isSelected ? "white" : undefined,
              }}
              value={m}
            >
              <Typography>{m.name}</Typography>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    );
  }
}

export default withTheme(ModifierListView);
