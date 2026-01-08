const cryptoHash = require('./crypto-hash');

describe('crypto-hash', () => {

  const data = 'foo';
  const expectedHash = '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae';

  it('sha-256 hash calculated is accurate', () => {
    expect(cryptoHash(data)).toEqual(expectedHash);
  });

  it('hash of multiple words works despite order of words', () => {
    expect(cryptoHash('this', 'is', 'good')).toEqual(cryptoHash('is', 'this', 'good'));
  });

});
