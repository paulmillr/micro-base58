// MIT License (c) 2019, Paul Miller (https://paulmillr.com).
'use strict';
const base58 = (source, alphabet = base58.BTC) => {
  const len = source.length;
  if (len === 0) return '';

  const base = alphabet.length;
  const str = typeof source === 'string';
  const chars = [0];

  for (let i = 0; i < len; ++i) {
    let carry = str ? source.charCodeAt(i) : source[i];
    for (let j = 0; j < chars.length; ++j) {
      carry += chars[j] << 8;
      chars[j] = carry % base;
      carry = (carry / base) | 0;
    }

    while (carry > 0) {
      chars.push(carry % base);
      carry = (carry / base) | 0;
    }
  }

  let string = '';
  // Leading zeros.
  const lead = alphabet[0];
  for (let k = 0; (str ? source.charCodeAt(k) : source[k]) === 0 && k < len - 1; ++k) string += lead;
  // Convert digits to string.
  for (let q = chars.length - 1; q >= 0; --q) string += alphabet[chars[q]]

  return string
};
base58.BTC = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
base58.XRP = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';

if (typeof module !== 'undefined') module.exports = base58;
