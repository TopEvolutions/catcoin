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
        return new Block({ genesis: true }, '#GENESIS#', '---------',);
    }

    static mineBlock(
        data: any,
        previousBlock: Block,
    ): Block {
        const timestamp = new Date().getTime();
        return new Block(
            data,
            Block.hashData(
                data,
                timestamp,
                previousBlock.hash,
            ),
            previousBlock.hash,
            timestamp,
        );
    }

    private static hashData(
        data: string,
        timestamp: number,
        previousHash: string,
    ): string {
        return SHA256(`${data}${timestamp}${previousHash}`).toString();
    }
}