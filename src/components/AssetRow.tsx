import { styled } from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import { ColorThemeProps } from '../theme';
import { HeaderText, Text } from './Reusable';
import { formatNumberWithCommasAndDecimals, formatUSD } from '../utils/format';
import { Show } from './Show';

const Container = styled.div<ColorThemeProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.darkAccent};
  padding: 1rem 0;
  width: 90%;
  border-radius: 0.5rem;
  margin: 0.25rem;
  cursor: pointer;
`;

const ImageWrapper = styled.div<{ size?: string }>`
  width: 2.25rem;
  height: 2.25rem;
  margin-left: 1rem;
  border-radius: 50%;
`;

const Icon = styled.img<{ size?: string }>`
  width: 2.25rem;
  height: 2.25rem;
  margin-left: 1rem;
  border-radius: 50%;
`;

const TickerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TickerTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 1rem;
`;

const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 1rem;
  width: 40%;
`;

export type AssetRowProps = {
  icon: React.ReactNode;
  ticker: string;
  balance: number;
  showUsd?: boolean;
  usdBalance?: number;
  isPhotons?: boolean;
  onClick?: () => void;
};

export const AssetRow = (props: AssetRowProps) => {
  const { icon, ticker, balance, showUsd, usdBalance, isPhotons, onClick } = props;
  const { theme } = useTheme();
  return (
    <Container onClick={onClick} theme={theme}>
      <TickerWrapper>
        <Show when={!!icon}>
          {typeof icon === 'string' ? <Icon src={icon} /> : <ImageWrapper>{icon}</ImageWrapper>}
        </Show>
        <TickerTextWrapper>
          <HeaderText style={{ fontSize: '1rem' }} theme={theme}>
            {ticker}
          </HeaderText>
        </TickerTextWrapper>
      </TickerWrapper>
      <BalanceWrapper>
        <HeaderText style={{ textAlign: 'right', fontSize: '1rem' }} theme={theme}>
          {formatNumberWithCommasAndDecimals(balance, isPhotons ? 0 : 3)}
        </HeaderText>
        {showUsd && (
          <Text style={{ textAlign: 'right', margin: '0' }} theme={theme}>
            {formatUSD(usdBalance || 0)}
          </Text>
        )}
      </BalanceWrapper>
    </Container>
  );
};
