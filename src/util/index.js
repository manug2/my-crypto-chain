const EC = require('elliptic').ec;
const crypto = require('crypto');

const cryptoHash = (...inputs) => {

  const hash = crypto.createHash('sha256');

  hash.update(inputs.sort().join(' '));

  return hash.digest('hex');

};

//Standards for Efficient Cryptography, Using Prime number of 256 bits, Koblets
const ec = new EC('secp256k1');

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');
    return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = { ec, verifySignature, cryptoHash };
