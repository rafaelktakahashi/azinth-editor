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

const ModalContainer = styled(Container)<{
  clear?: boolean;
}>`
  background-color: white;
  outline: 0;
  margin: 16px auto;
  padding: ${(props) => (props.clear ? '16px' : '0px')};
  max-width: 800px;
  max-height: 550px; // The parent of this seems to have infinite height (?)
`;

/**
 * This should be used to encapsulate all content inside of a modal. This tries
 * its best to behave like a modal window.
 */
export default ({
  title,
  onClose,
  maxWidth,
  clear,
  children,
}: {
  title?: string;
  onClose?: () => void;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  clear?: boolean;
  children: JSX.Element | JSX.Element[];
}) => (
  <ModalContainer maxWidth={maxWidth || 'sm'}>
    {!clear && (
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
          {title || ''}
        </Typography>
        <IconButton
          onClick={() => {
            onClose?.();
          }}
        >
          <Close />
        </IconButton>
      </Box>
    )}
    {children}
  </ModalContainer>
);
