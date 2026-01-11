const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const Block = require('./src/blockchain/block');
const Blockchain = require('./src/blockchain');
const PubSub = require('./src/app/pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

app.use(bodyParser.json());


app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  // Example curl command:
  // curl localhost:3000/api/mine --data '{ "data": "foo-bar2" }' -X POST -H "Content-Type: application/json"

  const { data } = req.body;

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});

const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (! error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on a sync with root: \n', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
};


let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`listening at port localhost:${PORT}`);
  if (PORT !== DEFAULT_PORT) {
    syncChains();
  }
});

