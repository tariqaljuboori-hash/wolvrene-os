'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  AccountSlice,
  ChartSlice,
  DockTab,
  DrawingEntity,
  ExchangeId,
  JournalEntry,
  JournalSlice,
  MarketCategory,
  MarketSlice,
  Order,
  RightPanelTab,
  SignalsSlice,
  SubscriptionsSlice,
  SystemSlice,
  Timeframe,
  ToolsSlice,
  UiSlice,
  WatchlistItem,
} from '@/types/store';
import { TierLevel } from '@/types/design';
import { getCoreMarkets, resolveRequestSymbol } from '@/lib/market/symbol-registry';

interface StoreContextType {
  ui: UiSlice;
  market: MarketSlice;
  chart: ChartSlice;
  tools: ToolsSlice;
  account: AccountSlice;
  subscriptions: SubscriptionsSlice;
  signals: SignalsSlice;
  journal: JournalSlice;
  system: SystemSlice;
  watchlist: WatchlistItem[];
  orders: Order[];

  setLayoutMode: (mode: UiSlice['layoutMode']) => void;
  setCurrentTier: (tier: TierLevel) => void;
  setMarketSelection: (args: { category?: MarketCategory; exchange?: ExchangeId; displaySymbol?: string; requestSymbol?: string; timeframe?: Timeframe }) => void;
  setMarketSnapshot: (args: Partial<Pick<MarketSlice, 'livePrice' | 'change' | 'changePercent' | 'high24h' | 'low24h' | 'volume24h' | 'funding' | 'connected' | 'loading' | 'error'>>) => void;
  setDockTab: (tab: DockTab) => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setActiveTool: (tool: string) => void;
  addDrawing: (drawing: Omit<DrawingEntity, 'id'>) => void;
  clearDrawings: () => void;
  setSignalLifecycle: (args: Partial<Pick<SignalsSlice, 'lifecycle' | 'confidence' | 'explanation'>>) => void;
  hasAccess: (feature: string) => boolean;
}

const defaultWatchlist: WatchlistItem[] = getCoreMarkets().map((m, i) => ({
  id: `${m.display}-${i}`,
  exchange: m.category === 'crypto' ? 'binance' : 'yahoo',
  category: m.category,
  displaySymbol: m.display,
  requestSymbol: resolveRequestSymbol(m.display, m.category === 'crypto' ? 'binance' : 'yahoo'),
  base: m.base,
  name: m.name,
}));

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ui, setUi] = useState<UiSlice>({ layoutMode: 'normal', sidebarCollapsed: false, rightPanelCollapsed: false, dockCollapsed: false, activeDockTab: 'positions', activeRightPanelTab: 'watchlist' });
  const [market, setMarket] = useState<MarketSlice>({ category: 'crypto', exchange: 'binance', source: 'crypto', symbolDisplay: 'BTCUSDT.P', symbolRequest: 'BTCUSDT', timeframe: '2h', livePrice: 0, change: 0, changePercent: 0, high24h: 0, low24h: 0, volume24h: 0, funding: 0, connected: false, loading: false, error: null, lastUpdate: null });
  const [chart] = useState<ChartSlice>({ loading: false, error: null });
  const [tools, setTools] = useState<ToolsSlice>({ activeTool: 'Crosshair', toolOptions: {}, drawings: [] });
  const [account, setAccount] = useState<AccountSlice>({ tier: 'free' });
  const [subscriptions] = useState<SubscriptionsSlice>({ featureMatrix: { 'decision-brain': ['pro', 'elite'], 'risk-engine': ['pro', 'elite'], 'market-scanner': ['elite'], 'community-chat': ['pro', 'elite'] } });
  const [signals, setSignals] = useState<SignalsSlice>({ lifecycle: 'WATCHING', confidence: 52, explanation: 'Monitoring confluence and waiting for confirmation.', items: [] });
  const [journal] = useState<JournalSlice>({ entries: [] as JournalEntry[] });
  const [system] = useState<SystemSlice>({ dataFeedStatus: 'idle' });
  const [watchlist] = useState(defaultWatchlist);
  const [orders] = useState<Order[]>([]);

  const hasAccess = (feature: string) => {
    const required = subscriptions.featureMatrix[feature];
    if (!required) return true;
    return required.includes(account.tier);
  };

  const value = useMemo<StoreContextType>(() => ({
    ui,
    market,
    chart,
    tools,
    account,
    subscriptions,
    signals,
    journal,
    system,
    watchlist,
    orders,
    setLayoutMode: (mode) => setUi((p) => ({ ...p, layoutMode: mode })),
    setCurrentTier: (tier) => setAccount({ tier }),
    setMarketSelection: ({ category, exchange, displaySymbol, requestSymbol, timeframe }) => {
      setMarket((p) => {
        const nextExchange = exchange ?? p.exchange;
        const nextDisplay = displaySymbol ?? p.symbolDisplay;
        return {
          ...p,
          category: category ?? p.category,
          exchange: nextExchange,
          source: (category ?? p.category) === 'crypto' ? 'crypto' : 'yahoo',
          symbolDisplay: nextDisplay,
          symbolRequest: requestSymbol ?? resolveRequestSymbol(nextDisplay, nextExchange),
          timeframe: timeframe ?? p.timeframe,
          loading: true,
          error: null,
        };
      });
    },
    setMarketSnapshot: (args) => setMarket((p) => ({ ...p, ...args, lastUpdate: Date.now() })),
    setDockTab: (tab) => setUi((p) => ({ ...p, activeDockTab: tab })),
    setRightPanelTab: (tab) => setUi((p) => ({ ...p, activeRightPanelTab: tab })),
    setActiveTool: (tool) => setTools((p) => ({ ...p, activeTool: tool })),
    addDrawing: (drawing) => setTools((p) => ({ ...p, drawings: [...p.drawings.slice(-40), { ...drawing, id: `${Date.now()}-${Math.random()}` }] })),
    clearDrawings: () => setTools((p) => ({ ...p, drawings: [] })),
    setSignalLifecycle: (args) => setSignals((p) => ({ ...p, ...args })),
    hasAccess,
  }), [ui, market, chart, tools, account, subscriptions, signals, journal, system, watchlist, orders]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
