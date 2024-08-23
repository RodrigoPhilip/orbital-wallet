import { styled } from 'styled-components';
import { ColorThemeProps, Theme } from '../theme';
import { MenuItems } from '../contexts/BottomMenuContext';
import { Badge, Text } from './Reusable';
import { NetWork } from '../utils/network';
import { Show } from './Show';
import {
  TbStar as ResourcesIcon,
  TbHome as HomeIcon,
  TbSettings as SettingsIcon,
  TbCircles as TokensIcon,
} from 'react-icons/tb';
import { network } from '../signals';
import { useSignals } from '@preact/signals-react/runtime';

const Container = styled.div<ColorThemeProps>`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 3.75rem;
  position: absolute;
  bottom: 0;
  background: ${({ theme }) => theme.mainBackground};
  color: ${({ theme }) => theme.white + '80'};
  z-index: 100;
`;

const MenuContainer = styled.div<ColorThemeProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 3.75rem;
  bottom: 0;
  z-index: 100;
  position: relative;
`;

const Icon = styled.div<{ $opacity: number }>`
  width: 1.5rem;
  height: 1.5rem;
  opacity: ${(props) => props.$opacity};
  cursor: pointer;
  margin-bottom: 0.25rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const StyledText = styled(Text)<{ $opacity: number }>`
  color: ${({ theme }) => theme.white};
  opacity: ${(props) => props.$opacity};
`;

export type BottomMenuProps = {
  selected: MenuItems | null;
  handleSelect: (item: MenuItems) => void;
  theme: Theme;
};

export type MenuProps = {
  badge?: string;
  icon: React.ComponentType;
  label: string;
  onClick: (e: React.MouseEvent<HTMLImageElement>) => void;
  opacity: number;
  theme: Theme;
};

const Menu = (props: MenuProps) => {
  const { theme, label, onClick, opacity, icon, badge } = props;
  return (
    <MenuContainer>
      <ContentWrapper>
        <Icon as={icon} onClick={onClick} $opacity={opacity} color="white" />
        <StyledText onClick={onClick} style={{ margin: 0, fontSize: '0.65rem' }} theme={theme} $opacity={opacity}>
          {label}
        </StyledText>
        <Show when={!!badge}>
          <Badge style={{ position: 'absolute', marginTop: '-4rem' }}>{badge}</Badge>
        </Show>
      </ContentWrapper>
    </MenuContainer>
  );
};

export const BottomMenu = (props: BottomMenuProps) => {
  useSignals();
  const { selected, handleSelect, theme } = props;

  return (
    <Container theme={theme}>
      <Menu
        label="Home"
        theme={theme}
        icon={HomeIcon}
        onClick={() => handleSelect('rxd')}
        opacity={selected === 'rxd' ? 1 : 0.6}
      />
      <Menu
        label="Tokens"
        theme={theme}
        icon={TokensIcon}
        onClick={() => handleSelect('tokens')}
        opacity={selected === 'tokens' ? 1 : 0.6}
      />
      <Menu
        label="Apps"
        theme={theme}
        icon={ResourcesIcon}
        onClick={() => handleSelect('apps')}
        opacity={selected === 'apps' ? 1 : 0.6}
      />
      <Menu
        label="Settings"
        theme={theme}
        icon={SettingsIcon}
        onClick={() => handleSelect('settings')}
        opacity={selected === 'settings' ? 1 : 0.4}
        badge={network.value === NetWork.Testnet ? 'testnet' : undefined}
      />
    </Container>
  );
};
