const { GENESIS_DATA, MINE_RATE } = require('./config');
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

  static mineBlock({ data, lastBlock }) {

    lastHash = lastBlock.hash;
    let nonce = 0;
    let expectedDifficultyPrefix;

    do {
      timestamp = Date.now();
      nonce++;

      difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
      expectedDifficultyPrefix = '0'.repeat(difficulty);

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

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    if (difficulty < 1) return 1;

    const difference = timestamp - originalBlock.timestamp;

    if (difference > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }

}

module.exports = Block;
