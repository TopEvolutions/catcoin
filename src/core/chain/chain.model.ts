import { Block } from '../block/block.model';

export class ItalChain {

    private readonly _chain: Block[] = [];

    constructor() {
        this._chain.push(Block.genesis());
    }

    get chain(): Block[] { return this._chain; }

    addBlock(data: any): void {
        const block = Block.mineBlock(
            data,
            this.chain[this.chain.length - 1],
        );

        this._chain.push(block);
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

        for (let i = 0; i < this._chain.length; i++)
            this._chain.pop();

        if (this._chain.length !== 0) {
            console.log('Could not flush the chain before replace');
            return false;
        }

        console.log('Replacing chain...');
        this._chain.push(...newChain);
        console.log('Chain replaced with new one');
        return true;
    }
}