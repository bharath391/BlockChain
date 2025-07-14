
import { Blockchain } from './BlockChain';
import { Transaction } from './Transaction';

const chain = new Blockchain();

//  Step 1: Create some transactions
chain.createTransaction(new Transaction('Alice', 'Bob', 100));
chain.createTransaction(new Transaction('Bob', 'Charlie', 50));

// Alice and Bob don’t have money yet — will still be accepted for now

//  Step 2: Mine a block (include those transactions)
console.log('⛏️ Mining Block 1...');
chain.minePendingTransactions('Miner1');

//  Step 3: Check balances
console.log('\n💰 Balances after Block 1:');
console.log('Alice:', chain.getBalanceOf('Alice'));      // -100
console.log('Bob:', chain.getBalanceOf('Bob'));          // +50 -50 = 0
console.log('Charlie:', chain.getBalanceOf('Charlie'));  // +50
console.log('Miner1:', chain.getBalanceOf('Miner1'));    // +50 reward

//  Step 4: More transactions
chain.createTransaction(new Transaction('Charlie', 'Alice', 20));
chain.createTransaction(new Transaction('Bob', 'Alice', 30)); // This will fail (insufficient)

//  Step 5: Mine again
console.log('\n⛏️ Mining Block 2...');
chain.minePendingTransactions('Miner2');

//  Step 6: Final balances
console.log('\n💰 Balances after Block 2:');
console.log('Alice:', chain.getBalanceOf('Alice'));
console.log('Bob:', chain.getBalanceOf('Bob'));
console.log('Charlie:', chain.getBalanceOf('Charlie'));
console.log('Miner2:', chain.getBalanceOf('Miner2'));
