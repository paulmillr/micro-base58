// MIT License (c) 2020, Paul Miller (https://paulmillr.com).
'use strict';
function bytesToHex(uint8a) {
  // pre-caching chars could speed this up 6x.
  let hex = '';
  for (let i = 0; i < uint8a.length; i++) {
    hex += uint8a[i].toString(16).padStart(2, '0');
  }
  return hex;
}

const alphabet = {};
alphabet.ipfs = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
alphabet.flickr = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
alphabet.btc = alphabet.ipfs;
alphabet.xrp = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
// and xmr

function encode(source, type = 'ipfs') {
  if (source.length === 0) return '';
  if (typeof source === 'string') source = new TextEncoder().encode(source);
  type = type.toLowerCase();

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

function decode(output, type = 'ipfs') {
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

if (typeof exports !== 'undefined') {
  exports.encode = encode;
  exports.decode = decode;
  exports.__esModule = true;
  exports.default = encode;
} else {
  window.base58 = encode;
  window.base58.decode = decode;
}
