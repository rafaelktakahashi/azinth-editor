import * as React from "react";
import styled from "styled-components";
import Menu from "@material-ui/core/Menu";
import { MenuItem } from "@material-ui/core";

const Container = styled.div`
  display: flex;
  height: 100%;
  font-size: 12px;
  flex-direction: row;
  -webkit-app-region: no-drag;
`;

const MenuButton = styled.div`
  height: 100%;
  padding: 0 7px; /** Horizontal padding only */
  align-items: center;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  & span {
    line-height: 2.5;
    font-size: 13px;
    font-family: "Segoe UI";
    user-select: none;
  }
`;

export default class Menubar extends React.Component<{}> {
  state = {
    editMenuRef: null
  };
  editRef: any;

  render(): JSX.Element {
    return (
      <Container>
        <MenuButton
          ref={r => {
            this.editRef = r;
          }}
          onClick={() =>
            this.setState({
              editMenuRef: this.editRef.current
            })
          }
        >
          <span>Edit</span>
        </MenuButton>
        <MenuButton>
          <span>Menu2</span>
        </MenuButton>
        <MenuButton>
          <span>Menu3</span>
        </MenuButton>
        <Menu
          anchorEl={this.state.editMenuRef}
          keepMounted
          open={Boolean(this.state.editMenuRef)}
          onClose={() => {
            this.setState({ editMenuRef: null });
          }}
        >
          <MenuItem>New Layout</MenuItem>
        </Menu>
      </Container>
    );
  }
}
