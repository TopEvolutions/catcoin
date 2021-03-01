import { UILibrary } from 'smart-cli';
import { Transaction } from './transaction.model';

export class TransactionsPool {
    private _pool: Transaction[] = [];

    get allTransactions(): Transaction[] {
        return this._pool;
    }

    get validTransactions(): Transaction[] {
        return this._pool.filter(tx => {
            const inputBalance = tx.input.balance;
            const outputTotal = tx.outputs.reduce((total, curr) => total + curr.amount, 0);
            if (outputTotal > inputBalance) {
                UILibrary.out.printError('`outputTotal` exceeds `inputBalance` by: ' + (outputTotal - inputBalance));
                return;
            }
            if (outputTotal < inputBalance) {
                UILibrary.out.printError('`outputTotal` is lower than `inputBalance` by: ' + (inputBalance - outputTotal));
                return;
            }

            // verify signature
            if (!Transaction.verifyTransaction(tx)) {
                UILibrary.out.printError(`transaction [${tx.id}] has an invalid signature`);
                return;
            }

            return tx;
        });
    }

    getTransaction(pubK: string): Transaction {
        return this.allTransactions.find(t => t.input.address === pubK);
    }

    upsertTransaction(tx: Transaction): void {
        const existingTx = this._pool.find(t => tx.id === t.id);
        if (!!existingTx) {
            this._pool[this._pool.indexOf(existingTx)] = tx;
        } else {
            this._pool.push(tx);
        }
    }
}