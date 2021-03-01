import { MINING_REWARD } from '../../config';
import { Blockchain } from '../blockchain/chain/chain.model';
import { Transaction } from '../wallet/transaction.model';
import { TransactionsPool } from '../wallet/transactions-pool.model';
import { Wallet } from '../wallet/wallet.model';

export class Miner {

    constructor(
        private readonly _chain: Blockchain,
        private readonly _minerWallet: Wallet,
        private readonly _pool: TransactionsPool,
    ) { }

    mine(): void {
        const transactions = this._pool.validTransactions;
        const minerReward = Transaction.minerRewardTransaction(this._minerWallet.address, MINING_REWARD);

        transactions.push(minerReward);

        // app new block to chain
        // dispatch new chain

        // clear transactions pool
        // broadcast clear transactions pool
    }
}