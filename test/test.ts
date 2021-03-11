import { encode as base58, decode } from '..';
import vectors2 = require('./vectors.json');

function hexToArray(hex: string) {
  if (hex.length == 0) {
    return new Uint8Array();
  }
  return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

function asciiToArray(str: string) {
  return new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
}

const vectors1 = [
  {decoded: 'hello world', encoded: 'StV1DL6CwTryKyV'},
  {decoded: Buffer.from('hello world'), encoded: 'StV1DL6CwTryKyV'},
  {decoded: asciiToArray('hello world'), encoded: 'StV1DL6CwTryKyV'},
  {decoded: 'hello world', encoded: 'StVrDLaUATiyKyV', isXRP: true},
  {decoded: '\0\0hello world', encoded: '11StV1DL6CwTryKyV'},
  {decoded: '', encoded: ''},
  {decoded: Buffer.from([0x51, 0x6b, 0x6f, 0xcd, 0x0f]), encoded: 'ABnLTmg'},
  {decoded: new Uint8Array([0x51, 0x6b, 0x6f, 0xcd, 0x0f]), encoded: 'ABnLTmg'},
  {decoded: "Hello World!", encoded: "2NEpo7TZRRrLZSi2U"},
  {decoded: "The quick brown fox jumps over the lazy dog.", encoded: "USm3fpXnKG5EUBx2ndxBDMPVciP5hGey2Jh4NDv6gmeo1LkMeiKrLJUUBk6Z"},
  {decoded: new Uint8Array([0x00, 0x00, 0x28, 0x7f, 0xb4, 0xcd]), encoded: "11233QC4"}
];

test('vectors1', () => {
  for (const vector of vectors1) {
    const alphabet = vector.isXRP && 'xrp';

    let dec = vector.decoded;
    let vectorDecodedArr = typeof dec === 'string' ? asciiToArray(dec) : dec;

    let encoded = base58(vector.decoded, alphabet || undefined);
    expect(encoded).toBe(vector.encoded);

    const decoded = decode(encoded, alphabet || undefined);
    expect(decoded.buffer).toEqual(vectorDecodedArr.buffer);
  }
});

test('vectors2', () => {
  for (const {decodedHex, encoded} of vectors2) {
    const txt = hexToArray(decodedHex);
    expect(base58(txt)).toBe(encoded);
  }
});
