import { Transaction } from './transaction.model';
import { Wallet } from './wallet.model';

describe('Transaction', () => {

    let amount: number;
    let recipient: string;
    let senderWallet: Wallet;
    let transaction: Transaction;

    beforeEach(() => {
        amount = 50;
        recipient = 'mxn';
        senderWallet = new Wallet();
        transaction = Transaction.newTransaction(senderWallet, recipient, amount);
    });

    it('is defined', () => {
        expect(amount).toBeDefined();
        expect(recipient).toBeDefined();
        expect(transaction).toBeDefined();
        expect(senderWallet).toBeDefined();
    });

    it('outputs the balance updated with the subtracted amount sent', () => {
        expect(transaction.outputs.find(o => o.address === senderWallet.address).amount)
            .toBe(senderWallet.balance - amount);
    });

    it('outputs the right amount to the recipient', () => {
        expect(transaction.outputs.find(o => o.address === recipient).amount)
            .toBe(amount);
    });

    it('sets the right balance in the input', () => {
        expect(transaction.input.balance).toBe(senderWallet.balance);
    });

    it('sets the right address in the input', () => {
        expect(transaction.input.address).toBe(senderWallet.address);
    });

    it('signs the outputs', () => {
        expect(transaction.input.signature).toBeDefined();
    });

    it('sets the timestamp', () => {
        expect(transaction.input.timestamp).toBeDefined();
    });

    it('verifies a legit transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBeTruthy();
    });

    it('catches a tampered transaction', () => {
        (transaction.outputs[0].amount as any) = 5000;
        expect(Transaction.verifyTransaction(transaction)).toBeFalsy();
    });

    it('updates a transaction', () => {
        transaction = transaction.updateTransaction(senderWallet, 'mxn2', 100);
        expect(transaction).toBeDefined();
        expect(Transaction.verifyTransaction(transaction)).toBeTruthy();
        expect(transaction.outputs.find(o => o.address === 'mxn2').amount)
            .toBe(100);
        expect(transaction.outputs.find(o => o.address === senderWallet.address).amount)
            .toBe(senderWallet.balance - amount - 100);
    });

    it('refuses to update a transaction with amount exceeding balance', () => {
        transaction = transaction.updateTransaction(senderWallet, 'mxn2', 10000);
        expect(transaction).toBeNull();
    });

    describe('transacting with an amount that exceeds the balance', () => {
        beforeEach(() => {
            amount = 10000000;
            transaction = Transaction.newTransaction(senderWallet, recipient, amount);
        });

        it('should not create the transaction', () => {
            expect(transaction).toBeNull();
        });
    });
});