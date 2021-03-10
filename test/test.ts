const assert = require('assert');
const base58 = require('..').encode;
const decode = require('..').decode;
const vectors2 = require('./vectors.json');

function arrayToHex(uint8a) {
  // pre-caching chars could speed this up 6x.
  let hex = '';
  for (let i = 0; i < uint8a.length; i++) {
    hex += uint8a[i].toString(16).padStart(2, '0');
  }
  return hex;
}

function hexToArray(hex) {
  hex = hex.length & 1 ? `0${hex}` : hex;
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
    let j = i * 2;
    array[i] = Number.parseInt(hex.slice(j, j + 2), 16);
  }
  return array;
}

const vectors1 = [
  {decoded: 'hello world', encoded: 'StV1DL6CwTryKyV'},
  //{decoded: Buffer.from('hello world'), encoded: 'StV1DL6CwTryKyV'},
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
  console.log(vector);
  const alphabet = vector.isXRP && 'xrp';

  let dec = vector.decoded;
  const vectorDecodedArr = typeof dec === 'string' ?
    new TextEncoder().encode(dec) :
    Uint8Array.from(dec);
  const vectorDecodedStr = new TextDecoder().decode(vectorDecodedArr);

  let encoded = base58(vector.decoded, alphabet);
  if (encoded instanceof Uint8Array) encoded = arrayToHex(dec);
  assert.equal(encoded, vector.encoded);

  const decoded = decode(encoded, alphabet);
  assert.deepEqual(decoded, vectorDecodedArr);
}

for (const {decodedHex, encoded} of vectors2) {
  const txt = hexToArray(decodedHex);
  assert.equal(base58(txt), encoded);
}

console.log('All tests passed');
