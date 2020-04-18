import * as React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import KeyboardModifier from "../../model/KeyboardModifier";
import { Typography } from "@material-ui/core";

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
export default class ModifierListView extends React.Component<Props, {}> {
  render(): JSX.Element {
    return (
      <ToggleButtonGroup value={this.props.selectedKeyboardModifiers}>
        {this.props.keyboardModifiers.map((m) => (
          <ToggleButton
            onClick={() => {
              const wasSelected = this.props.selectedKeyboardModifiers.includes(
                m
              );
              const newSelection: KeyboardModifier[] = wasSelected
                ? this.props.selectedKeyboardModifiers.filter(
                    (it) => it.name.localeCompare(m.name) !== 0
                  )
                : this.props.selectedKeyboardModifiers.concat(m);
              this.props.onSelectionChanged(newSelection, m);
            }}
            color="primary"
            style={{ height: 25 }}
            value={m}
          >
            <Typography>{m.name}</Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  }
}
