import { Block } from '../block/block.model';
import { SysEvents } from '../enums/sys-events.enum';
import { SystemEventsManager } from '../events/events.model';

export class ItalChain {
    private _chain: Block[] = [];

    constructor() {
        this._chain.push(Block.genesis());
    }

    get chain(): Block[] { return this._chain; }
    get lastBlock(): Block { return this._chain[this._chain.length - 1]; }

    addBlock(data: any): void {
        const block = Block.mineBlock(
            data,
            this.chain[this.chain.length - 1],
        );

        this._chain.push(block);
        SystemEventsManager.emit(SysEvents.newBlockAddedToChain);
    }

    isValidChain(chain: Block[]) {
        if (!Array.isArray(chain)) return false;
        if (chain.length === 0) return false;

        const newChainGenesis = JSON.stringify(chain[0]);
        const genuineChainGenesis = JSON.stringify(Block.genesis());
        if (newChainGenesis !== genuineChainGenesis) return false;

        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const previousBlock = chain[i - 1];

            if (currentBlock.previousHash !== previousBlock.hash) return false;
            if (currentBlock.hash !== Block.hashBlock(currentBlock)) return false;
        }

        return true;
    }

    replaceChain(newChain: Block[]): boolean {
        if (newChain.length <= this._chain.length) {
            console.log('Refusing to replace shorter or same length chain');
            return false;
        }

        if (!this.isValidChain(newChain)) {
            console.log('Refusing to replace chain with invalid one');
            return false;
        }

        this._chain = newChain;
        console.log(`Chain replaced with new one. Blocks count: ${this._chain.length}`);
        return true;
    }
}