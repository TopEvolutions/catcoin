import { Block } from '../block/block.model';
import { Blockchain } from './chain.model'

describe('Chain', () => {
    let bc: Blockchain;
    let bc2: Blockchain;

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('is defined', () => {
        expect(bc).toBeDefined();
        expect(bc2).toBeDefined();
    });

    it('validates a chain', () => {
        bc2.addBlock('foobar');
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('invalidates a chain with tampered genesis block', () => {
        // TS makes the tampering very hard by its own >.< 
        (((bc2 as any)['_chain'] as Block[])[0].data as any) = 'TAMPERED';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a chain with a tampered block', () => {
        bc2.addBlock('DATA');
        // TS makes the tampering very hard by its own >.< 
        (((bc2 as any)['_chain'] as Block[])[1].data as any) = 'TAMPERED';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('should replace chain with a new valid chain', () => {
        bc2.addBlock('DATA');
        expect(bc.replaceChain(bc2.chain)).toBe(true);
        expect(bc.chain[1]).toEqual(bc2.chain[1]);
    });

    it('should NOT replace chain with a new invalid chain', () => {
        bc2.addBlock('DATA');
        (((bc2 as any)['_chain'] as Block[])[1].data as any) = 'TAMPERED';
        expect(bc.replaceChain(bc2.chain)).toBe(false);
        expect(bc.chain.length).toBe(1);
    });
});