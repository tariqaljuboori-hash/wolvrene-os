import { ExchangeId, MarketCategory } from '@/types/store';

export type SymbolRecord = {
  category: MarketCategory;
  display: string;
  base: string;
  name: string;
  requests: Partial<Record<ExchangeId, string>>;
};

const CORE: SymbolRecord[] = [
  { category: 'crypto', display: 'BTCUSDT.P', base: 'BTC', name: 'Bitcoin', requests: { binance: 'BTCUSDT', bybit: 'BTCUSDT', bitget: 'BTCUSDT', blofin: 'BTC-USDT', bitunix: 'BTCUSDT', coinbase: 'BTC-USD' } },
  { category: 'crypto', display: 'ETHUSDT.P', base: 'ETH', name: 'Ethereum', requests: { binance: 'ETHUSDT', bybit: 'ETHUSDT', bitget: 'ETHUSDT', blofin: 'ETH-USDT', bitunix: 'ETHUSDT', coinbase: 'ETH-USD' } },
  { category: 'crypto', display: 'SOLUSDT.P', base: 'SOL', name: 'Solana', requests: { binance: 'SOLUSDT', bybit: 'SOLUSDT', bitget: 'SOLUSDT', blofin: 'SOL-USDT', bitunix: 'SOLUSDT', coinbase: 'SOL-USD' } },
  { category: 'forex', display: 'EURUSD', base: 'EUR', name: 'Euro / US Dollar', requests: { yahoo: 'EURUSD=X' } },
  { category: 'forex', display: 'GBPUSD', base: 'GBP', name: 'British Pound / US Dollar', requests: { yahoo: 'GBPUSD=X' } },
  { category: 'indices', display: 'NAS100', base: 'NDX', name: 'Nasdaq 100', requests: { yahoo: '^NDX' } },
  { category: 'indices', display: 'US30', base: 'DJI', name: 'Dow Jones', requests: { yahoo: '^DJI' } },
  { category: 'commodities', display: 'GOLD', base: 'XAU', name: 'Gold Futures', requests: { yahoo: 'GC=F' } },
  { category: 'commodities', display: 'SILVER', base: 'XAG', name: 'Silver Futures', requests: { yahoo: 'SI=F' } },
];

export function getCoreMarkets() {
  return CORE;
}

export function resolveRequestSymbol(display: string, exchange: ExchangeId): string {
  const found = CORE.find((x) => x.display === display);
  if (!found) return display.replace('.P', '');
  return found.requests[exchange] ?? found.requests.binance ?? display.replace('.P', '');
}

export function resolveDisplaySymbol(request: string, exchange: ExchangeId): string {
  const found = CORE.find((x) => x.requests[exchange] === request);
  return found?.display ?? request;
}
