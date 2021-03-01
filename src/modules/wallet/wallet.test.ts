import { Transaction } from './transaction.model';
import { TransactionsPool } from './transactions-pool.model';
import { Wallet } from './wallet.model';

describe('Wallet', () => {

    let amount: number;
    let recipient: string;
    let chainWallet: Wallet;
    let senderWallet: Wallet;
    let pool: TransactionsPool;
    let transaction: Transaction;

    beforeEach(() => {
        amount = 50;
        recipient = 'mxn';
        pool = new TransactionsPool();
        senderWallet = new Wallet();
        chainWallet = new Wallet();
        transaction = senderWallet.createTransaction(recipient, amount, pool);
    });

    it('it creates the transaction', () => {
        expect(transaction).toBeDefined();
    });

    it('it creates a valid blockchain transaction', () => {
        const blockchainTx = chainWallet.createTransaction('miner-wallet', 10, pool);
        expect(Transaction.verifyTransaction(blockchainTx)).toBeTruthy();
    });

    describe('repeating the transaction', () => {
        beforeEach(() => {
            senderWallet.createTransaction(recipient, amount, pool);
        });

        it('doubles the `amount` for the recipient', () => {
            const summedAmountForRecipient = transaction.outputs
                .filter(o => o.address === recipient)
                .reduce((p, c) => p + c.amount, 0);

            expect(summedAmountForRecipient).toBe(amount * 2);
        });

        it('clones the previous `amount` in 2 entries in the outputs', () => {
            expect(transaction.outputs.filter(o => o.address === recipient).length).toBe(2);
        });
    });

    describe('creating a new transaction', () => {
        beforeEach(() => {
            senderWallet.createTransaction(recipient + 2, amount, pool);
        });

        it('should contain 1 tx in the pool', () => {
            expect(pool.allTransactions.length).toBe(1);
        });
    });
});



/**
 *
 * PREV PUB:
 * 044598b286fa38fb1dd270316554a08fc25122265161aff96fd82028d19967808522f6a2fae0190809a1631141f52d0a3f6238a9ae6ab8a1fd4fc5b47a5f85b17a
 *
 * PREV PRI:
 * 80dc3aa5354819c4aa6e0a2f9354cd293ae739626c64d7c576bfd1a9bd4d6d38
 *
 * TAMP PRI:
 * 80dc3aa5354819c4aa6e0a2f9354cd293ae739626c64d7c576bfd1a9bd4d6d3
 *
 */