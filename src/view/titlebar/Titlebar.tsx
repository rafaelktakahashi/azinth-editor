import * as React from "react";
import styled from "styled-components";
import { remote } from "electron";

const Headerbar = styled.header`
  display: block;
  position: fixed;
  height: 32px;
  width: calc(100% - 2px); /*Compensate for body 1px border*/
  background: #254053;
`;

const DragRegion = styled.header`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: auto 138px;
  -webkit-app-region: drag;
`;

const Main = styled.div`
  height: calc(100% - 32px);
  margin-top: 32px;
  padding: 20px;
  overflow-y: auto;
  background-color: white;
`;

const Title = styled.span`
  grid-column: 1;
  display: flex;
  align-items: center;
  margin-left: 8px;
  overflow-x: hidden;
  font-family: "Segoe UI", sans-serif;
  font-size: 12px;
  .span {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
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
    background: rgba(255, 255, 255, 0.1);
  }
  &:active {
    background: rgba(255, 255, 255, 0.2);
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
export default (props: Props): JSX.Element => {
  const win = remote.getCurrentWindow();

  return (
    <>
      <Headerbar>
        <DragRegion>
          <Title>
            <span>{props.title}</span>
          </Title>
        </DragRegion>
        <HeaderButtonContainer>
          <HeaderButtonMin>
            <span>{"\uE921"}</span>
          </HeaderButtonMin>
          <HeaderButtonMaxRestore>
            <span>{win.isMaximized ? "\uE922" : "\uE923"}</span>
          </HeaderButtonMaxRestore>
          <HeaderButtonClose>
            <span>{"\uE8BB"}</span>
          </HeaderButtonClose>
        </HeaderButtonContainer>
      </Headerbar>

      <Main>{props.children}</Main>
    </>
  );
};
