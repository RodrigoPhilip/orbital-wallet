import { validate } from 'bitcoin-address-validation';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import rxdCoin from '../assets/rxd-coin.png';
import switchAsset from '../assets/switch-asset.svg';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PageLoader } from '../components/PageLoader';
import { QrCode } from '../components/QrCode';
import {
  ButtonContainer,
  ConfirmContent,
  FormContainer,
  HeaderText,
  MainContent,
  ReceiveContent,
  Text,
} from '../components/Reusable';
import { Show } from '../components/Show';
import { TopNav } from '../components/TopNav';
import { useRxd } from '../hooks/useRxd';
import { useSnackbar } from '../hooks/useSnackbar';
import { useSocialProfile } from '../hooks/useSocialProfile';
import { useTheme } from '../hooks/useTheme';
import { useWeb3Context } from '../hooks/useWeb3Context';
import { ColorThemeProps } from '../theme';
import { RXD_DECIMAL_CONVERSION } from '../utils/constants';
import { formatNumberWithCommasAndDecimals, formatUSD } from '../utils/format';
import { sleep } from '../utils/sleep';
import { TbCopy as CopyIcon } from 'react-icons/tb';
import { rxdAddress } from '../signals';

const MiddleContainer = styled.div<ColorThemeProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const ProfileImage = styled.img`
  width: 4rem;
  height: 4rem;
  margin: 0.25rem;
  border-radius: 100%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.img<{ size?: string }>`
  width: ${(props) => props.size ?? '1.5rem'};
  height: ${(props) => props.size ?? '1.5rem'};
  margin: 0 0.5rem 0 0;
`;

const InputAmountWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CopyAddressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 2rem 0;
`;

const StyledCopy = styled(CopyIcon)`
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
  color: white;
`;

type PageState = 'main' | 'receive' | 'send';
type AmountType = 'rxd' | 'usd';

