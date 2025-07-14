import { Block } from './Block';
import { Transaction } from './Transaction';

export class Blockchain {
  chain: Block[] = [];
  difficulty: number = 2;
  pendingTransactions: Transaction[] = [];
  miningReward: number = 50;
  balances: Record<string, number> = {};

  constructor() {
    const genesis = this.createGenesisBlock();
    this.chain.push(genesis);
  }

  createGenesisBlock(): Block {
    return new Block(0, Date.now(), [], '0');
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(minerAddress: string): void {
    const rewardTx = new Transaction('SYSTEM', minerAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.updateBalances(block.transactions);
    this.pendingTransactions = [];
  }

  createTransaction(transaction: Transaction): boolean {
    const senderBalance = this.getBalanceOf(transaction.sender);
    if (transaction.sender !== 'SYSTEM' && senderBalance < transaction.amount) {
      console.log(`❌ Insufficient balance for ${transaction.sender}`);
      return false;
    }
    this.pendingTransactions.push(transaction);
    return true;
  }

  getBalanceOf(address: string): number {
    return this.balances[address] || 0;
  }

  updateBalances(transactions: Transaction[]): void {
    for (const tx of transactions) {
      if (tx.sender !== 'SYSTEM') {
        this.balances[tx.sender] = this.getBalanceOf(tx.sender) - tx.amount;
      }
      this.balances[tx.recipient] = this.getBalanceOf(tx.recipient) + tx.amount;
    }
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }
}

