import { TierLevel } from '@/types/design';

export type LayoutMode = 'normal' | 'pro' | 'hunt' | 'analyst' | 'scalper';

export type ExchangeId =
  | 'binance'
  | 'bybit'
  | 'bitget'
  | 'bitunix'
  | 'blofin'
  | 'coinbase'
  | 'yahoo';

export type MarketCategory = 'crypto' | 'forex' | 'indices' | 'commodities';

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

export type DockTab = 'positions' | 'watchlist' | 'trades' | 'journal' | 'signals' | 'calendar' | 'news';
export type RightPanelTab = 'watchlist' | 'orders' | 'ai';

export type DecisionSignalState =
  | 'NONE'
  | 'WATCHING'
  | 'SPAWNED'
  | 'VALIDATING'
  | 'FILTERED'
  | 'ARMED'
  | 'EXECUTE'
  | 'MANAGED'
  | 'EXIT'
  | 'CANCELLED';

export interface UiSlice {
  layoutMode: LayoutMode;
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  dockCollapsed: boolean;
  activeDockTab: DockTab;
  activeRightPanelTab: RightPanelTab;
}

export interface MarketSlice {
  category: MarketCategory;
  exchange: ExchangeId;
  source: 'crypto' | 'yahoo';
  symbolDisplay: string;
  symbolRequest: string;
  timeframe: Timeframe;
  livePrice: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  funding: number;
  connected: boolean;
  loading: boolean;
  error: string | null;
  lastUpdate: number | null;
}

export interface ChartSlice {
  loading: boolean;
  error: string | null;
}

export interface DrawingEntity {
  id: string;
  tool: string;
  x: number;
  y: number;
  symbol: string;
  timeframe: Timeframe;
}

export interface ToolsSlice {
  activeTool: string;
  toolOptions: Record<string, string | number | boolean>;
  drawings: DrawingEntity[];
}

export interface AccountSlice {
  tier: TierLevel;
}

export interface SubscriptionsSlice {
  featureMatrix: Record<string, TierLevel[]>;
}

export interface Signal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'neutral';
  strength: number;
  timestamp: Date;
  reason: string;
}

export interface SignalsSlice {
  lifecycle: DecisionSignalState;
  confidence: number;
  explanation: string;
  items: Signal[];
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: Date;
}

export interface JournalSlice {
  entries: JournalEntry[];
}

export interface SystemSlice {
  dataFeedStatus: 'idle' | 'loading' | 'connected' | 'reconnecting' | 'error';
}

export interface WatchlistItem {
  id: string;
  exchange: ExchangeId;
  category: MarketCategory;
  displaySymbol: string;
  requestSymbol: string;
  base: string;
  name: string;
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
