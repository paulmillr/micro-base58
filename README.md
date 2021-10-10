# micro-base58

Fast and beautiful base58 encoder without dependencies.

**Deprecated. Switch to [micro-base-x](https://github.com/paulmillr/micro-base-x).**

> `npm install micro-base58`

Usage: `base58(text[, alphabet])`.

Included alphabets: `ipfs`/`btc` (default), `xrp`, `xmr`, `flickr`

First argument could be `string`, `Buffer` or `UInt8Array`.

```js
const base58 = require('micro-base58');

base58('hello world'); // => 'StV1DL6CwTryKyV'
new Uint8Array(Array.from('hello world').map(c => c.charCodeAt(0))) // Browser
// => 'StV1DL6CwTryKyV'
base58('hello world', 'xrp'); // => 'StVrDLaUATiyKyV'
```

We don't include base58check because it requires sha256. You can implement it like this:

```js
function base58check(array) {
  const checksum = sha256(sha256(array)).slice(0, 4);
  const data = new Uint8Array(array.length + 4);
  data.set(array);
  data.set(checksum, array.length)
  return base58(data);
}
```

## License

MIT License (c) 2020, Paul Miller (https://paulmillr.com).

See LICENSE file.
