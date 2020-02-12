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
  padding: 5px 15px;
`;

export default ({ title, children }) => (
  <ModalContainer maxWidth="sm">
    <ModalPaper>
      <Typography variant="h2" color="primary">
        {title}
      </Typography>
      {children}
    </ModalPaper>
  </ModalContainer>
);
