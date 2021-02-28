import { Transaction } from './transaction.model';
import { TransactionsPool } from './transactions-pool.model';
import { Wallet } from './wallet.model';

describe('Wallet', () => {

    let amount: number;
    let recipient: string;
    let senderWallet: Wallet;
    let pool: TransactionsPool;
    let transaction: Transaction;

    beforeEach(() => {
        amount = 50;
        recipient = 'mxn';
        pool = new TransactionsPool();
        senderWallet = new Wallet();
        transaction = senderWallet.createTransaction(recipient, amount, pool);
    });

    it('it creates the transaction', () => {
        expect(transaction).toBeDefined();
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
            expect(pool.transactions.length).toBe(1);
        });
    });
});