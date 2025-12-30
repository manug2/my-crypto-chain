const express = require('express');
const Blockchain = require('./src/blockchain');

const app = express();
const blockchain = new Blockchain();

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening at port localhost:${PORT}`);
});
