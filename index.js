// MIT License (c) 2020, Paul Miller (https://paulmillr.com).
'use strict';
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

const alphabet = {};
alphabet.ipfs = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
alphabet.flickr = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
alphabet.btc = alphabet.ipfs;
alphabet.xrp = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
// and xmr

function encode(source, type = 'ipfs') {
  if (source.length === 0) return '';
  const isString = typeof source === 'string';
  const input = isString ? new TextEncoder().encode(source) : source;

  type = type.toLowerCase();
  if (type === 'xmr') return xmre(source);
  if (!alphabet.hasOwnProperty(type)) throw new Error('invalid type');
  const letters = alphabet[type];

  // Convert Uint8Array to BigInt, Big Endian.
  let x = BigInt('0x' + arrayToHex(input));
  let output = [];
  while (x > 0) {
    const mod = Number(x % 58n);
    x = x / 58n;
    output.push(letters[mod]);
  }

  for (let i = 0; input[i] === 0; i++) {
    output.push(letters[0]);
  }

  return output.reverse().join('');
}

function xmre(array) {
  let res = '';
  for (let i = 0; i < 72; i += 8) {
    res += encode(arrayToHex(array.slice(i, i + 8))).padStart(2 * i < 128 ? 11 : 7, '1');
  }
  return res;
}

// Doesn't work for all cases, see test.js. Need some debugging.
// function decode(output, alphabet = base58.BTC) {
//   if (output.length === 0) return '';
//   const alength = BigInt(alphabet.length);
//   const map = {};
//   for (let index = 0n; index < alphabet.length; index++) {
//     let char = alphabet[Number(index)];
//     map[char] = index;
//   }

//   let sum = 0n;
//   let isStartZero = true;
//   let zeroes = [];
//   for (let i = 0; i < output.length; i++) {
//     const char = output[Number(i)];
//     // if (isStartZero && char === alphabet[0]) {
//     //   console.log('start zero');
//     //   zeroes.push('\u{0}');
//     // }
//       if (isStartZero) {
//         isStartZero = false;
//       }
//       const mod = map[char];
//       sum *= alength;
//       console.log(sum, mod, char);

//       sum += mod;
//   }

//   let input = [];
//   while (sum > 0) {
//     input.push(Number(sum % 256n));
//     sum /= 256n;
//   }

//   let result = input.reverse();
//   let str = new TextDecoder().decode(Uint8Array.from(result));
//   return str;
// }
// const base58 = {encode, decode};

if (typeof window !== 'undefined') {
  window.base58 = encode;
} else {
  exports.encode = encode;
  exports.default = encode;
}
