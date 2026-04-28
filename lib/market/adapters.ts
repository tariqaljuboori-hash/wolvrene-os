import { ExchangeId, Timeframe } from '@/types/store';

export type MarketTickerDTO = {
  exchange: ExchangeId;
  requestSymbol: string;
  displaySymbol: string;
  base: string;
  last: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  quoteVolume: number;
  funding?: number;
  timestamp: number;
};

export type CandleDTO = { time: number; o: number; h: number; l: number; c: number; v: number };

export type MarketAdapter = {
  getTopSymbols(limit?: number): Promise<MarketTickerDTO[]>;
  getTicker(requestSymbol: string): Promise<MarketTickerDTO | null>;
  getCandles(requestSymbol: string, timeframe: Timeframe, limit?: number): Promise<CandleDTO[]>;
};

function n(v: unknown) { const x = Number(v); return Number.isFinite(x) ? x : 0; }

const TF_MAP: Record<Timeframe, { bybit: string; bitget: string; blofin: string; bitunix: string; coinbase?: number }> = {
  '1m': { bybit: '1', bitget: '1min', blofin: '1m', bitunix: '1m', coinbase: 60 }, '3m': { bybit: '3', bitget: '3min', blofin: '3m', bitunix: '3m' }, '5m': { bybit: '5', bitget: '5min', blofin: '5m', bitunix: '5m', coinbase: 300 }, '15m': { bybit: '15', bitget: '15min', blofin: '15m', bitunix: '15m', coinbase: 900 }, '30m': { bybit: '30', bitget: '30min', blofin: '30m', bitunix: '30m', coinbase: 1800 }, '1h': { bybit: '60', bitget: '1H', blofin: '1H', bitunix: '1h', coinbase: 3600 }, '2h': { bybit: '120', bitget: '2H', blofin: '2H', bitunix: '2h', coinbase: 7200 }, '4h': { bybit: '240', bitget: '4H', blofin: '4H', bitunix: '4h', coinbase: 14400 }, '1d': { bybit: 'D', bitget: '1D', blofin: '1D', bitunix: '1d', coinbase: 86400 }, '1w': { bybit: 'W', bitget: '1W', blofin: '1W', bitunix: '1w' }, '1M': { bybit: 'M', bitget: '1M', blofin: '1M', bitunix: '1M' },
};

const sortTop = (rows: MarketTickerDTO[], limit = 100) => rows.sort((a, b) => b.quoteVolume - a.quoteVolume).slice(0, limit);

const binance: MarketAdapter = {
  async getTopSymbols(limit = 100) {
    const data = await (await fetch('https://api.binance.com/api/v3/ticker/24hr', { cache: 'no-store' })).json();
    return sortTop((Array.isArray(data) ? data : []).filter((x: any) => x.symbol?.endsWith('USDT')).map((x: any) => ({ exchange: 'binance' as const, requestSymbol: x.symbol, displaySymbol: `${x.symbol}.P`, base: x.symbol.replace('USDT', ''), last: n(x.lastPrice), change: n(x.priceChange), changePercent: n(x.priceChangePercent), high24h: n(x.highPrice), low24h: n(x.lowPrice), volume: n(x.volume), quoteVolume: n(x.quoteVolume), timestamp: Date.now() })), limit);
  },
  async getTicker(requestSymbol) { return (await this.getTopSymbols(500)).find((x) => x.requestSymbol === requestSymbol) ?? null; },
  async getCandles(requestSymbol, timeframe, limit = 300) {
    const rows = await (await fetch(`https://api.binance.com/api/v3/klines?symbol=${requestSymbol}&interval=${timeframe}&limit=${limit}`, { cache: 'no-store' })).json();
    return (Array.isArray(rows) ? rows : []).map((k: any[]) => ({ time: n(k[0]), o: n(k[1]), h: n(k[2]), l: n(k[3]), c: n(k[4]), v: n(k[5]) }));
  },
};

