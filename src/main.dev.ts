import { UILibrary } from 'smart-cli';
import { ItalChain } from './core/chain/chain.model';
import { APIServices } from './core/services/api.services';
import { P2PServices } from './core/services/p2p.services';

/**
 * CHAIN INTRO 
 */
UILibrary.out.printBoxTitle('ITALCHAIN - THE ITALIAN BLOCKCHAIN');
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
const blockchain = new ItalChain();

/**
 * API SERVICES STARTUP
 */
const APISvc = new APIServices(blockchain);
APISvc.start();

/**
 * P2P SERVICES STARTUP
 */
const P2PSvc = new P2PServices(
    process.env.P2P_PORT && !isNaN(+process.env.P2P_PORT)
        ? +process.env.P2P_PORT
        : 5001,
    blockchain,
    process.env.P2P_PEERS ? process.env.P2P_PEERS.split(',') : [],
);
P2PSvc.start();

setTimeout(() => {
    for (let i = 0; i < 100; i++) {
        blockchain.addBlock({ foo: `bar: ${i}` });
    }
}, 3000);