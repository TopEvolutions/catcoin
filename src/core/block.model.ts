export abstract class IBlock {

    private timestamp: number;

    constructor(
        readonly hash: number,
        readonly payload: number,
        readonly prevHash: number,
    ) {
        this.timestamp = new Date().getTime();
    }
}

export class Block extends IBlock {
    constructor(
        readonly hash: number,
        readonly payload: number,
        readonly prevHash: number,
    ) {
        super(hash, payload, prevHash);
    }
}