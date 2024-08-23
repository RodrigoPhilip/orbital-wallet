import styled, { keyframes } from 'styled-components';
import { Text } from './Reusable';
import { SnackbarType } from '../contexts/SnackbarContext';
import { ColorThemeProps, Theme } from '../theme';
import {
  TbInfoCircle as InfoIcon,
  TbCircleCheck as SuccessIcon,
  TbExclamationCircle as ErrorIcon,
} from 'react-icons/tb';

type SnackBarColorTheme = ColorThemeProps & { color: string };

const slideIn = keyframes`
  from {
    bottom: -15px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
  }
`;

// Animation for fading out
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const SnackBarContainer = styled.div<SnackBarColorTheme>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  position: absolute;
  bottom: 0;
  margin: 1rem;
  border-radius: 0.5rem;
  background-color: ${({ color }) => color};
  color: ${({ theme }) => theme.white};
  z-index: 200;
  animation:
    ${slideIn} 0.25s ease-out,
    ${fadeOut} 0.25s ease-out 2.5s;
  animation-fill-mode: forwards;
`;

const Image = styled.div`
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  margin: 1rem;
`;

export type SnackbarProps = {
  /** The message that should be displayed on the snackbar */
  message: string;
  /** The type of snackbar. success | error | info */
  type: SnackbarType | null;
  theme: Theme;
};

export const Snackbar = (props: SnackbarProps) => {
  const { message, type, theme } = props;
  return (
    <SnackBarContainer color={type === 'error' ? theme.errorRed : theme.darkAccent}>
      <Image as={type === 'error' ? ErrorIcon : type === 'info' ? InfoIcon : SuccessIcon} />
      <Text
        theme={theme}
        style={{
          margin: '1rem 0 1rem .25rem',
          color: theme.white,
          wordWrap: 'break-word',
          textAlign: 'left',
        }}
      >
        {message}
      </Text>
    </SnackBarContainer>
  );
};
