const Block = require('./block');
const { GENESIS_DATA } = require('./config')
const cryptoHash = require('./crypto-hash')

describe ('Block', () => {

    const timestamp = '01/12/2025 1816';
    const lastHash = 'last-hash-value';
    const data = 'block-data-goes-here';
    const hash = 'a-hash-value';
    const nonce = 1;
    const difficulty = 1;

    const block = new Block({ timestamp, lastHash, data, hash, nonce, difficulty });

    it('has properties data, hash', () => {
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.timestamp).toEqual(timestamp);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });


  describe ('genesis()', () => {
    const genesisBlock = Block.genesis();

    it('genesis block is valid', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it('genesis block data is valid', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });

    it('genesis block has properties', () => {
      expect(genesisBlock.hash).toEqual('abcdefgh');
      expect(genesisBlock.lastHash).toEqual('------');
    });

  });

  describe('mineBlock()', () => {

    const lastBlock = Block.genesis();
    const data = 'second block data';
    
    const minedBlock = Block.mineBlock({ data, lastBlock, difficulty: lastBlock.difficulty });
    
    it('returns a Block instance', ()=> {
      expect(minedBlock instanceof Block).toBe(true);
    });
    
    it('sets a `timestamp`', ()=> {
      expect(minedBlock.timestamp).not.toBe(undefined);
    });
    
    it('sets `lashHash` to be `hash` of the lastBlock', ()=> {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });
    
    it('mined block has hash based on appropriate inputs', ()=> {
      expect(minedBlock.hash)
        .toEqual(
          cryptoHash(
            minedBlock.timestamp,
            minedBlock.nonce,
            minedBlock.difficulty,
            data,
            lastBlock.hash
          ));
    });

    it('sets a `hash` that matches the difficulty criteria', () => {
      const actual = minedBlock.hash.substring(0, minedBlock.difficulty);
      const expected = '0'.repeat(minedBlock.difficulty);
      //console.log('difficulty', minedBlock.difficulty, '\nactual', actual, '\nexpected', expected);
      expect(actual).toEqual(expected);
    });
    
  });

});
