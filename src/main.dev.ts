import { UILibrary } from 'smart-cli';
import { Blockchain } from './modules/blockchain/chain/chain.model';
import { P2PServices } from './app/p2p/p2p.services';
import { TransactionsPool } from './modules/wallet/transactions-pool.model';
import { Wallet } from './modules/wallet/wallet.model';
import { APIServices } from './app/api/api.services';
import { Miner } from './modules/miner/miner';

/**
 * CHAIN INTRO 
 */
UILibrary.out.printBoxTitle('BLOCKCHAIN STARTUP');
UILibrary.out.printKeyValues({
    set: [
        { k: 'author', v: 'MXN' },
        { k: 'license', v: 'MIT' },
        { k: 'version', v: '0.0.0' },
    ]
});

/**
 * INITIALIZE BLOCKCHAIN
 */
const blockchain = new Blockchain();
const transactionsPool = new TransactionsPool();
UILibrary.out.printSubtitle('Initialized blockchain');


/**
 * INITIALIZE USER DATA
 */
// We are hard coding a new wallet generation each time
// In the future we'll ask the user for its private key
// if he has one. 
const wallet = new Wallet();
UILibrary.out.printSubtitle('Initialized user data');

/**
 * API SERVICES STARTUP
 */
const APISvc = new APIServices(wallet, blockchain, transactionsPool);
APISvc.start();
UILibrary.out.printSubtitle('Initialized API services');

/**
 * P2P SERVICES STARTUP
 */
const P2PSvc = new P2PServices(
    process.env.P2P_PORT && !isNaN(+process.env.P2P_PORT)
        ? +process.env.P2P_PORT
        : 5001,
    blockchain,
    process.env.P2P_PEERS ? process.env.P2P_PEERS.split(',') : [],
    transactionsPool,
);
P2PSvc.start();
UILibrary.out.printSubtitle('Initialized P2P services');


/**
 * MINER STARTUP
 */
const miner = new Miner(
    blockchain,
    wallet,
    transactionsPool,
);