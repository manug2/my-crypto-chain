const MINE_RATE = 1000; // per second
const INITIAL_DIFFICULTY = 2;

GENESIS_DATA = {
  timestamp: 1000,
  data: 'genesis-data',
  hash: 'abcdefgh',
  lastHash: '------',
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY
};


module.exports = { GENESIS_DATA, MINE_RATE }

