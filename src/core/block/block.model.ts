import { SHA256 } from 'crypto-js';

export class Block {
    constructor(
        readonly data: any,
        readonly hash: string,
        readonly previousHash: string,
        readonly timestamp = new Date().getTime(),
    ) { }

    getTimestamp(): number {
        return this.timestamp;
    }

    toString(): string {
        return `
        Block data   :
         - TIMESTAMP : ${this.timestamp}
         - HASH      : ${this.hash}
         - PREV HASH : ${this.previousHash}
         `;
    }

    static genesis(): Block {
        return new Block({ genesis: true }, '#GENESIS#', '---------', 0);
    }

    static mineBlock(
        data: any,
        previousBlock: Block,
    ): Block {
        const timestamp = new Date().getTime();
        return new Block(
            data,
            Block._hashData(
                data,
                timestamp,
                previousBlock.hash,
            ),
            previousBlock.hash,
            timestamp,
        );
    }

    static hashBlock(block: Block): string {
        return this._hashData(
            block.data,
            block.timestamp,
            block.previousHash,
        );
    }

    private static _hashData(
        data: string,
        timestamp: number,
        previousHash: string,
    ): string {
        return SHA256(`${data}${timestamp}${previousHash}`).toString();
    }
}