import * as bip39 from 'bip39';
import { ExtendedPrivateKey, PrivateKey } from 'rxd-wasm';
import { DEFAULT_IDENTITY_PATH, DEFAULT_WALLET_PATH } from './constants';
import { getChainParams } from './network';

export type Keys = {
  mnemonic: string;
  walletWif: string;
  walletAddress: string;
  walletPubKey: string;
  walletDerivationPath: string;
  identityWif: string;
  identityAddress: string;
  identityPubKey: string;
  identityDerivationPath: string;
};

export type InternalOrbitalTags =
  | { label: 'orbital'; id: 'rxd'; domain: ''; meta: {} }
  | { label: 'orbital'; id: 'ord'; domain: ''; meta: {} }
  | { label: 'orbital'; id: 'identity'; domain: ''; meta: {} };

export type DerivationTag =
  | InternalOrbitalTags
  | {
      label: string;
      id: string;
      domain: string;
      meta?: Record<string, any>;
    };

const getWifAndDerivation = (seedPhrase: string, derivationPath: string) => {
  const seed = bip39.mnemonicToSeedSync(seedPhrase);
  const masterNode = ExtendedPrivateKey.from_seed(seed);
  const childNode = derivationPath === 'm' ? masterNode : masterNode.derive_from_path(derivationPath);
  const privateKey = childNode.get_private_key();
  const wif = privateKey.to_wif();

  return { wif, derivationPath };
};

export const generateKeysFromTag = (mnemonic: string, derivation: string) => {
  const wifAndDp = getWifAndDerivation(mnemonic, derivation);
  const privKey = PrivateKey.from_wif(wifAndDp.wif);
  const pubKey = privKey.to_public_key();
  const address = pubKey.to_address().set_chain_params(getChainParams()).to_string();
  return {
    wif: wifAndDp.wif,
    derivationPath: wifAndDp.derivationPath,
    privKey,
    pubKey,
    address,
  };
};

export const getKeys = (
  validMnemonic?: string,
  walletDerivation: string | null = null,
  identityDerivation: string | null = null,
) => {
  if (validMnemonic) {
    const isValid = bip39.validateMnemonic(validMnemonic);
    if (!isValid) throw new Error('Invalid Mnemonic!');
  }
  const mnemonic = validMnemonic ?? bip39.generateMnemonic();
  const wallet = generateKeysFromTag(mnemonic, walletDerivation || DEFAULT_WALLET_PATH);
  const identity = generateKeysFromTag(mnemonic, identityDerivation || DEFAULT_IDENTITY_PATH);

  const keys: Keys = {
    mnemonic,
    walletWif: wallet.wif,
    walletAddress: wallet.address,
    walletPubKey: wallet.pubKey.to_hex(),
    walletDerivationPath: wallet.derivationPath,
    identityWif: identity.wif,
    identityAddress: identity.address,
    identityPubKey: identity.pubKey.to_hex(),
    identityDerivationPath: identity.derivationPath,
  };

  return keys;
};

export const getPrivateKeyFromTag = (tag: DerivationTag, keys: Keys) => {
  switch (tag.id) {
    case 'rxd':
      return PrivateKey.from_wif(keys.walletWif);
    case 'identity':
      return PrivateKey.from_wif(keys.identityWif);
    default:
      return PrivateKey.from_wif(keys.identityWif);
  }
};
