import * as React from 'react';
import styled from 'styled-components';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

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
  onClose,
  maxWidth,
  children,
}: {
  title: string;
  onClose?: () => void;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: JSX.Element | JSX.Element[];
}) => (
  <ModalContainer maxWidth={maxWidth || 'sm'}>
    <ModalPaper>
      <Box
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'middle',
        }}
      >
        <Typography variant='h2' color='primary' style={{ marginBottom: 15 }}>
          {title}
        </Typography>
        <IconButton
          onClick={() => {
            onClose?.();
          }}
        >
          <Close />
        </IconButton>
      </Box>
      {children}
    </ModalPaper>
  </ModalContainer>
);
