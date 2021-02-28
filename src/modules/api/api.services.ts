import { Express } from 'express';
import bodyParser from 'body-parser';
import express from 'express';
import { UILibrary } from 'smart-cli';
import { Blockchain } from '../../modules/blockchain/chain/chain.model';
import { TransactionsPool } from '../wallet/transactions-pool.model';
import { Wallet } from '../wallet/wallet.model';
import { SystemEventsManager } from '../events/events.model';
import { SysEvents } from '../events/sys-events.enum';

export class APIServices {

    private _server: any;
    private readonly _PORT = process.env.API_PORT || 3100;
    private readonly _expressApp: Express = express();

    constructor(
        private readonly _wallet: Wallet,
        private readonly _blockchain: Blockchain,
        private readonly _transactionsPool: TransactionsPool,
    ) {
        this.initAPI();
        this.registerEndpoints();
    }

    private initAPI() {
        this._expressApp.use(bodyParser.json());
        this._expressApp.use(bodyParser.urlencoded({ extended: false }));
        process.on('SIGINT', () => {
            if (!!this._server) this._server.close();
        });
    }

    start(): Promise<void> {
        return new Promise(r => {
            this._server = this._expressApp.listen(this._PORT, () => {
                console.log(`Blockhain api services listening at http://localhost:${this._PORT}`);
                r();
            });
        });
    }

    private registerEndpoints() {
        this._expressApp.get('/', (req, res) => {
            res.send('WELCOME TO THE BLOCKCHAIN NETWORK');
        });

        // CHAIN HANDLERS
        this._expressApp.get('/blocks', (req, res) => {
            res.send(this._blockchain.chain);
        });

        // MINING HANDLERS
        this._expressApp.post('/mine', (req, res) => {
            this._blockchain.addBlock(req.body);
            UILibrary.out.printInfo(`Added new block to chain: ${this._blockchain.lastBlock.hash}`);
            res.redirect('/blocks');
        });

        // TRANSACTIONS HANDLERS
        this._expressApp.get('/transactions', (req, res) => {
            res.send(this._transactionsPool.transactions);
        });

        this._expressApp.post('/transaction', (req, res) => {
            const { recipient, amount } = req.body;
            if (isNaN(amount)) {
                res.status(400).send('Amount must be a number');
                return;
            }

            const tx = this._wallet.createTransaction(recipient, amount, this._transactionsPool);
            SystemEventsManager.emit(SysEvents.newTransaction, tx);
            res.redirect('/transactions');
        });
    }
}