declare const base58: {
  (source: string|Uint8Array, alphabet?: string): string;
  BTC: string;
  XRP: string;
};
export default base58;
