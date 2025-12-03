const Blockchain = require('./blockchain')
const Block = require('./block')



describe ('Blockchain', () => {

  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });


  it('contains a `chain` Array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block to the chain', () => {
    const newData = 'some new block data';
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
  });


  describe ('isValidChain()', () => {

    describe ('when the chain does not start with genesis', () => {

      it('return false', () => {
        blockchain.chain[0] = { data: 'fake-genesis' };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });
    

    describe ('when the chain does start with genesis and is non-trivial', () => {

      describe('and a `lastHash` reference has changed', () => {

        it('return false', () => {

          blockchain.addBlock({ data : 'new data new block' });
          blockchain.chain[1].lastHash = '123456';

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and chain contains a block with an invalid field', () => {

        it('return false', () => {
          blockchain.addBlock({ data : 'new data new block' });
          blockchain.chain[1].timestamp = 'time-12015456';

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and chain does not contain any invalid blocks', () => {

        it('return true', () => {
          blockchain.addBlock({ data : 'new data new block' });
          blockchain.addBlock({ data : 'Some awesome data' });

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });

    });
    
  });


  describe('replaceChain()', () => {

    let newchain;
    let originalChain;

    beforeEach(() => {
      blockchain.addBlock('Data#1');
      blockchain.addBlock('Data#2');

      newchain = new Blockchain();
      originalChain = blockchain.chain;
    });

    describe('when the new chain is not longer', () => {
      it('does not replace the chain', () => {
        newchain.chain[0] = { data: 'changed data' };
        blockchain.replaceChain(newchain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe('when the new chain is longer', () => {

      beforeEach(() => {
        newchain.addBlock({ data: 'New-Data#1' });
        newchain.addBlock({ data: 'New-Data#2' });
      });

      describe('and the chain is invalid', () => {
        it('does not replace the chain', () => {
          newchain.chain[1].hash = 'fake-bad-hash';
          blockchain.replaceChain(newchain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
      });

      describe('and the chain is valid', () => {
        it('replaces the chain', () => {
          blockchain.replaceChain(newchain.chain);
          expect(blockchain.chain).toEqual(newchain.chain);
        });
      });
    });

  });

});

