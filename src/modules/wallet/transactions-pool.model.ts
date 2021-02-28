import { Transaction } from './transaction.model';

export class TransactionsPool {
    private pool: Transaction[] = [];

    get transactions(): Transaction[] { return this.pool; }

    getTransaction(pubK: string): Transaction {
        return this.transactions.find(t => t.input.address === pubK);
    }

    upsertTransaction(tx: Transaction): void {
        const existingTx = this.pool.find(t => tx.id === t.id);
        if (!!existingTx) {
            this.pool[this.pool.indexOf(existingTx)] = tx;
        } else {
            this.pool.push(tx);
        }
    }
}