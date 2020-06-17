type B58TYPE = 'ipfs' | 'flickr' | 'btc' | 'xrp' | 'xmr';
export function encode(source: string|Uint8Array, type?: B58TYPE): string;
export function decode(output: string, type?: B58TYPE): string;
export default encode;
