import { MINING_DIFFICULTY } from '../config';
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
        expect(prevBlock.getTimestamp()).not.toBe(0);
        expect(lastBlock.getTimestamp()).toBeDefined();
        expect(lastBlock.getTimestamp()).not.toBe(0);
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

    it('Generates a hash that matches difficulty', () => {
        expect(lastBlock.hash.substring(0, MINING_DIFFICULTY)).toEqual('0'.repeat(MINING_DIFFICULTY));
    });


});