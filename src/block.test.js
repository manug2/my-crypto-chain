const Block = require('./block');
const { GENESIS_DATA } = require('./config')

describe ('Block', () => {

    const timestamp = '01/12/2025 1816';
    const lastHash = 'last-hash-value';
    const data = 'block-data-goes-here';
    const hash = 'a-hash-value';

    const block = new Block({ timestamp, lastHash, data, hash });

    it('has properties data, hash', () => {
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.timestamp).toEqual(timestamp);
    });

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
