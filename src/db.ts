import Dexie, { Table } from 'dexie';

export interface Token {
  id?: number;
  type: 'ft' | 'nft';
  ref: string;
  name: string;
  ticker: string;
  balance: bigint;
  fileExt: string;
}

export interface Utxo {
  id?: number;
  type: 'rxd' | 'ft' | 'nft';
  txid: string;
  vout: number;
  value: bigint;
  tokenId?: number;
}

export class Database extends Dexie {
  token!: Table<Token>;
  utxo!: Table<Utxo>;

  constructor() {
    super('db');
    this.version(1).stores({
      token: '++id, &ref, type, name, ticker',
      utxo: '++id, type, &[txid+vout], tokenId',
    });
  }
}

export const db = new Database();
