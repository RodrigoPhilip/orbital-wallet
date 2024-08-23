import React, { createContext, useEffect } from 'react';
import { useNoApprovalLimitSetting } from '../hooks/useApprovalLimitSetting';
import { useRxd } from '../hooks/useRxd';
import { usePasswordSetting } from '../hooks/usePasswordSetting';
import { RXD_DECIMAL_CONVERSION } from '../utils/constants';
import { NetWork } from '../utils/network';
import { storage } from '../utils/storage';
import { db } from '../db';
import { identityAddress, identityPubKey, locked, network, rxdAddress, rxdPubKey } from '../signals';
import { useSignals } from '@preact/signals-react/runtime';
import { lock } from '../utils/keyring';

export interface Web3ContextProps {
  isPasswordRequired: boolean;
  noApprovalLimit: number | undefined;
  exchangeRate: number;
  updateNetwork: (n: NetWork) => void;
  updateNoApprovalLimit: (amt: number) => void;
  updatePasswordRequirement: (passwordSetting: boolean) => void;
}

export const Web3Context = createContext<Web3ContextProps | undefined>(undefined);

interface Web3ProviderProps {
  children: React.ReactNode;
}
export const Web3Provider = (props: Web3ProviderProps) => {
  useSignals();
  const { children } = props;
  const { rxdBalance, exchangeRate, updateRxdBalance } = useRxd();
  const { isPasswordRequired, setIsPasswordRequired } = usePasswordSetting();
  const { noApprovalLimit, setNoAprrovalLimit } = useNoApprovalLimitSetting();

  useEffect(() => {
    // Here we are pulling in any new Utxos unaccounted for.
    if (rxdAddress.value) {
      setTimeout(() => {
        updateRxdBalance(true);
      }, 1500);
    }
  }, [updateRxdBalance]);

  useEffect(() => {
    if (locked.value) {
      storage.remove('appState');
      return;
    }

    storage.get(['appState'], (result) => {
      // only update appState when popupWindowId is empty;

      const balance = {
        rxd: rxdBalance,
        photons: Math.round(rxdBalance * RXD_DECIMAL_CONVERSION),
        usdInCents: Math.round(rxdBalance * exchangeRate * 100),
      };

      storage.set({
        appState: {
          isLocked: locked.value,
          balance,
          network: network.value,
          isPasswordRequired,
          addresses: { rxdAddress: rxdAddress.value, identityAddress: identityAddress.value },
          pubKeys: { rxdPubKey: rxdPubKey.value, identityPubKey: identityPubKey.value },
        },
      });
    });
  }, [rxdBalance, exchangeRate, isPasswordRequired]);

  const updateNetwork = async (n: NetWork) => {
    storage.set({
      network: n,
    });
    db.utxo.clear();
    db.token.clear();
    network.value = n;

    // Lock wallet so storage and signals can be recreated on login
    lock();
  };

  const updatePasswordRequirement = (isRequired: boolean): void => {
    storage.set({ isPasswordRequired: isRequired });
    setIsPasswordRequired(isRequired);
  };

  const updateNoApprovalLimit = (amt: number) => {
    storage.set({ noApprovalLimit: amt });
    setNoAprrovalLimit(amt);
  };

  return (
    <Web3Context.Provider
      value={{
        updateNetwork,
        updatePasswordRequirement,
        isPasswordRequired,
        noApprovalLimit,
        updateNoApprovalLimit,
        exchangeRate,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
