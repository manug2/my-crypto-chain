const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {

  constructor({ timestamp, lastHash, data, hash }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  }

  static mineBlock({ data, lastBlock }) {

    lastHash = lastBlock.hash;
    timestamp = Date.now();
    hash = cryptoHash(timestamp, data, lastHash);

    return new Block({
      timestamp,
      lastHash,
      data,
      hash
    });
  }

}

module.exports = Block;
