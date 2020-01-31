import * as React from "react";
import styled from "styled-components";
import { remote } from "electron";
import Menubar from "./Menubar";

const Headerbar = styled.header`
  display: block;
  position: fixed;
  height: 32px;
  width: calc(100% - 2px); /*Compensate for body 1px border*/
  background: #e8e8e8;
`;

const DragRegion = styled.header`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: auto 138px;
  display: flex;
  flex-direction: row;
  -webkit-app-region: drag;
`;

const Main = styled.div`
  height: 100%;
  margin-top: 32px;
  padding: 20px;
  overflow-y: auto;
  background-color: #e8e8e8;
`;

const Title = styled.span`
  grid-column: 1;
  display: flex;
  margin: 0 auto;
  align-items: center;
  margin-left: 8px;
  overflow-x: hidden;
  font-family: "Segoe UI", sans-serif;
  font-size: 12px;
  font-weight: 600;
  & span {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    user-select: none;
  }
`;

const HeaderButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 46px);
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  font-family: "Segoe MDL2 Assets";
  font-size: 10px;
  -webkit-app-region: no-drag;
`;
const HeaderButton = styled.div`
  grid-row: 1 / span 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  user-select: none;
  cursor: default;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  &:active {
    background: rgba(0, 0, 0, 0.2);
  }
`;
const HeaderButtonMin = styled(HeaderButton)`
  grid-column: 1;
`;
const HeaderButtonMaxRestore = styled(HeaderButton)`
  grid-column: 2;
`;
const HeaderButtonClose = styled(HeaderButton)`
  grid-column: 3;
  &:hover {
    background: #e81123 !important;
    span {
      color: #fff;
    }
  }
  &:active {
    background: #f1707a !important;
    span {
      color: #fff;
    }
  }
`;

interface Props {
  title: string;
  children: JSX.Element[];
}

class Titlebar extends React.Component<Props> {
  componentDidMount() {
    remote.getCurrentWindow().addListener("maximize", () => this.forceUpdate());
    remote
      .getCurrentWindow()
      .addListener("unmaximize", () => this.forceUpdate());
  }
  render() {
    const isMaximized = remote.getCurrentWindow().isMaximized();
    return (
      <>
        <Headerbar>
          <DragRegion>
            <Menubar />
            <Title>
              <span>{this.props.title}</span>
            </Title>
          </DragRegion>
          <HeaderButtonContainer>
            <HeaderButtonMin
              onClick={() => remote.getCurrentWindow().minimize()}
            >
              <span>{"\uE921"}</span>
            </HeaderButtonMin>

            {!isMaximized && (
              <HeaderButtonMaxRestore
                onClick={() => remote.getCurrentWindow().maximize()}
              >
                <span>{"\uE922"}</span>
              </HeaderButtonMaxRestore>
            )}

            {isMaximized && (
              <HeaderButtonMaxRestore
                onClick={() => remote.getCurrentWindow().unmaximize()}
              >
                <span>{"\uE923"}</span>
              </HeaderButtonMaxRestore>
            )}

            <HeaderButtonClose
              onClick={() => remote.getCurrentWindow().close()}
            >
              <span>{"\uE8BB"}</span>
            </HeaderButtonClose>
          </HeaderButtonContainer>
        </Headerbar>

        <Main>{this.props.children}</Main>
      </>
    );
  }
}

export default Titlebar;
