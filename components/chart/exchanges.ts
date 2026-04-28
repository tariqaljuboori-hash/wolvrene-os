export type ExchangeId =
  | 'binance'
  | 'bybit'
  | 'bitget'
  | 'bitunix'
  | 'blofin'
  | 'coinbase';

export const EXCHANGES = {
  binance: {
    label: 'Binance',
    candles: (symbol: string, interval: string) =>
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=300`,
  },

  bybit: {
    label: 'Bybit',
    candles: (symbol: string, interval: string) =>
      `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=${interval}&limit=300`,
  },

  bitget: {
    label: 'Bitget',
    candles: (symbol: string, interval: string) =>
      `https://api.bitget.com/api/v2/mix/market/candles?symbol=${symbol}&granularity=${interval}&limit=300`,
  },

  coinbase: {
    label: 'Coinbase',
    candles: (symbol: string, interval: string) =>
      `https://api.exchange.coinbase.com/products/${symbol}/candles`,
  },
};