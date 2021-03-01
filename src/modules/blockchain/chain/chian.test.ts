import { MINING_DIFFICULTY } from '../../../config';
import { Block } from '../block/block.model';
import { Blockchain } from './chain.model'
import * as config from '../../../config';
import { Transaction } from '../../wallet/transaction.model';
import { Wallet } from '../../wallet/wallet.model';

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
        bc2.addBlock('foobar' as any);
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('invalidates a chain with tampered genesis block', () => {
        // TS makes the tampering very hard by its own >.< 
        (((bc2 as any)['_chain'] as Block[])[0].data as any) = 'TAMPERED';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a chain with a tampered block', () => {
        bc2.addBlock('DATA' as any);
        // TS makes the tampering very hard by its own >.< 
        (((bc2 as any)['_chain'] as Block[])[1].data as any) = 'TAMPERED';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a chain with a miner reward too high', () => {
        const wallet = new Wallet();
        const tx = Transaction.newTransaction(wallet, 'mxn', 10);
        const minerReward = Transaction.minerRewardTransaction('miner', 1000000);
        bc2.addBlock([tx, minerReward]);
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('validates a chain with a miner correct reward', () => {
        const wallet = new Wallet();
        const tx = Transaction.newTransaction(wallet, 'mxn', 10);
        const minerReward = Transaction.minerRewardTransaction('miner', config.MINING_REWARD);
        bc2.addBlock([tx, minerReward]);
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('should replace chain with a new valid chain', () => {
        bc2.addBlock('DATA' as any);
        expect(bc.replaceChain(bc2.chain)).toBe(true);
        expect(bc.chain[1]).toEqual(bc2.chain[1]);
    });

    it('should NOT replace chain with a new invalid chain', () => {
        bc2.addBlock('DATA' as any);
        (((bc2 as any)['_chain'] as Block[])[1].data as any) = 'TAMPERED';
        expect(bc.replaceChain(bc2.chain)).toBe(false);
        expect(bc.chain.length).toBe(1);
    });
});