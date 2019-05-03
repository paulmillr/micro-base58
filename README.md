# base58-encode.js

Fast and beautiful base58 encoder. No dependencies, 40LOC.

> `npm install base58-encode`

Usage: `base58(text[, alphabet])`. Included alphabets: `base58.BTC` (default), `base58.XRP`

First argument could be `string`, `Buffer` or `UInt8Array`.

```javascript
const base58 = require('base58-encode');

base58('hello world'); // => 'StV1DL6CwTryKyV'
base58(Buffer.from('hello world')) // node
new Uint8Array(Array.from('hello world').map(c => c.charCodeAt(0))) // Browser
// => 'StV1DL6CwTryKyV'
base58('hello world', base58.XRP); // => 'StVrDLaUATiyKyV'
```

## License

MIT License (c) 2019, Paul Miller (https://paulmillr.com).

See LICENSE file.
