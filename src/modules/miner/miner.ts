import { UILibrary } from 'smart-cli';
import { MINING_REWARD } from '../../config';
import { Blockchain } from '../blockchain/chain/chain.model';
import { SystemEventsManager } from '../events/events.model';
import { SysEvents } from '../events/sys-events.enum';
import { Transaction } from '../wallet/transaction.model';
import { TransactionsPool } from '../wallet/transactions-pool.model';
import { Wallet } from '../wallet/wallet.model';

export class Miner {

    private _mining = false;

    constructor(
        private readonly _chain: Blockchain,
        private readonly _minerWallet: Wallet,
        private readonly _pool: TransactionsPool,
    ) {
        setInterval(() => {
            if (!this._pool.validTransactions.length || this._mining) {
                UILibrary.out.printWarning('Nothing to mine for this round');
                return;
            }

            this.mine();
        }, 1000 * 60);
    }

    mine(): void {
        this._mining = true;

        const transactions = this._pool.validTransactions;
        const minerReward = Transaction.minerRewardTransaction(this._minerWallet.address, MINING_REWARD);

        transactions.push(minerReward);
        const block = this._chain.addBlock(transactions);
        SystemEventsManager.emit(SysEvents.newBlockAddedToChain, block)

        ///////////////////////////////////////////////////////////////////
        //                        IMPORTANT TODO
        ///////////////////////////////////////////////////////////////////
        // TODO: we will have to implement a check that 
        // ensures that the pool should actually be cleared,
        // and is not a evil peer that is trying to force the peers
        // to flush the pool for some absurd reason
        this._pool.clear();

        this._mining = false;
    }
}