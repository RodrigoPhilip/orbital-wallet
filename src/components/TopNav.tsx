import { styled } from 'styled-components';
import { LuOrbit, LuRefreshCw } from 'react-icons/lu';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Reusable';
import { truncate } from '../utils/format';
import { useSnackbar } from '../hooks/useSnackbar';
import { rxdAddress } from '../signals';
import { useRxd } from '../hooks/useRxd';
import { useRadiantTokens } from '../hooks/useRadiantTokens';

const Container = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(LuOrbit)`
  width: 1.5rem;
  height: 1.5rem;
  margin: 1rem 0 1rem 1rem;
  color: #64ffda;
  filter: drop-shadow(0 0 15px #00bfa5);
`;

const LogoText = styled.div`
  font-family:
    Days One,
    sans-serif;
  font-size: 1.1rem;
  color: white;
  margin-left: 0.3rem;
  margin-right: 0.5rem;
`;

const Address = styled(Text)`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.darkAccent};
  border-radius: 1rem;
  font-size: 0.75rem;
  margin-left: 0.25rem;
  padding: 0.5rem 1rem;
  margin: 0;
  cursor: pointer;
  width: auto;
`;

const Refresh = styled(LuRefreshCw)`
  width: 1.5rem;
  height: 1.5rem;
  color: white;
  margin-right: 1rem;
  cursor: pointer;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

export const TopNav = () => {
  const { theme } = useTheme();
  const { addSnackbar } = useSnackbar();
  const { updateRxdBalance } = useRxd();
  const { syncTokens } = useRadiantTokens();

  const refresh = () => {
    updateRxdBalance();
    syncTokens();
    addSnackbar('Refreshing RXD and token balances', 'info');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(rxdAddress.value).then(() => {
      addSnackbar('Copied!', 'success');
    });
  };

  return (
    <Container>
      <LogoWrapper>
        <Logo />
        <LogoText>Orbital</LogoText>
        <Address theme={theme} onClick={handleCopyToClipboard}>
          {truncate(rxdAddress.value, 5, 5)}
        </Address>
        <Spacer />
        <Refresh onClick={refresh} />
      </LogoWrapper>
    </Container>
  );
};
