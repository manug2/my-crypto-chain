const Transaction = require('./transaction');
const Wallet = require('./index');
const { verifySignature } = require('../util');


describe('Transaction', () => {
    let senderWallet;
    let recipient;
    let transaction;
    let amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = 'recipient-public-key'; // address
        amount = 50;

        transaction = new Transaction( { senderWallet, recipient, amount });
    });

    it('has an `id`', () => {
        expect(transaction).toHaveProperty('id');
    });

    it('has an `recipient`', () => {
        expect(transaction).toHaveProperty('recipient');
    });

    it('has an `senderWallet`', () => {
        expect(transaction).toHaveProperty('senderWallet');
    });

    describe('outputMap', () => {
        it('has an `outputMap`', () => {
           expect(transaction).toHaveProperty('outputMap');
        });

        it('outputs the amount to the `recipient`', () => {
           expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it('outputs the remaining balance for the `senderWallet`', () => {
           expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
        });
    });

    describe('input', () => {
        it('has an `input`', () => {
           expect(transaction).toHaveProperty('input');
        });

        it('has an `timestamp` in the input', () => {
           expect(transaction.input).toHaveProperty('timestamp');
        });

        it('sets the `amount` to the `senderWallet` balance', () => {
           expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it('sets the `address` to the `senderWallet` publicKey', () => {
           expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it('signs the input', () => {
            expect(
                verifySignature({
                publicKey: senderWallet.publicKey,
                data: transaction.outputMap,
                signature: transaction.input.signature
                })
           ).toBe(true);
        });

    });

    describe('validateTransaction', () => {
        let errorLog;
        beforeEach(() => {
            errorMock = jest.fn();

            global.console.error = errorMock;
        });

        describe('when transaction is valid', () => {
            it('it returns true', () => {
                expect(Transaction.validateTransaction(transaction)).toBe(true);
            });
        });

        describe('when transaction is not valid', () => {
            describe('and a transaction outputMap is invalid', () => {
            it('it returns false and logs an error', () => {
                    transaction.outputMap[senderWallet.publicKey] = '999999';
                    expect(Transaction.validateTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and a transaction input signature is invalid', () => {
            it('it returns false and logs an error', () => {
                    transaction.input.signature = new Wallet().sign('some data');
                    expect(Transaction.validateTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });
    });

});