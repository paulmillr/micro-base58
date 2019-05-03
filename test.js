const assert = require('assert');
const base58 = require('.');

assert(base58('hello world') === 'StV1DL6CwTryKyV');
assert(base58(Buffer.from('hello world')) === 'StV1DL6CwTryKyV');

assert(base58('\0\0hello world') === '11StV1DL6CwTryKyV');
assert(base58('') === '')
assert(base58(Buffer.from([0x51, 0x6b, 0x6f, 0xcd, 0x0f])) === 'ABnLTmg');
assert(base58(new Uint8Array([0x51, 0x6b, 0x6f, 0xcd, 0x0f])) === 'ABnLTmg');

assert(base58('hello world', base58.BTC) === 'StV1DL6CwTryKyV');
assert(base58('hello world', base58.XRP) === 'StVrDLaUATiyKyV');

console.log('All tests passed');
