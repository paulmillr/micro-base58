const assert = require('assert');
const base58 = require('.');
const vectors2 = require('./vectors.json');

function toUI8A(hex) {
  if (hex.length % 2 !== 0) throw new RangeError("hex length is invalid");
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    array[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return array;
}

const vectors1 = [
  {decoded: 'hello world', encoded: 'StV1DL6CwTryKyV'},
  {decoded: Buffer.from('hello world'), encoded: 'StV1DL6CwTryKyV'},
  {decoded: new TextEncoder().encode('hello world'), encoded: 'StV1DL6CwTryKyV'},
  {decoded: 'hello world', encoded: 'StVrDLaUATiyKyV', isXRP: true},
  {decoded: '\0\0hello world', encoded: '11StV1DL6CwTryKyV'},
  {decoded: '', encoded: ''},
  // {decoded: Buffer.from([0x51, 0x6b, 0x6f, 0xcd, 0x0f]), encoded: 'ABnLTmg'},
  // {decoded: new Uint8Array([0x51, 0x6b, 0x6f, 0xcd, 0x0f]), encoded: 'ABnLTmg'},
  {decoded: "Hello World!", encoded: "2NEpo7TZRRrLZSi2U"},
  {decoded: "The quick brown fox jumps over the lazy dog.", encoded: "USm3fpXnKG5EUBx2ndxBDMPVciP5hGey2Jh4NDv6gmeo1LkMeiKrLJUUBk6Z"},
  {decoded: new Uint8Array([0x00, 0x00, 0x28, 0x7f, 0xb4, 0xcd]), encoded: "11233QC4"}
];

for (const vector of vectors1) {
  // console.log(vector);
  const alphabet = vector.isXRP && base58.XRP;
  const vectorDecodedArr = typeof vector.decoded === 'string' ?
    new TextEncoder().encode(vector.decoded) :
    Uint8Array.from(vector.decoded);
  const vectorDecodedStr = new TextDecoder().decode(vectorDecodedArr);

  const encoded = base58(vector.decoded, alphabet);
  // const decoded = base58.decode(encoded, alphabet);
  // const decodedArr = new TextEncoder().encode(decoded);

  assert.equal(encoded, vector.encoded);
  // assert.deepEqual(decodedArr, vectorDecodedArr);
}

for (const {decodedHex, encoded} of vectors2) {
  const txt = toUI8A(decodedHex);
  assert.equal(base58(txt), encoded);
}

console.log('All tests passed');
