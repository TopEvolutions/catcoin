import { Block } from './block.model';

describe('Block', () => {

    let lastBlock: Block;
    let prevBlock: Block;
    let inputData = { foo: 'bar' };

    beforeEach(() => {
        prevBlock = Block.genesis();
        lastBlock = Block.mineBlock(inputData, prevBlock);
    });

    it('Assigns a timestamp', () => {
        expect(prevBlock.getTimestamp()).toBeDefined();
        expect(lastBlock.getTimestamp()).toBeDefined();
    });

    it('Respects input `data`', () => {
        expect(lastBlock.data).toBeDefined();
        expect(JSON.stringify(lastBlock.data)).toBe(JSON.stringify(inputData));
    });

    it('Receives the hash from the previous block', () => {
        expect(lastBlock.previousHash).toBe(prevBlock.hash);
    });

    it('Calculates its own hash', () => {
        expect(lastBlock.hash).toBeDefined();
        expect(lastBlock.hash.length).toBe(64);
    });
});