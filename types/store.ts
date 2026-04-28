import { TierLevel } from '@/types/design';

export type LayoutMode = 'normal' | 'pro' | 'hunt' | 'analyst' | 'scalper';
export type ExchangeId = 'binance' | 'bybit' | 'bitget' | 'bitunix' | 'blofin' | 'coinbase' | 'yahoo';
export type MarketCategory = 'crypto' | 'forex' | 'indices' | 'commodities';
export type Timeframe = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '1d' | '1w' | '1M';

export type DockTab = 'wolf-feed' | 'journal' | 'positions' | 'orders' | 'signals' | 'backtester' | 'liquidity-map' | 'market-scanner' | 'community-chat';
export type RightPanelTab = 'watchlist' | 'orders' | 'ai';

export type DecisionSignalState = 'IDLE' | 'SCANNING' | 'WATCHING' | 'ARMED' | 'TRIGGERED' | 'MANAGING' | 'EXITED' | 'COOLDOWN';

export interface UiDomain { layoutMode: LayoutMode; rightPanelCollapsed: boolean; dockCollapsed: boolean; activeDockTab: DockTab; activeRightPanelTab: RightPanelTab; huntMode: boolean; }
export interface MarketDomain {
  category: MarketCategory; exchange: ExchangeId; source: 'crypto' | 'yahoo'; symbolDisplay: string; symbolRequest: string; timeframe: Timeframe;
  livePrice: number; change: number; changePercent: number; high24h: number; low24h: number; volume24h: number; funding: number;
  connected: boolean; loading: boolean; error: string | null; lastUpdate: number | null;
}
export interface ChartDomain { loading: boolean; error: string | null; }
export interface DrawingEntity { id: string; tool: string; x: number; y: number; symbol: string; timeframe: Timeframe; selected: boolean; }
export interface ToolsDomain { activeTool: string; toolOptions: Record<string, string | number | boolean>; drawings: DrawingEntity[]; }

export interface WatchlistItem { id: string; exchange: ExchangeId; category: MarketCategory; displaySymbol: string; requestSymbol: string; base: string; name: string; }
export interface WatchlistDomain { rows: WatchlistItem[]; favorites: string[]; search: string; sortBy: 'symbol' | 'last' | 'chg' | 'chgP' | 'volume'; sortDir: 'asc' | 'desc'; }

export type OrderType = 'limit' | 'market' | 'stop' | 'trailing';
export interface Order { id: string; symbol: string; side: 'buy' | 'sell'; type: OrderType; quantity: number; price: number; tp?: number; sl?: number; leverage: number; status: 'pending' | 'filled' | 'cancelled'; timestamp: number; }
export interface Position { id: string; symbol: string; side: 'buy' | 'sell'; entryPrice: number; markPrice: number; quantity: number; leverage: number; pnl: number; timestamp: number; }
export interface OrderDomain { orderType: OrderType; leverage: number; size: number; priceInput: number; tp: number | null; sl: number | null; orders: Order[]; positions: Position[]; paperMode: boolean; }

export interface SignalRecord { id: string; symbol: string; direction: 'long' | 'short' | 'neutral'; confidence: number; reason: string; timestamp: number; }
export interface SignalsDomain { history: SignalRecord[]; }

export interface BrainDomain { lifecycle: DecisionSignalState; bias: 'bullish' | 'bearish' | 'neutral'; confidence: number; whyWaiting: string; riskWarning: string; setupQuality: string; sessionContext: string; nextAction: string; }

export interface JournalEntry { id: string; title: string; content: string; timestamp: number; }
export interface JournalDomain { entries: JournalEntry[]; }

export interface NewsItem { id: string; message: string; timestamp: number; }
export interface ChatMessage { id: string; text: string; author: string; timestamp: number; }
export interface NewsDomain { feed: NewsItem[]; chat: ChatMessage[]; }

export interface SubscriptionDomain { tier: TierLevel; featureMatrix: Record<string, TierLevel[]>; }
export interface SystemDomain { dataFeedStatus: 'idle' | 'loading' | 'connected' | 'reconnecting' | 'error'; lastError: string | null; pingMs: number; }
