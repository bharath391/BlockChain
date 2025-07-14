
import { createHash } from 'crypto';
import { Transaction } from './Transaction';

export class Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  nonce: number = 0;
  hash: string;

  constructor(index: number, timestamp: number, transactions: Transaction[], previousHash: string = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    const txData = this.transactions.map(tx => JSON.stringify(tx)).join('');
    return createHash('sha256')
      .update(this.index + this.previousHash + this.timestamp + txData + this.nonce)
      .digest('hex');
  }

  mineBlock(difficulty: number): void {
    while (!this.hash.startsWith('0'.repeat(difficulty))) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`🪙 Block mined: ${this.hash}`);
  }
}
