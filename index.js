// MIT License (c) 2019, Paul Miller (https://paulmillr.com).
'use strict';
function ui8aToHex(ui8a) {
  return Array.from(ui8a)
    .map(c => c.toString(16).padStart(2, '0'))
    .join('');
}

function encode(source, alphabet = base58.BTC) {
  if (source.length === 0) return '';
  const alength = BigInt(alphabet.length);

  let output = [];
  const input = typeof source === 'string' ? new TextEncoder().encode(source) : source;

  // Convert Uint8Array to BigInt, Big Endian.
  let x = BigInt('0x' + ui8aToHex(input));
  while (x > 0) {
    const mod = Number(x % alength);
    // Math.floor() is same as `| 0`, be we can't use it on bigints.
    x = x / alength;
    output.push(alphabet[mod]);
  }

  for (let i = 0; input[i] === 0; i++) {
    output.push(alphabet[0]);
  }

  const str = output.reverse().join('');
  return str;
};

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

const base58 = encode;
base58.BTC = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
base58.XRP = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
base58.FLC = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'; // flickr

if (typeof module !== 'undefined') {
  module.exports = base58;
  base58.default = base58;
}
