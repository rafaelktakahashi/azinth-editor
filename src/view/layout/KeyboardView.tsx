import * as React from "react";
import Layer from "./Layer";
import { Paper, Typography, Grid, Button } from "@material-ui/core";
import ChangeLayoutModal from "../modal/ChangeLayoutModal";
import Keyboard from "../../model/Keyboard";
import { Language } from "@material-ui/icons";

interface Props {
  keyboard: Keyboard;
}

export default class KeyboardView extends React.Component<Props, {}> {
  changeLayoutModal: ChangeLayoutModal | null = null;

  render(): JSX.Element {
    return (
      <Paper
        style={{
          position: "relative",
          display: "inline-block",
          margin: 10,
          padding: 10,
          backgroundColor: "#e8e8e8",
        }}
      >
        <ChangeLayoutModal ref={(r) => (this.changeLayoutModal = r)} />
        <Grid container>
          <Grid xs={10}>
            <KeyboardTitle
              alias={this.props.keyboard.alias}
              name={this.props.keyboard.name}
            />
          </Grid>
          <Grid xs={2}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <ChangeLayoutButton
                onClick={() => {
                  this.changeLayoutModal
                    ?.openModal(
                      this.props.keyboard.physicalLayout,
                      this.props.keyboard.logicalLayout
                    )
                    .then((r) => {
                      console.log(JSON.stringify(r, null, 2));
                    })
                    .catch((e) => {
                      console.warn(`Error: ${e.message || e}`);
                    });
                }}
              />
            </div>
          </Grid>
        </Grid>
        <Layer
          physicalLayout={this.props.keyboard.physicalLayout}
          logicalLayout={this.props.keyboard.logicalLayout}
        />
      </Paper>
    );
  }
}

const KeyboardTitle = ({ alias, name }: { alias: string; name: string }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
    }}
  >
    <Typography variant="h1" style={{ color: "blue" }}>
      {alias}
    </Typography>
    <div style={{ width: 10 }} />
    <Typography variant="h2">{name}</Typography>
  </div>
);

const ChangeLayoutButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    onClick={onClick}
    style={{
      // Defining size normally doesn't seem to work for buttons
      minHeight: 30,
      maxHeight: 30,
      minWidth: 30,
      maxWidth: 30,
    }}
  >
    <Language fontSize="small" />
  </Button>
);
