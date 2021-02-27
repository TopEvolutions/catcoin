import { Express } from 'express';
import bodyParser from 'body-parser';
import express from 'express';
import { UILibrary } from 'smart-cli';
import { ItalChain } from '../chain/chain.model';

export class APIServices {

    private _server: any;
    private readonly _PORT = process.env.API_PORT || 3100;
    private readonly _expressApp: Express = express();

    constructor(
        private readonly _blockchain: ItalChain,
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
                console.log(`ItalChain api services listening at http://localhost:${this._PORT}`);
                r();
            });
        });
    }

    private registerEndpoints() {
        this._expressApp.get('/', (req, res) => {
            res.send('WELCOME TO ITALCHAIN');
        });

        this._expressApp.get('/blocks', (req, res) => {
            res.send(this._blockchain.chain);
        });

        this._expressApp.post('/mine', (req, res) => {
            this._blockchain.addBlock(req.body);
            UILibrary.out.printInfo(`Added new block to chain: ${this._blockchain.lastBlock.hash}`);
            res.redirect('/blocks');
        });
    }
}