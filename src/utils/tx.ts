import { Transaction } from 'rxd-wasm';

export const txInputs = (tx: Transaction) => new Array(tx.get_ninputs()).fill(null).map((_, i) => tx.get_input(i));
export const txOutputs = (tx: Transaction) => new Array(tx.get_noutputs()).fill(null).map((_, i) => tx.get_output(i));
