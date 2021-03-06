import * as React from 'react';
import { Typography } from '@material-ui/core';
import KeystrokeCommand from '../../model/KeystrokeCommand';
import UnicodeCommand from '../../model/KeystrokeCommands/UnicodeCommand';

// This length is not configurable, unfortunately.
export const UNIT_LENGTH = 35;

interface Props {
  shape: 'rectangular' | 'iso_return' | 'big_return';
  /** Width of this key, in units. Has no effect on non-rectangular keys. */
  width: number;
  /** Height of this key, in units. Has no effect on non-rectangular keys. */
  height: number;
  /** Horizontal offset in relation to this component's parent. */
  xOffset: number;
  /** Vertical offset in relation to this component's parent. */
  yOffset: number;
  keyCommand?: KeystrokeCommand;
  bottomLabel: string;
  onClick: () => void;
}

/**
 * Representation of a keyboard key, with a shape and position in the keyboard
 * defined in units, where the unit is the side length of a square key.
 */
export default class KeyView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  static defaultProps: Partial<Props> = {
    shape: 'rectangular',
    width: 1,
    height: 1,
    bottomLabel: '',
  };

  textFromCommand(command?: KeystrokeCommand): string {
    if (!command) {
      return '';
    }
    if (command.type === 'unicode') {
      const unicodeCommand = command as UnicodeCommand;
      return String.fromCodePoint(...unicodeCommand.codepoints);
    }
    return '';
  }

  renderRectangularKey(): JSX.Element {
    return (
      <div
        id='keycap-border'
        style={{
          position: 'absolute',
          left: UNIT_LENGTH * this.props.xOffset,
          top: UNIT_LENGTH * this.props.yOffset,
          flex: 1,
          width: UNIT_LENGTH * this.props.width,
          height: UNIT_LENGTH * this.props.height,
          backgroundColor: '#444444',
        }}
      >
        <div
          id='keycap-side'
          style={{
            position: 'relative',
            flex: 1,
            marginTop: 1,
            marginLeft: 1,
            width: UNIT_LENGTH * this.props.width - 2,
            height: UNIT_LENGTH * this.props.height - 2,
            backgroundColor: '#d8d8d8',
            borderRadius: 3,
          }}
        >
          <div
            id='keycap-top'
            style={{
              position: 'absolute',
              flex: 1,
              top: 2,
              bottom: 3,
              left: 3,
              right: 3,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyItems: 'center',
              justifyContent: 'center',
            }}
            onClick={this.props.onClick}
          >
            <Typography
              style={{
                flex: 1,
                fontSize: 14,
                margin: 'auto',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                lineBreak: 'strict',
                textOverflow: 'clip',
                fontFamily: 'Arial',
                fontWeight: 'bold',
              }}
            >
              {this.textFromCommand(this.props.keyCommand)}
            </Typography>
            <Typography
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                margin: 0,
                textAlign: 'center',
                fontSize: 8,
                whiteSpace: 'nowrap',
                lineBreak: 'strict',
                textOverflow: 'clip',
                fontFamily: 'Arial',
                color: '#787878',
                fontWeight: 'bold',
                marginBottom: -1, // move the label slightly downwards
              }}
            >
              {this.props.bottomLabel}
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  renderIsoReturnKey(): JSX.Element {
    // TODO: Implement ISO Return key shape
    return <div />;
  }

  renderBigReturnKey(): JSX.Element {
    // TODO: Implement big return key shape
    return <div />;
  }

  render(): JSX.Element {
    switch (this.props.shape) {
      case 'iso_return':
        return this.renderIsoReturnKey();
      case 'big_return':
        return this.renderBigReturnKey();
      case 'rectangular':
      default:
        return this.renderRectangularKey();
    }
  }
}
