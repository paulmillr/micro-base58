const base58 = require('.')

let start = Date.now();
let res = base58('ZXas[odfjosadjfopsdjpofsadjopfjawegiaowerntipaerjtiaejrweajr0jweerjqwkeqwkeqwkekqwokeoqpwkeopqwkeopCKPOOJADOS)$Q#(Urwjqeewpfjpaefpds,123sdasdkoaskdoaskdoaskdo9812839123291');
let end = Date.now();
console.log(res, end - start);
