const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {

  constructor() {
    this.chain = []
    this.chain.push(Block.genesis());
  }

  addBlock ({ data }) {
    lastBlock = this.chain[this.chain.length-1];
    minedBlock = Block.mineBlock({ data, lastBlock });
    this.chain.push(minedBlock);
  }

  static isValidChain(chain) {
    if (chain.length == 0) return false;

    genesis = Block.genesis();

    if (chain[0].timestamp != genesis.timestamp) return false;
    if (chain[0].hash != genesis.hash) return false;
    if (chain[0].lastHash != genesis.lastHash) return false;
    if (chain[0].data != genesis.data) return false;
    
    if (JSON.stringify(chain[0]) !== JSON.stringify(genesis)) return false;

    let curr = 1;
    while (curr < chain.length) {
      
      const { timestamp, lastHash, hash, data } = chain[curr];

      const actualLastHash = chain[curr-1].hash;

      if (actualLastHash != lastHash) return false;

      const expectedHash = cryptoHash(timestamp, data, actualLastHash);

      if (hash != expectedHash) return false;

      curr ++;
    }

    return true;
  }

}

module.exports = Blockchain;

