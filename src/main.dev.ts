import { UILibrary } from 'smart-cli';
import { Block } from './core/block/block.model';

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
 * CHAIN STARTUP
 */
console.log(Block.mineBlock({ foo: 'Bar' }, Block.genesis()).toString());