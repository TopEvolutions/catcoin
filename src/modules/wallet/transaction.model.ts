import { UILibrary } from 'smart-cli';
import { MINING_REWARD } from '../../config';
import { ChainUtil } from '../blockchain/chain/chain.util';
import { Wallet } from './wallet.model';

export class TransactionInput {
    balance: number;
    address: string;
    signature: string;
    timestamp: number;
}

export class TransactionOutput {
    constructor(
        public amount: number,
        public address: string,
    ) { }
}

export class Transaction {
    readonly id = ChainUtil.genTimeBasedId();

    constructor(
        readonly input: TransactionInput,
        readonly outputs: TransactionOutput[],
    ) { }

    updateTransaction(senderWallet: Wallet, recipient: string, amount: number): Transaction {
        const senderOutput = this.outputs.find(o => o.address === senderWallet.address);
        if (!senderOutput) {
            UILibrary.out.printError(`Cannot find sender wallet [${senderWallet.address}] output to update tx`);
            return null;
        }

        if (senderOutput.amount < amount) {
            UILibrary.out.printError(`Amount: ${amount} exceeds balance: ${senderOutput.amount}`);
            return null;
        }

        senderOutput.amount -= amount;
        this.outputs.push({
            amount,
            address: recipient,
        });

        return Transaction.signUpdatedTransaction(this, senderWallet);
    }

    static newTransaction(senderWallet: Wallet, recipient: string, amount: number): Transaction {
        if (senderWallet.balance < amount) {
            UILibrary.out.printError(`Amount: ${amount} exceeds balance: ${senderWallet.balance}`);
            return null;
        }

        const outputs: TransactionOutput[] = [
            { address: recipient, amount: amount },
            { address: senderWallet.address, amount: senderWallet.balance - amount },
        ];


        return Transaction.signNewTransaction(senderWallet, outputs);
    }

    static minerRewardTransaction(address: string, reward: number): Transaction {
        // miner reward transactions have no inputs, are not signed and contains the 
        // outputs of the miners you want to reward. In our case it's always one.
        // https://stackoverflow.com/questions/66428728/how-to-sign-miners-rewards-on-a-blockchain

        const outputs: TransactionOutput[] = [
            { address: address, amount: reward },
        ];
        return new Transaction(null, outputs);
    }

    static verifyTransaction(transaction: Transaction): boolean {
        return ChainUtil.verify(
            transaction.input.address,
            ChainUtil.hashData(transaction.outputs),
            transaction.input.signature,
        );
    }

    private static signNewTransaction(senderWallet: Wallet, outputs: TransactionOutput[]): Transaction {
        return new Transaction({
            address: senderWallet.address,
            balance: senderWallet.balance,
            timestamp: new Date().getTime(),
            signature: senderWallet.sign(ChainUtil.hashData(outputs)),
        }, outputs);
    }

    private static signUpdatedTransaction(transaction: Transaction, senderWallet: Wallet): Transaction {
        transaction.input.signature = senderWallet.sign(ChainUtil.hashData(transaction.outputs));
        return transaction;
    }
}