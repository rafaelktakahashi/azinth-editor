import * as React from "react";
import Key from "./Key";
import { Container } from "@material-ui/core";
import ANSI from "../../resources/physicalLayouts/ANSI.azphl.json";
import US_ANSI from "../../resources/logicalLayouts/US.azlgl.json";

interface Props {
  /** ex.: 'ANSI', 'ISO' */
  physicalLayout: string;
  /** ex.: 'Fr', 'JIS-Kana', 'US' */
  logicalLayout: string;
}

interface State {
  currentPhysicalLayout: Object;
  /** Map from scancode to label, both strings */
  labelMap: { [key: string]: string };
}

export default class Layer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // TODO: Always reading the same layout as a placeholder
    const labelMap = {};
    for (var i = 0; i < US_ANSI.labels.length; i++) {
      labelMap[US_ANSI.labels[i].scancode] = US_ANSI.labels[i].label;
    }

    this.state = {
      currentPhysicalLayout: ANSI,
      labelMap
    };
  }

  render(): JSX.Element {
    return (
      <Container
        style={{
          backgroundColor: "white",
          height: 400,
          width: 700,
          position: "relative"
        }}
      >
        {ANSI.keys.map(item => (
          <Key
            width={item.width}
            height={item.height}
            xOffset={item.xOffset}
            yOffset={item.yOffset}
            bottomLabel={this.state.labelMap[item.scancode]}
          />
        ))}
      </Container>
    );
  }
}
