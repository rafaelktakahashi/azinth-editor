import * as React from 'react';
import KeyboardView from './KeyboardView';
import Layout from '../../model/Layout';
import { Container } from '@material-ui/core';

interface Props {
  layout: Layout;
  onKeyboardChanged: (
    newLayout: Layout,
    index: number,
    type: 'layout' | 'modifier' | 'command'
  ) => void;
}

/**
 * Component that renders as a list of Keyboards. This is a controlled component.
 */
export default class LayoutView extends React.Component<Props, {}> {
  render(): JSX.Element {
    return (
      <Container
        style={{
          backgroundColor: 'transparent',
          scrollBehavior: 'smooth',
        }}
      >
        {this.props.layout.keyboards.map((k, i) => (
          <KeyboardView
            key={`keyboardview-${i}`}
            keyboard={k}
            onKeyboardChanged={(k, type) => {
              const newLayout: Layout = {
                ...this.props.layout,
              };
              newLayout.keyboards = this.props.layout.keyboards.slice(0);
              newLayout.keyboards[i] = k;
              this.props.onKeyboardChanged(newLayout, i, type);
            }}
          />
        ))}
      </Container>
    );
  }
}