export const RxdWallet = () => {
  const { theme } = useTheme();
  const [pageState, setPageState] = useState<PageState>('main');
  const [satSendAmount, setSatSendAmount] = useState<number | null>(null);
  const [usdSendAmount, setUsdSendAmount] = useState<number | null>(null);
  const [receiveAddress, setReceiveAddress] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [amountType, setAmountType] = useState<AmountType>('rxd');
  const [successTxId, setSuccessTxId] = useState('');
  const { addSnackbar, message } = useSnackbar();
  const { socialProfile } = useSocialProfile();
  const { isPasswordRequired } = useWeb3Context();
  const { rxdBalance, isProcessing, setIsProcessing, sendRxd, updateRxdBalance, exchangeRate } = useRxd();

  useEffect(() => {
    updateRxdBalance(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!successTxId) return;
    if (!message && rxdAddress.value) {
      resetSendState();
      setPageState('main');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successTxId, message, rxdAddress.value]);

  const resetSendState = () => {
    setSatSendAmount(null);
    setUsdSendAmount(null);
    setAmountType('rxd');
    setReceiveAddress('');
    setPasswordConfirm('');
    setSuccessTxId('');
    setIsProcessing(false);

    setTimeout(() => {
      updateRxdBalance(true);
    }, 500);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(rxdAddress.value).then(() => {
      addSnackbar('Copied!', 'success');
    });
  };

  const toggleAmountType = () => {
    if (amountType === 'rxd') {
      setAmountType('usd');
    } else {
      setAmountType('rxd');
    }
    setUsdSendAmount(null);
    setSatSendAmount(null);
  };

  const handleSendRxd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    await sleep(25);
    if (!validate(receiveAddress)) {
      addSnackbar('You must enter a valid RXD address. Paymail not yet supported.', 'info');
      setIsProcessing(false);
      return;
    }

    if (!satSendAmount && !usdSendAmount) {
      addSnackbar('You must enter an amount.', 'info');
      setIsProcessing(false);
      return;
    }

    if (!passwordConfirm && isPasswordRequired) {
      addSnackbar('You must enter a password!', 'error');
      setIsProcessing(false);
      return;
    }

    let satoshis = satSendAmount ?? 0;
    if (amountType === 'usd' && usdSendAmount) {
      satoshis = Math.ceil((usdSendAmount / exchangeRate) * RXD_DECIMAL_CONVERSION);
    }

    const sendRes = await sendRxd([{ address: receiveAddress, satoshis }], passwordConfirm);
    if (!sendRes.txid || sendRes.error) {
      const message =
        sendRes.error === 'invalid-password'
          ? 'Invalid Password!'
          : sendRes.error === 'insufficient-funds'
            ? 'Insufficient Funds!'
            : sendRes.error === 'fee-too-high'
              ? 'Miner fee too high!'
              : 'An unknown error has occurred! Try again.';

      addSnackbar(message, 'error');
      setPasswordConfirm('');
      return;
    }

    setSuccessTxId(sendRes.txid);
    addSnackbar('Transaction Successful!', 'success');
  };

  const fillInputWithAllRxd = () => {
    setSatSendAmount(Math.round(rxdBalance * RXD_DECIMAL_CONVERSION));
  };

  useEffect(() => {
    const calcValue = () => {
      return amountType === 'rxd'
        ? satSendAmount
          ? satSendAmount / RXD_DECIMAL_CONVERSION
          : undefined
        : amountType === 'usd'
          ? usdSendAmount
            ? usdSendAmount
            : undefined
          : undefined;
    };

    calcValue();
  }, [satSendAmount, usdSendAmount, amountType]);

  const getLabel = () => {
    return amountType === 'rxd' && satSendAmount
      ? `Send ${(satSendAmount / RXD_DECIMAL_CONVERSION).toFixed(8)}`
      : amountType === 'usd' && usdSendAmount
        ? `Send ${formatUSD(usdSendAmount)}`
        : 'Enter Send Details';
  };

  const nukeUtxos = () => {
    updateRxdBalance(true);
  };

  const receive = (
    <ReceiveContent>
      <HeaderText style={{ marginTop: '1rem', marginBottom: '1.25rem' }} theme={theme}>
        Receive RXD
      </HeaderText>
      <QrCode address={rxdAddress.value} onClick={handleCopyToClipboard} />
      <CopyAddressWrapper onClick={handleCopyToClipboard}>
        <StyledCopy />
        <Text theme={theme} style={{ margin: '0', color: theme.white, fontSize: '0.75rem' }}>
          {rxdAddress.value}
        </Text>
      </CopyAddressWrapper>
      <Button
        label="Go back"
        theme={theme}
        type="secondary"
        onClick={() => {
          setPageState('main');
          updateRxdBalance(true);
        }}
      />
    </ReceiveContent>
  );

  const main = (
    <MainContent>
      <MiddleContainer theme={theme}>
        <Show when={socialProfile.avatar !== ''}>
          <ProfileImage title="Refresh balance" src={socialProfile.avatar} onClick={nukeUtxos} />
        </Show>
        <HeaderText style={{ fontSize: '2rem', cursor: 'pointer' }} theme={theme} onClick={nukeUtxos}>
          {formatUSD(rxdBalance * exchangeRate)}
        </HeaderText>
        <BalanceContainer>
          <Icon src={rxdCoin} size="1rem" />
          <Text theme={theme} style={{ margin: '0', fontSize: '1rem' }}>
            {formatNumberWithCommasAndDecimals(rxdBalance, 8, 0)} RXD
          </Text>
        </BalanceContainer>
        <ButtonContainer>
          <Button theme={theme} type="primary" label="Receive" onClick={() => setPageState('receive')} />
          <Button theme={theme} type="primary" label="Send" onClick={() => setPageState('send')} />
        </ButtonContainer>
      </MiddleContainer>
    </MainContent>
  );

  const send = (
    <>
      <ConfirmContent>
        <HeaderText theme={theme}>Send RXD</HeaderText>
        <Text
          theme={theme}
          style={{ cursor: 'pointer' }}
          onClick={fillInputWithAllRxd}
        >{`Balance: ${rxdBalance}`}</Text>
        <FormContainer noValidate onSubmit={(e) => handleSendRxd(e)}>
          <Input
            theme={theme}
            placeholder="Enter Address"
            type="text"
            onChange={(e) => setReceiveAddress(e.target.value)}
            value={receiveAddress}
          />
          <InputAmountWrapper>
            <Input
              theme={theme}
              placeholder={amountType === 'rxd' ? 'Enter RXD Amount' : 'Enter USD Amount'}
              type="number"
              step="0.00000001"
              value={
                satSendAmount !== null && satSendAmount !== undefined
                  ? satSendAmount / RXD_DECIMAL_CONVERSION
                  : usdSendAmount !== null && usdSendAmount !== undefined
                    ? usdSendAmount
                    : ''
              }
              onChange={(e) => {
                const inputValue = e.target.value;

                // Check if the input is empty and if so, set the state to null
                if (inputValue === '') {
                  setSatSendAmount(null);
                  setUsdSendAmount(null);
                } else {
                  // Existing logic for setting state
                  if (amountType === 'rxd') {
                    setSatSendAmount(Math.round(Number(inputValue) * RXD_DECIMAL_CONVERSION));
                  } else {
                    setUsdSendAmount(Number(inputValue));
                  }
                }
              }}
            />
            <Icon
              src={switchAsset}
              size="1rem"
              style={{
                position: 'absolute',
                right: '2.25rem',
                cursor: 'pointer',
              }}
              onClick={toggleAmountType}
            />
          </InputAmountWrapper>
          <Show when={isPasswordRequired}>
            <Input
              theme={theme}
              placeholder="Enter Wallet Password"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </Show>
          <Button
            theme={theme}
            type="primary"
            label={getLabel()}
            disabled={isProcessing || (!usdSendAmount && !satSendAmount)}
            isSubmit
          />
        </FormContainer>
        <Button
          label="Go back"
          theme={theme}
          type="secondary"
          onClick={() => {
            setPageState('main');
            resetSendState();
          }}
        />
      </ConfirmContent>
    </>
  );

  return (
    <>
      <TopNav />
      <Show when={isProcessing && pageState === 'main'}>
        <PageLoader theme={theme} message="Loading wallet..." />
      </Show>
      <Show when={isProcessing && pageState === 'send'}>
        <PageLoader theme={theme} message="Sending RXD..." />
      </Show>
      <Show when={!isProcessing && pageState === 'main'}>{main}</Show>
      <Show when={!isProcessing && pageState === 'receive'}>{receive}</Show>
      <Show when={!isProcessing && pageState === 'send'}>{send}</Show>
    </>
  );
};
