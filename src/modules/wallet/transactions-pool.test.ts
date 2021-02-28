import { Transaction } from './transaction.model';
import { TransactionsPool } from './transactions-pool.model';
import { Wallet } from './wallet.model';

describe('TransactionsPool', () => {

    let amount: number;
    let recipient: string;
    let senderWallet: Wallet;
    let pool: TransactionsPool;
    let transaction: Transaction;
    let transactions: Transaction[];

    beforeEach(() => {
        amount = 50;
        recipient = 'mxn';
        pool = new TransactionsPool();
        senderWallet = new Wallet();
        transaction = Transaction.newTransaction(senderWallet, recipient, amount);
        pool.upsertTransaction(transaction);
        transactions = pool.transactions;
    });

    it('is defined', () => {
        expect(pool).toBeDefined();
        expect(senderWallet).toBeDefined();
        expect(transaction).toBeDefined();
        expect(transactions).toBeDefined();
    });

    it('contains the new transaction', () => {
        expect(transactions[0].id).toBe(transaction.id);
    });

    describe('updating existing transaction', () => {

        let updatedAmount: number;
        let updatedTx: Transaction;

        beforeEach(() => {
            updatedAmount = 50;
            updatedTx = transaction.updateTransaction(senderWallet, recipient, updatedAmount);
            pool.upsertTransaction(updatedTx);
        });

        it('should have the same transaction id', () => {
            expect(pool.transactions[0].id).toBe(transaction.id);
        });

        it('should have the updated transaction with the updated balance', () => {
            expect(pool.transactions[0].outputs.find(o => o.address === senderWallet.address).amount)
                .toBe(senderWallet.balance - amount - updatedAmount);
        });

        it('should have the updated transaction with the updated amount for the recipient', () => {
            const recipientTotal = pool.transactions[0].outputs
                .filter(o => o.address === recipient)
                .reduce((p, c) => p + c.amount, 0);

            expect(recipientTotal).toBe(amount + updatedAmount);
        });
    });

    describe('adding a new transaction', () => {

        let newTx: Transaction;
        let newTxSender: Wallet;
        let newTxAmount: number;
        let newTxRecipient: string;

        beforeEach(() => {
            newTxAmount = 10;
            newTxRecipient = 'mxn2';
            newTxSender = new Wallet();
            newTx = Transaction.newTransaction(senderWallet, newTxRecipient, newTxAmount);
            pool.upsertTransaction(newTx);
        });

        it('should contain the new transaction', () => {
            expect(pool.transactions.find(t => t.id === newTx.id)).toBeDefined();
        });

        it('should preserve the old transactions too', () => {
            expect(pool.transactions.length).toBe(2);
        });
    });
});