import * as uuid from 'uuid';
import elliptic from 'elliptic';
import { SHA256 } from 'crypto-js';

export class ChainUtil {

    private static readonly _EC = new elliptic.ec('secp256k1');

    static genKeyPair(privateKey?: string) {
        if (privateKey) {
            return ChainUtil._EC.keyFromPrivate(privateKey);
        }
        return ChainUtil._EC.genKeyPair();
    }

    static genTimeBasedId(): string {
        return uuid.v1();
    }

    static hashData(data: any): string {
        return SHA256(JSON.stringify(data)).toString();
    }

    static verify(publicKey: string, hash: string, signature: string): boolean {
        return this._EC.keyFromPublic(publicKey, 'hex').verify(hash, signature);
    }
}