import { ExchangeId } from '@/types/store';

export type MarketCategory = 'crypto' | 'forex' | 'indices' | 'commodities';

export type MarketAsset = {
  category: MarketCategory;
  display: string;
  symbol: string;
  yahooSymbol?: string;
  base: string;
  name: string;
  exchange: ExchangeId;
};

export const NON_CRYPTO_MARKETS: MarketAsset[] = [
  { category: 'forex', display: 'EURUSD', symbol: 'EURUSD=X', yahooSymbol: 'EURUSD=X', base: 'EUR', name: 'Euro / US Dollar', exchange: 'yahoo' },
  { category: 'forex', display: 'GBPUSD', symbol: 'GBPUSD=X', yahooSymbol: 'GBPUSD=X', base: 'GBP', name: 'British Pound / US Dollar', exchange: 'yahoo' },
  { category: 'forex', display: 'USDJPY', symbol: 'JPY=X', yahooSymbol: 'JPY=X', base: 'JPY', name: 'US Dollar / Japanese Yen', exchange: 'yahoo' },
  { category: 'forex', display: 'USDCAD', symbol: 'CAD=X', yahooSymbol: 'CAD=X', base: 'CAD', name: 'US Dollar / Canadian Dollar', exchange: 'yahoo' },

  { category: 'indices', display: 'SPX500', symbol: '^GSPC', yahooSymbol: '^GSPC', base: 'SPX', name: 'S&P 500', exchange: 'yahoo' },
  { category: 'indices', display: 'NAS100', symbol: '^NDX', yahooSymbol: '^NDX', base: 'NDX', name: 'Nasdaq 100', exchange: 'yahoo' },
  { category: 'indices', display: 'US30', symbol: '^DJI', yahooSymbol: '^DJI', base: 'DJI', name: 'Dow Jones', exchange: 'yahoo' },
  { category: 'indices', display: 'GER40', symbol: '^GDAXI', yahooSymbol: '^GDAXI', base: 'DAX', name: 'DAX Germany', exchange: 'yahoo' },
  { category: 'indices', display: 'UK100', symbol: '^FTSE', yahooSymbol: '^FTSE', base: 'FTSE', name: 'FTSE 100', exchange: 'yahoo' },

  { category: 'commodities', display: 'GOLD', symbol: 'GC=F', yahooSymbol: 'GC=F', base: 'GOLD', name: 'Gold Futures', exchange: 'yahoo' },
  { category: 'commodities', display: 'SILVER', symbol: 'SI=F', yahooSymbol: 'SI=F', base: 'SILVER', name: 'Silver Futures', exchange: 'yahoo' },
  { category: 'commodities', display: 'OIL', symbol: 'CL=F', yahooSymbol: 'CL=F', base: 'OIL', name: 'Crude Oil Futures', exchange: 'yahoo' },
  { category: 'commodities', display: 'NATGAS', symbol: 'NG=F', yahooSymbol: 'NG=F', base: 'GAS', name: 'Natural Gas Futures', exchange: 'yahoo' },
];