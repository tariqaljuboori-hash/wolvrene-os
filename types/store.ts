// Store Types

import { TierLevel } from '@/types/design';

export type LayoutMode = 'normal' | 'pro';

export type ExchangeId =
  | 'binance'
  | 'bybit'
  | 'bitget'
  | 'bitunix'
  | 'blofin'
  | 'coinbase'
  | 'yahoo';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export type RightPanelTab = 'watchlist' | 'orders' | 'ai';

export type DockTab =
  | 'positions'
  | 'watchlist'
  | 'trades'
  | 'journal'
  | 'signals'
  | 'calendar'
  | 'news';

export type Timeframe =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '1d'
  | '1w'
  | '1M';

export type DataFeedStatus =
  | 'idle'
  | 'loading'
  | 'connected'
  | 'reconnecting'
  | 'error';

export interface ExchangeSymbol {
  display: string;
  exchange: ExchangeId;
  exchangeSymbol: string;
  base: string;
  quote: string;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AppState {
  layoutMode: LayoutMode;
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  dockCollapsed: boolean;
  currentTier: TierLevel;

  currentExchange: ExchangeId;
  currentSymbol: string;
  currentExchangeSymbol: string;
  currentTimeframe: Timeframe;
  activeDrawingTool: string;

  dataFeedStatus: DataFeedStatus;
  lastMarketUpdate: number | null;

  activeRightPanelTab: RightPanelTab;
  activeDockTab: DockTab;
}

export interface FeatureGate {
  key: string;
  name: string;
  tiers: TierLevel[];
  description: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  exchangeSymbol: string;
  exchange: ExchangeId;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface Signal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'neutral';
  strength: number;
  timestamp: Date;
  reason: string;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: Date;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: Date;
}