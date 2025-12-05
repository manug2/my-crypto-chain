const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('./config')
const cryptoHash = require('./crypto-hash')

describe ('Block', () => {

    const timestamp = 2000;
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
      expect(actual).toEqual(expected);
    });

    it('adjusts the difficulty', () => {
      const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);

    });
    
  });

  describe('adjustDifficulty', () => {

    it('raises the difficulty for a quickly mined block', ()=> {
      expect(Block.adjustDifficulty({
        originalBlock: block,
        timestamp: block.timestamp + MINE_RATE - 100
      })).toEqual(block.difficulty + 1);
    });

    it('lowers the difficulty for a slowly mined block', ()=> {
      expect(Block.adjustDifficulty({
        originalBlock: block,
        timestamp: block.timestamp + MINE_RATE + 100
      })).toEqual(block.difficulty - 1);
    });

    it('has a lower limit of 1', () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });

  });
});
