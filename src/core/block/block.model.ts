import { SHA256 } from 'crypto-js';
import { UILibrary } from 'smart-cli';
import { MINING_DIFFICULTY, MINING_RATE } from '../config';

export class Block {
    constructor(
        readonly data: any,
        readonly hash: string,
        readonly previousHash: string,
        readonly timestamp: number,
        readonly nonce: number,
        readonly difficulty: number,
    ) {
        if (!this.difficulty) {
            this.difficulty = MINING_DIFFICULTY;
        }
    }

    getTimestamp(): number {
        return this.timestamp;
    }

    toString(): string {
        return `
        Block data   :
         - TIMESTAMP : ${this.timestamp}
         - HASH      : ${this.hash}
         - NONCE     : ${this.nonce}
         - DIFFICULTY: ${this.difficulty}
         - PREV HASH : ${this.previousHash}
         `;
    }

    static genesis(): Block {
        let hash = '#GENESIS#';
        let data = { genesis: true };
        let prevHash = '-'.repeat(64);
        let timestamp = -1;
        let nonce = 0;
        let difficulty: any = null;
        return new Block(data, hash, prevHash, timestamp, nonce, difficulty);
    }

    static mineBlock(
        data: any,
        previousBlock: Block,
    ): Block {
        let nonce = -1;
        let hash: string;
        let timestamp: number;
        let { difficulty } = previousBlock;
        UILibrary.out.printWarning('Starting mining of new block');

        do {
            nonce++;
            timestamp = new Date().getTime();
            difficulty = Block.adjustDifficulty(previousBlock, timestamp);
            hash = Block._hashData(data, timestamp, previousBlock.hash, nonce, difficulty);

        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        const minedBlock = new Block(data, hash, previousBlock.hash, timestamp, nonce, difficulty);

        UILibrary.out.printWarning(`Mined new block: ${hash}`);
        console.log(minedBlock.toString());

        return minedBlock;
    }

    static adjustDifficulty(previousBlock: Block, timestamp: number): number {
        let { difficulty } = previousBlock;
        difficulty = previousBlock.timestamp + MINING_RATE > timestamp
            ? difficulty + 1
            : difficulty - 1;
        return difficulty;
    }

    static hashBlock(block: Block): string {
        return this._hashData(
            block.data,
            block.timestamp,
            block.previousHash,
            block.nonce,
            block.difficulty,
        );
    }

    private static _hashData(
        data: string,
        timestamp: number,
        previousHash: string,
        nonce: number,
        difficulty: number,
    ): string {
        return SHA256(`${data}${timestamp}${previousHash}${nonce}${difficulty}`).toString();
    }
}