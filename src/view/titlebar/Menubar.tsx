import * as React from 'react';
import { webFrame } from 'electron';
import styled from 'styled-components';
import Menu from '@material-ui/core/Menu';
import { MenuItem } from '@material-ui/core';

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
    font-family: 'Segoe UI';
    user-select: none;
  }
`;

export default class Menubar extends React.Component<
  {},
  { activeMenuRef: any; activeMenu: string }
> {
  state = {
    activeMenuRef: null as any,
    activeMenu: '',
  };

  closeMenu(): void {
    this.setState({
      activeMenuRef: null,
      activeMenu: '',
    });
  }

  isOpen(menuName: string): boolean {
    return (menuName || '').localeCompare(this.state.activeMenu) === 0;
  }

  listenerZoomIn() {
    webFrame.setZoomLevel(webFrame.getZoomLevel() + 1);
    this.closeMenu();
  }

  listenerZoomOut() {
    webFrame.setZoomLevel(webFrame.getZoomLevel() - 1);
    this.closeMenu();
  }

  render(): JSX.Element {
    return (
      <Container>
        <MenuButton
          onClick={(event) =>
            this.setState({
              activeMenuRef: event.currentTarget,
              activeMenu: 'file-menu',
            })
          }
        >
          <span>File</span>
        </MenuButton>
        <MenuButton
          onClick={(event) =>
            this.setState({
              activeMenuRef: event.currentTarget,
              activeMenu: 'edit-menu',
            })
          }
        >
          <span>Edit</span>
        </MenuButton>
        <MenuButton
          onClick={(event) =>
            this.setState({
              activeMenuRef: event.currentTarget,
              activeMenu: 'view-menu',
            })
          }
        >
          <span>View</span>
        </MenuButton>
        <MenuButton
          onClick={(event) =>
            this.setState({
              activeMenuRef: event.currentTarget,
              activeMenu: 'about-menu',
            })
          }
        >
          <span>About</span>
        </MenuButton>

        {/** Menu components with actions */}
        <Menu
          id='file-menu'
          anchorEl={this.state.activeMenuRef}
          keepMounted
          open={this.isOpen('file-menu')}
          onClose={this.closeMenu.bind(this)}
        >
          <MenuItem>New Layout</MenuItem>
        </Menu>

        <Menu
          id='edit-menu'
          anchorEl={this.state.activeMenuRef}
          keepMounted
          open={this.isOpen('edit-menu')}
          onClose={this.closeMenu.bind(this)}
        >
          <MenuItem>Add Keyboard</MenuItem>
        </Menu>

        <Menu
          id='view-menu'
          anchorEl={this.state.activeMenuRef}
          keepMounted
          open={this.isOpen('view-menu')}
          onClose={this.closeMenu.bind(this)}
        >
          <MenuItem onClick={this.listenerZoomIn.bind(this)}>Zoom In</MenuItem>
          <MenuItem onClick={this.listenerZoomOut.bind(this)}>
            Zoom Out
          </MenuItem>
        </Menu>

        <Menu
          id='about-menu'
          anchorEl={this.state.activeMenuRef}
          keepMounted
          open={this.isOpen('about-menu')}
          onClose={this.closeMenu.bind(this)}
        >
          <MenuItem>About Azinth Editor</MenuItem>
        </Menu>
      </Container>
    );
  }
}
