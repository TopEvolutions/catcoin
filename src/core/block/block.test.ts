import { Block } from './block.model';

describe('Block', () => {

    let block: Block;
    let lastBlock: Block;
    let inputData = { foo: 'bar' };

    beforeEach(() => {
        lastBlock = Block.genesis();
        block = Block.mineBlock(inputData, lastBlock);
    });

    it('Assigns a timestamp', () => {
        expect(lastBlock.getTimestamp()).toBeDefined();
        expect(block.getTimestamp()).toBeDefined();
    });

    it('Respects input `data`', () => {
        expect(block.data).toBeDefined();
        expect(JSON.stringify(block.data)).toBe(JSON.stringify(inputData));
    });

    it('Receives the hash from the previous block', () => {
        expect(block.previousHash).toBe(lastBlock.hash);
    });

    it('Calculates its own hash', () => {
        expect(block.hash).toBeDefined();
        expect(block.hash.length).toBe(64);
    });

    it('Generates a hash that matches difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });

    it('Should lower difficulty if a block is mined too slowly', () => {
        expect(Block.adjustDifficulty(lastBlock, lastBlock.timestamp + 36 * 100 * 1000))
            .toEqual(lastBlock.difficulty - 1);
    });

    it('Should raise difficulty if a block is mined too quickly', () => {
        expect(Block.adjustDifficulty(lastBlock, lastBlock.timestamp + 1))
            .toEqual(lastBlock.difficulty + 1);
    });
});