const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {

  constructor() {
    this.chain = []
    this.chain.push(Block.genesis());
  }

  addBlock ({ data }) {
    const lastBlock = this.chain[this.chain.length-1];
    const difficulty = lastBlock.difficulty;
    const minedBlock = Block.mineBlock({ data, lastBlock, difficulty });
    this.chain.push(minedBlock);
  }

  replaceChain(newchain) {
  
    if (this.chain.length > newchain.length) return ;

    if (! Blockchain.isValidChain(newchain)) return;

    this.chain = newchain;

  }

  static isValidChain(chain) {
    if (chain.length == 0) return false;

    genesis = Block.genesis();

    if (JSON.stringify(chain[0]) !== JSON.stringify(genesis)) return false;

    let curr = 1;
    while (curr < chain.length) {
      
      const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[curr];

      const actualLastHash = chain[curr-1].hash;

      if (actualLastHash != lastHash) return false;

      const expectedHash = cryptoHash(timestamp, data, actualLastHash, nonce, difficulty);

      if (hash != expectedHash) return false;

      curr ++;
    }

    return true;
  }

}

module.exports = Blockchain;

