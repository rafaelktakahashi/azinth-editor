import * as React from "react";
import Key, { UNIT_LENGTH } from "./Key";
import { Container, Paper } from "@material-ui/core";
import ANSI from "../../resources/physicalLayouts/ANSI.azphl.json";
import US_ANSI from "../../resources/logicalLayouts/US.azlgl.json";

interface Props {
  /** ex.: 'ANSI', 'ISO' */
  physicalLayout: string;
  /** ex.: 'Fr', 'JIS-Kana', 'US' */
  logicalLayout: string;
}

interface State {
  currentPhysicalLayout: any;
  /** Map from scancode to label, both strings */
  labelMap: { [key: string]: string };
  /** Size of this component, based on the keys rendered in it. */
  dimensions: { width: number; height: number };
}

export default class Layer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // TODO: Always reading the same layout as a placeholder
    const labelMap = {};
    for (var i = 0; i < US_ANSI.labels.length; i++) {
      labelMap[US_ANSI.labels[i].scancode] = US_ANSI.labels[i].label;
    }

    // Go through each key to figure out the necessary width and height
    var maxWidthUnits = 0;
    var maxHeightUnits = 0;
    for (var i = 0; i < ANSI.keys.length; i++) {
      const thisWidth = ANSI.keys[i].xOffset + ANSI.keys[i].width;
      const thisHeight = ANSI.keys[i].yOffset + ANSI.keys[i].height;
      if (thisWidth > maxWidthUnits) {
        maxWidthUnits = thisWidth;
      }
      if (thisHeight > maxHeightUnits) {
        maxHeightUnits = thisHeight;
      }
    }

    this.state = {
      currentPhysicalLayout: ANSI,
      labelMap,
      dimensions: {
        width: maxWidthUnits * UNIT_LENGTH,
        height: maxHeightUnits * UNIT_LENGTH
      }
    };
  }

  render(): JSX.Element {
    return (
      <Paper
        style={{
          position: "relative",
          padding: 10,
          overflow: "auto",
          backgroundColor: "#e8e8e8",
          maxWidth: this.state.dimensions.width,
        }}
      >
        <Container
          style={{
            height: this.state.dimensions.height,
            width: this.state.dimensions.width,
            position: "relative"
          }}
        >
          {this.state.currentPhysicalLayout.keys.map(item => (
            <Key
              width={item.width}
              height={item.height}
              xOffset={item.xOffset}
              yOffset={item.yOffset}
              bottomLabel={this.state.labelMap[item.scancode]}
            />
          ))}
        </Container>
      </Paper>
    );
  }
}