const bybit: MarketAdapter = {
  async getTopSymbols(limit = 100) {
    const rows = (await (await fetch('https://api.bybit.com/v5/market/tickers?category=linear', { cache: 'no-store' })).json()).result?.list || [];
    return sortTop(rows.filter((x: any) => x.symbol?.endsWith('USDT')).map((x: any) => ({ exchange: 'bybit' as const, requestSymbol: x.symbol, displaySymbol: `${x.symbol}.P`, base: x.symbol.replace('USDT', ''), last: n(x.lastPrice), change: n(x.lastPrice) - n(x.prevPrice24h), changePercent: n(x.price24hPcnt) * 100, high24h: n(x.highPrice24h), low24h: n(x.lowPrice24h), volume: n(x.volume24h), quoteVolume: n(x.turnover24h), timestamp: Date.now() })), limit);
  },
  async getTicker(requestSymbol) { return (await this.getTopSymbols(500)).find((x) => x.requestSymbol === requestSymbol) ?? null; },
  async getCandles(requestSymbol, timeframe, limit = 300) {
    const rows = (await (await fetch(`https://api.bybit.com/v5/market/kline?category=linear&symbol=${requestSymbol}&interval=${TF_MAP[timeframe].bybit}&limit=${limit}`, { cache: 'no-store' })).json()).result?.list || [];
    return rows.map((k: any[]) => ({ time: n(k[0]), o: n(k[1]), h: n(k[2]), l: n(k[3]), c: n(k[4]), v: n(k[5]) }));
  },
};

const bitget: MarketAdapter = {
  async getTopSymbols(limit = 100) {
    const rows = (await (await fetch('https://api.bitget.com/api/v2/mix/market/tickers?productType=USDT-FUTURES', { cache: 'no-store' })).json()).data || [];
    return sortTop(rows.filter((x: any) => x.symbol?.endsWith('USDT')).map((x: any) => ({ exchange: 'bitget' as const, requestSymbol: x.symbol, displaySymbol: `${x.symbol}.P`, base: x.symbol.replace('USDT', ''), last: n(x.lastPr || x.last), change: n(x.change24h), changePercent: n(x.change24h) * 100, high24h: n(x.high24h), low24h: n(x.low24h), volume: n(x.baseVolume), quoteVolume: n(x.quoteVolume), timestamp: Date.now() })), limit);
  },
  async getTicker(requestSymbol) { return (await this.getTopSymbols(500)).find((x) => x.requestSymbol === requestSymbol) ?? null; },
  async getCandles(requestSymbol, timeframe, limit = 300) {
    const rows = (await (await fetch(`https://api.bitget.com/api/v2/mix/market/candles?symbol=${requestSymbol}&productType=USDT-FUTURES&granularity=${TF_MAP[timeframe].bitget}&limit=${limit}`, { cache: 'no-store' })).json()).data || [];
    return rows.map((k: any[]) => ({ time: n(k[0]), o: n(k[1]), h: n(k[2]), l: n(k[3]), c: n(k[4]), v: n(k[5]) }));
  },
};

const blofin: MarketAdapter = {
  async getTopSymbols(limit = 100) {
    const rows = (await (await fetch('https://openapi.blofin.com/api/v1/market/tickers', { cache: 'no-store' })).json()).data || [];
    return sortTop(rows.filter((x: any) => x.instId?.includes('USDT')).map((x: any) => { const symbol = String(x.instId).replace(/-/g, ''); const last = n(x.last); const open = n(x.open24h || last); return { exchange: 'blofin' as const, requestSymbol: x.instId, displaySymbol: `${symbol}.P`, base: symbol.replace('USDT', ''), last, change: last - open, changePercent: open ? ((last - open) / open) * 100 : 0, high24h: n(x.high24h), low24h: n(x.low24h), volume: n(x.vol24h), quoteVolume: n(x.vol24h), timestamp: Date.now() }; }), limit);
  },
  async getTicker(requestSymbol) { return (await this.getTopSymbols(500)).find((x) => x.requestSymbol === requestSymbol) ?? null; },
  async getCandles(requestSymbol, timeframe, limit = 300) {
    const rows = (await (await fetch(`https://openapi.blofin.com/api/v1/market/candles?instId=${requestSymbol}&bar=${TF_MAP[timeframe].blofin}&limit=${limit}`, { cache: 'no-store' })).json()).data || [];
    return rows.map((k: any[]) => ({ time: n(k[0]), o: n(k[1]), h: n(k[2]), l: n(k[3]), c: n(k[4]), v: n(k[5]) }));
  },
};

