const uuid = require('uuid/v1');
const { verifySignature } = require('../util');


class Transaction {

    constructor({ senderWallet, recipient, amount }) {
        this.id = uuid();

        this.senderWallet = senderWallet;
        this.recipient = recipient;
        this.amount = amount;

        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });

        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    }

    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {};
        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp : Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    static validateTransaction(transaction) {

        const { input: { address, amount, signature }, outputMap } = transaction;
        const outputTotal = Object.valivalues(outputMap)
            .reduce((total, outputAmount) => total + outputAmount);

        if (amount !== outputTotal) {
            console.error('`Invalid transaction from ${address}`');
            //console.error("Total output amount not equal to input amount");
            return false;
        }

        if (! verifySignature({ publicKey: address, data: outputMap, signature})) {
            console.error('`Invalid signature from ${address}`');
            return false;
        }

        return true;
    }
}

module.exports = Transaction;