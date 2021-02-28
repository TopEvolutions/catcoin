import { ec } from 'elliptic';
import { INITIAL_BALANCE } from './config';
import { ChainUtil } from '../blockchain/chain/chain.util';
import { Transaction } from './transaction.model';
import { UILibrary } from 'smart-cli';
import { TransactionsPool } from './transactions-pool.model';

export class Wallet {

    private _balance: number;
    private _publicKey: string;
    private _keyPair: ec.KeyPair;

    constructor() {
        this._balance = INITIAL_BALANCE;
        this._keyPair = ChainUtil.genKeyPair();
        this._publicKey = this._keyPair.getPublic(true, 'hex');
    }

    get balance(): number { return this._balance; }
    get address(): string { return this._publicKey; }
    get publicKey(): string { return this._publicKey; }

    sign(hash: string): string {
        return this._keyPair.sign(hash).toDER('hex');
    }

    createTransaction(
        recipient: string,
        amount: number,
        pool: TransactionsPool,
    ): Transaction {
        if (this.balance < amount) {
            UILibrary.out.printError(`Amount: ${amount} exceeds balance: ${amount}`);
            return null;
        }

        let tx = pool.getTransaction(this._publicKey);
        if (!tx) {
            tx = Transaction.newTransaction(this, recipient, amount);
            pool.upsertTransaction(tx);
        } else {
            tx = tx.updateTransaction(this, recipient, amount);
        }

        return tx;
    }

    toString(): string {
        return `Wallet:
        BALANCE       : ${this.balance}
        PUBLIC_KEY    : ${this.publicKey}
        PRIVATE_KEY   : ${this._keyPair.getPrivate('hex')}
        `;
    }
}