const bitunix: MarketAdapter = {
  async getTopSymbols(limit = 100) {
    const rows = (await (await fetch('https://fapi.bitunix.com/api/v1/futures/market/tickers', { cache: 'no-store' })).json()).data || [];
    return sortTop(rows.filter((x: any) => x.symbol?.endsWith('USDT')).map((x: any) => ({ exchange: 'bitunix' as const, requestSymbol: x.symbol, displaySymbol: `${x.symbol}.P`, base: x.symbol.replace('USDT', ''), last: n(x.lastPrice || x.last), change: n(x.priceChange), changePercent: n(x.priceChangePercent), high24h: n(x.highPrice), low24h: n(x.lowPrice), volume: n(x.volume), quoteVolume: n(x.quoteVolume), timestamp: Date.now() })), limit);
  },
  async getTicker(requestSymbol) { return (await this.getTopSymbols(500)).find((x) => x.requestSymbol === requestSymbol) ?? null; },
  async getCandles(requestSymbol, timeframe, limit = 300) {
    const rows = (await (await fetch(`https://fapi.bitunix.com/api/v1/futures/market/kline?symbol=${requestSymbol}&interval=${TF_MAP[timeframe].bitunix}&limit=${limit}`, { cache: 'no-store' })).json()).data || [];
    return rows.map((k: any) => ({ time: n(k.time || k[0]), o: n(k.open || k[1]), h: n(k.high || k[2]), l: n(k.low || k[3]), c: n(k.close || k[4]), v: n(k.volume || k[5]) }));
  },
};

const coinbase: MarketAdapter = {
  async getTopSymbols(limit = 100) {
    const products = await (await fetch('https://api.exchange.coinbase.com/products', { cache: 'no-store' })).json();
    const rows = await Promise.all((Array.isArray(products) ? products : []).filter((p: any) => p.quote_currency === 'USD' && p.status === 'online').slice(0, limit).map(async (p: any) => {
      const ticker = await (await fetch(`https://api.exchange.coinbase.com/products/${p.id}/ticker`, { cache: 'no-store' })).json();
      const stats = await (await fetch(`https://api.exchange.coinbase.com/products/${p.id}/stats`, { cache: 'no-store' })).json();
      const last = n(ticker.price); const open = n(stats.open || last);
      return { exchange: 'coinbase' as const, requestSymbol: p.id, displaySymbol: `${p.base_currency}USD.P`, base: p.base_currency, last, change: last - open, changePercent: open ? ((last - open) / open) * 100 : 0, high24h: n(stats.high), low24h: n(stats.low), volume: n(stats.volume), quoteVolume: n(stats.volume) * last, timestamp: Date.now() };
    }));
    return sortTop(rows.filter(Boolean) as MarketTickerDTO[], limit);
  },
  async getTicker(requestSymbol) { return (await this.getTopSymbols(300)).find((x) => x.requestSymbol === requestSymbol) ?? null; },
  async getCandles(requestSymbol, timeframe, limit = 300) {
    const granularity = TF_MAP[timeframe].coinbase || 3600;
    const rows = await (await fetch(`https://api.exchange.coinbase.com/products/${requestSymbol}/candles?granularity=${granularity}`, { cache: 'no-store' })).json();
    return (Array.isArray(rows) ? rows : []).slice(0, limit).map((k: any[]) => ({ time: n(k[0]) * 1000, l: n(k[1]), h: n(k[2]), o: n(k[3]), c: n(k[4]), v: n(k[5]) }));
  },
};

const yahoo: MarketAdapter = {
  async getTopSymbols() { return []; },
  async getTicker(requestSymbol) {
    const m = (await (await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${requestSymbol}`, { cache: 'no-store' })).json())?.chart?.result?.[0]?.meta;
    if (!m) return null;
    const prev = n(m.previousClose || m.chartPreviousClose); const last = n(m.regularMarketPrice); const change = last - prev;
    return { exchange: 'yahoo', requestSymbol, displaySymbol: requestSymbol, base: requestSymbol, last, change, changePercent: prev ? (change / prev) * 100 : 0, high24h: n(m.regularMarketDayHigh), low24h: n(m.regularMarketDayLow), volume: n(m.regularMarketVolume), quoteVolume: n(m.regularMarketVolume) * last, timestamp: Date.now() };
  },
  async getCandles(requestSymbol, timeframe) {
    const interval = timeframe === '1d' ? '1d' : timeframe === '1w' ? '1wk' : '1h';
    const range = timeframe === '1d' || timeframe === '1w' ? '6mo' : '7d';
    const result = (await (await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${requestSymbol}?interval=${interval}&range=${range}`, { cache: 'no-store' })).json())?.chart?.result?.[0];
    if (!result) return [];
    const ts: number[] = result.timestamp || []; const q = result.indicators?.quote?.[0] || {};
    return ts.map((t, i) => ({ time: t * 1000, o: n(q.open?.[i]), h: n(q.high?.[i]), l: n(q.low?.[i]), c: n(q.close?.[i]), v: n(q.volume?.[i]) }));
  },
};

export const ADAPTERS: Record<ExchangeId, MarketAdapter> = { binance, bybit, bitget, blofin, bitunix, coinbase, yahoo };
