import { ChainParams } from '../rxd-wasm/rxd_wasm';
import { network } from '../signals';

export type NetWorkStorage = {
  network: NetWork;
};

export const enum NetWork {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export const isAddressOnRightNetwork = (address: string) => {
  switch (network.value) {
    case NetWork.Mainnet:
      return address.startsWith('1');
    case NetWork.Testnet:
      return !address.startsWith('1');
  }
};

export const getChainParams = (): ChainParams => {
  return network.value === NetWork.Mainnet ? ChainParams.mainnet() : ChainParams.testnet();
};
