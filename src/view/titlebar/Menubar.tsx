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
    activeMenuRef: null,
    activeMenu: ""
  };
  fileRef: any;
  editRef: any;

  render(): JSX.Element {
    return (
      <Container>
        <MenuButton
          ref={r => {
            this.fileRef = r;
          }}
          onClick={() =>
            this.setState({
              activeMenuRef: this.fileRef.current,
              activeMenu: "file-menu"
            })
          }
        >
          <span>File</span>
        </MenuButton>
        <MenuButton
          ref={r => {
            this.editRef;
          }}
          onClick={() =>
            this.setState({
              activeMenuRef: this.editRef.current,
              activeMenu: "edit-menu"
            })
          }
        >
          <span>Edit</span>
        </MenuButton>
        <MenuButton>
          <span>View</span>
        </MenuButton>
        <MenuButton>
          <span>About</span>
        </MenuButton>
        <Menu
          id="file-menu"
          anchorEl={this.state.activeMenuRef}
          keepMounted
          open={"file-menu".localeCompare(this.state.activeMenu) === 0}
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
