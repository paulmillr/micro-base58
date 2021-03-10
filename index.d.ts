interface Alphabets {
    ipfs: string;
    btc: string;
    flickr: string;
    xmr: string;
    xrp: string;
}
export declare function encode(source: string | Uint8Array, type?: keyof Alphabets): string;
export declare function decode(output: string, type?: keyof Alphabets): Uint8Array;
export default encode;
