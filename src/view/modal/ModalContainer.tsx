import * as React from "react";
import styled from "styled-components";
import { Container, Paper, Typography } from "@material-ui/core";

const ModalContainer = styled(Container)`
  background-color: transparent;
  outline: 0;
  margin: 32px auto;
  max-width: 700;
`;

const ModalPaper = styled(Paper)`
  background-color: white;
  padding: 15px 25px;
`;

export default ({
  title,
  maxWidth,
  children
}: {
  title: string;
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
  children: JSX.Element | JSX.Element[];
}) => (
  <ModalContainer maxWidth={maxWidth || "sm"}>
    <ModalPaper>
      <Typography variant="h2" color="primary" style={{ marginBottom: 15 }}>
        {title}
      </Typography>
      {children}
    </ModalPaper>
  </ModalContainer>
);
