import { sha256 } from '@noble/hashes/sha256';
import { P2PKHAddress, Script } from 'rxd-wasm';

export function scriptHash(hex: string): string {
  return Buffer.from(sha256(Buffer.from(hex, 'hex')))
    .reverse()
    .toString('hex');
}

export const zeroRef = '00'.repeat(36);

export function nftScript(address: string, ref: string) {
  const p2pkh = P2PKHAddress.from_string(address).get_locking_script().to_asm_string();
  return Script.from_asm_string(`OP_PUSHINPUTREFSINGLETON ${ref} OP_DROP ${p2pkh}`);
}

export function parseNftScript(hex: string): {
  ref?: string;
  address?: string;
} {
  const pattern = /^d8([0-9a-f]{72})7576a914([0-9a-f]{40})88ac$/;
  const [, ref, address] = hex.match(pattern) || [];
  return { ref, address };
}

export function ftScript(address: string, ref: string) {
  const p2pkh = P2PKHAddress.from_string(address).get_locking_script().to_hex();
  /*return Script.from_asm_string(
    `${p2pkh} OP_STATESEPARATOR OP_PUSHINPUTREF ${ref} OP_REFOUTPUTCOUNT_OUTPUTS OP_INPUTINDEX OP_CODESCRIPTBYTECODE_UTXO OP_HASH256 OP_DUP OP_CODESCRIPTHASHVALUESUM_UTXOS OP_OVER OP_CODESCRIPTHASHVALUESUM_OUTPUTS OP_GREATERTHANOREQUAL OP_VERIFY OP_CODESCRIPTHASHOUTPUTCOUNT_OUTPUTS OP_NUMEQUALVERIFY`,
  );*/
  return Script.from_hex(`${p2pkh}bdd0${ref}dec0e9aa76e378e4a269e69d`);
}

export function parseFtScript(hex: string): {
  ref?: string;
  address?: string;
} {
  const pattern = /^76a914([0-9a-f]{40})88acbdd0([0-9a-f]{72})dec0e9aa76e378e4a269e69d$/;
  const [, address, ref] = hex.match(pattern) || [];
  return { ref, address };
}

// Size of scripts (not including length VarInt)
export const p2pkhScriptSize = 25;
export const nftScriptSize = 63;
export const ftScriptSize = 75;
export const p2pkhScriptSigSize = 107;

export function varIntSize(n: number) {
  if (n < 253) {
    return 1;
  } else if (n <= 65535) {
    return 3;
  } else if (n <= 4294967295) {
    return 5;
  } else if (n <= 18446744073709551615n) {
    return 9;
  } else {
    throw new Error('Invalid VarInt');
  }
}

// Transaction size without scripts (not including input/output script size VarInt and script)
export function baseTxSize(numInputs: number, numOutputs: number) {
  return (
    4 + // version
    varIntSize(numInputs) + // Input count
    (32 + // Prev tx hash
      4 + // Prev tx index
      4) * // Sequence num
      numInputs +
    varIntSize(numOutputs) + // Output count
    8 * // Value
      numOutputs +
    4 // nLockTime
  );
}

// Calcualte size of a transaction, given sizes of input and output scripts
export function txSize(inputScriptSizes: number[], outputScriptSizes: number[]) {
  return (
    baseTxSize(inputScriptSizes.length, outputScriptSizes.length) +
    inputScriptSizes.reduce((a, s) => a + varIntSize(s) + s, 0) +
    outputScriptSizes.reduce((a, s) => a + varIntSize(s) + s, 0)
  );
}
