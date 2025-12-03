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
    
    let curr = 1;
    while (curr < chain.length) {
      
      const currBlock = chain[curr];
      const lastBlock = chain[curr-1];
      
      if (lastBlock.hash != currBlock.lastHash) return false;

      const expectedHash = cryptoHash(currBlock.timestamp, currBlock.data, lastBlock.hash);

      if (currBlock.hash != expectedHash) return false;

      curr ++;
    }

    return true;
  }

}

module.exports = Blockchain;

