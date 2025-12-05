const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {

  constructor({ timestamp, lastHash, data, hash, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  }

  static mineBlock({ data, lastBlock, difficulty }) {

    //const { difficulty } = lastBlock;
    lastHash = lastBlock.hash;

    const expectedDifficultyPrefix = '0'.repeat(difficulty);
    let nonce = 0;

    do {
      timestamp = Date.now();
      nonce++;
      hash = cryptoHash(timestamp, data, lastHash, nonce, difficulty);
      substr = hash.substring(0, difficulty);
    } while (substr != expectedDifficultyPrefix);

    return new Block({
      timestamp,
      lastHash,
      data,
      hash,
      nonce,
      difficulty
    });
  }

}

module.exports = Block;
