import { ElectrumUtxo } from '../Electrum';
import { db } from '../db';

export async function unspentDiff(unspent: ElectrumUtxo[], type: 'rxd' | 'ft' | 'nft') {
  // Create an array of UTXOs not in the database
  const newUnspent = (
    await Promise.all(
      unspent.map(async (u) => ((await db.utxo.get({ txid: u.tx_hash, vout: u.tx_pos })) ? undefined : u)),
    )
  ).filter(Boolean) as ElectrumUtxo[];

  // Create an array of spent UTXOs
  const spent: number[] = [];
  await db.utxo.where({ type }).each((utxo) => {
    if (unspent.findIndex((u) => u.tx_hash === utxo.txid && u.tx_pos === utxo.vout) < 0) {
      spent.push(utxo.id as number);
    }
  });

  return { newUnspent, spent };
}
