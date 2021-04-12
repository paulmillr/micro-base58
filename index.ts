/*! micro-base58 - MIT License (c) 2021, Paul Miller (https://paulmillr.com) */

'use strict';
function bytesToHex(uint8a: Uint8Array) {
  // pre-caching chars could speed this up 6x.
  let hex = '';
  for (let i = 0; i < uint8a.length; i++) {
    hex += uint8a[i].toString(16).padStart(2, '0');
  }
  return hex;
}

interface Alphabets {
  ipfs: string;
  btc: string;
  flickr: string;
  xmr: string;
  xrp: string;
}

const COMMON_B58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const alphabet: Alphabets = {
  ipfs: COMMON_B58_ALPHABET,
  btc: COMMON_B58_ALPHABET,
  xmr: COMMON_B58_ALPHABET,
  flickr: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
  xrp: 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz'
};

export function encode(source: string | Uint8Array, type: keyof Alphabets = 'ipfs') {
  if (source.length === 0) return '';
  if (typeof source === 'string') {
    if (typeof TextEncoder !== 'undefined') {
      source = new TextEncoder().encode(source);
    } else {
      // note: only supports ASCII
      source = new Uint8Array(source.split('').map(c => c.charCodeAt(0)));
    }
  }
  type = type.toLowerCase() as keyof Alphabets;

  if (type === 'xmr') {
    // xmr ver is done in 8-byte blocks.
    // This gives us eight full-sized blocks and one 5-byte block.
    // Eight bytes converts to 11 or less Base58 characters;
    // if a particular block converts to <11 characters,
    // the conversion pads it with "1"s (1 is 0 in Base58).
    // Likewise, the final 5-byte block can convert to 7 or less Base58 digits;
    // the conversion will ensure the result is 7 digits. Due to the conditional padding,
    // the 69-byte string will always convert to 95 Base58 characters (8 * 11 + 7).
    let res = '';
    for (let i = 0; i < source.length + 3; i += 8) {
      const slice = source.slice(i, i + 8);
      res += encode(slice).padStart(slice.length === 8 ? 11 : 7, '1');
    }
    return res;
  }
  if (!alphabet.hasOwnProperty(type)) throw new Error('invalid type');
  const letters = alphabet[type];

  // Convert Uint8Array to BigInt, Big Endian.
  let x = BigInt('0x' + bytesToHex(source));
  let output = [];

  while (x > 0) {
    const mod = Number(x % 58n);
    x = x / 58n;
    output.push(letters[mod]);
  }

  for (let i = 0; source[i] === 0; i++) {
    output.push(letters[0]);
  }

  return output.reverse().join('');
}

export function decode(output: string, type: keyof Alphabets = 'ipfs') {
  if (output.length === 0) return new Uint8Array([]);
  const letters = alphabet[type];
  const bytes = [0];
  for (let i = 0; i < output.length; i++) {
    const char = output[i];
    const value = letters.indexOf(char);
    if (value === undefined) {
      throw new Error(
        `base58.decode received invalid input. Character '${char}' is not in the base58 alphabet.`
      );
    }
    for (let j = 0; j < bytes.length; j++) {
      bytes[j] *= 58;
    }
    bytes[0] += value;
    let carry = 0;
    for (let j = 0; j < bytes.length; j++) {
      bytes[j] += carry;
      carry = bytes[j] >> 8;
      bytes[j] &= 0xff;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (let i = 0; i < output.length && output[i] === '1'; i++) {
    bytes.push(0);
  }
  return new Uint8Array(bytes.reverse());
}

export default encode;
