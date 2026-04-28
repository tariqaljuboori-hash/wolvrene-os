'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  BrainDomain,
  DockTab,
  DrawingEntity,
  ExchangeId,
  JournalDomain,
  MarketCategory,
  MarketDomain,
  ChartDomain,
  NewsDomain,
  Order,
  OrderDomain,
  Position,
  RightPanelTab,
  SignalRecord,
  SignalsDomain,
  SubscriptionDomain,
  SystemDomain,
  Timeframe,
  ToolsDomain,
  UiDomain,
  WatchlistDomain,
} from '@/types/store';
import { TierLevel } from '@/types/design';
import { getCoreMarkets, resolveRequestSymbol } from '@/lib/market/symbol-registry';

interface Store {
  ui: UiDomain;
  market: MarketDomain;
  chart: ChartDomain;
  watchlist: WatchlistDomain;
  order: OrderDomain;
  signals: SignalsDomain;
  brain: BrainDomain;
  journal: JournalDomain;
  news: NewsDomain;
  subscription: SubscriptionDomain;
  system: SystemDomain;
  tools: ToolsDomain;
  setLayoutMode: (m: UiDomain['layoutMode']) => void;
  setHuntMode: (v: boolean) => void;
  setDockTab: (tab: DockTab) => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setTier: (tier: TierLevel) => void;
  setMarketSelection: (p: { category?: MarketCategory; exchange?: ExchangeId; displaySymbol?: string; requestSymbol?: string; timeframe?: Timeframe }) => void;
  setMarketSnapshot: (p: Partial<Store['market']>) => void;
  setActiveTool: (tool: string) => void;
  addDrawing: (drawing: Omit<DrawingEntity, 'id' | 'selected'>) => void;
  selectDrawing: (id: string) => void;
  deleteDrawing: (id: string) => void;
  clearDrawings: () => void;
  setWatchlistSearch: (s: string) => void;
  setWatchlistSort: (by: WatchlistDomain['sortBy']) => void;
  setFavorites: (f: string[]) => void;
  placeOrder: (side: 'buy' | 'sell') => void;
  setOrderType: (t: OrderDomain['orderType']) => void;
  setOrderInputs: (p: Partial<Pick<OrderDomain, 'size' | 'priceInput' | 'leverage' | 'tp' | 'sl'>>) => void;
  setBrain: (p: Partial<BrainDomain>) => void;
  pushSignal: (s: Omit<SignalRecord, 'id' | 'timestamp'>) => void;
  addJournal: (title: string, content: string) => void;
  pushNews: (message: string) => void;
  addChat: (text: string, author?: string) => void;
  hasAccess: (featureKey: string) => boolean;
}

const ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const core = getCoreMarkets();

  const [ui, setUi] = useState<UiDomain>({ layoutMode: 'normal', rightPanelCollapsed: false, dockCollapsed: false, activeDockTab: 'wolf-feed', activeRightPanelTab: 'watchlist', huntMode: false });
  const [market, setMarket] = useState<MarketDomain>({ category: 'crypto', exchange: 'binance', source: 'crypto', symbolDisplay: 'BTCUSDT.P', symbolRequest: 'BTCUSDT', timeframe: '2h', livePrice: 0, change: 0, changePercent: 0, high24h: 0, low24h: 0, volume24h: 0, funding: 0, connected: false, loading: false, error: null, lastUpdate: null });
  const [chart] = useState({ loading: false, error: null as string | null });
  const [tools, setTools] = useState<ToolsDomain>({ activeTool: 'Crosshair', toolOptions: {}, drawings: [] });
  const [watchlist, setWatchlist] = useState<WatchlistDomain>({ rows: core.map((m, i) => ({ id: `${m.display}-${i}`, exchange: m.category === 'crypto' ? 'binance' : 'yahoo', category: m.category, displaySymbol: m.display, requestSymbol: resolveRequestSymbol(m.display, m.category === 'crypto' ? 'binance' : 'yahoo'), base: m.base, name: m.name })), favorites: [], search: '', sortBy: 'volume', sortDir: 'desc' });
  const [order, setOrder] = useState<OrderDomain>({ orderType: 'limit', leverage: 20, size: 0.01, priceInput: 0, tp: null, sl: null, orders: [], positions: [], paperMode: true });
  const [signals, setSignals] = useState<SignalsDomain>({ history: [] });
  const [brain, setBrainState] = useState<BrainDomain>({ lifecycle: 'IDLE', bias: 'neutral', confidence: 0, whyWaiting: 'Waiting for market context.', riskWarning: 'No risk warning yet.', setupQuality: 'N/A', sessionContext: 'Session unknown', nextAction: 'Observe' });
  const [journal, setJournal] = useState<JournalDomain>({ entries: [] });
  const [news, setNews] = useState<NewsDomain>({ feed: [], chat: [] });
  const [subscription, setSubscription] = useState<SubscriptionDomain>({ tier: 'free', featureMatrix: { 'decision-brain': ['pro', 'elite'], 'market-scanner': ['pro', 'elite'], 'community-chat': ['elite'], 'advanced-tools': ['pro', 'elite'] } });
  const [system, setSystem] = useState<SystemDomain>({ dataFeedStatus: 'idle', lastError: null, pingMs: 0 });

  const hasAccess = (featureKey: string) => {
    const req = subscription.featureMatrix[featureKey];
    if (!req) return true;
    return req.includes(subscription.tier);
  };

  const store: Store = useMemo(() => ({
    ui, market, chart, watchlist, order, signals, brain, journal, news, subscription, system, tools,
    setLayoutMode: (m) => setUi((p) => ({ ...p, layoutMode: m })),
    setHuntMode: (v) => setUi((p) => ({ ...p, huntMode: v, layoutMode: v ? 'hunt' : p.layoutMode === 'hunt' ? 'normal' : p.layoutMode })),
    setDockTab: (tab) => setUi((p) => ({ ...p, activeDockTab: tab })),
    setRightPanelTab: (tab) => setUi((p) => ({ ...p, activeRightPanelTab: tab })),
    setTier: (tier) => setSubscription((p) => ({ ...p, tier })),
    setMarketSelection: ({ category, exchange, displaySymbol, requestSymbol, timeframe }) => {
      setMarket((p) => {
        const ex = exchange ?? p.exchange;
        const ds = displaySymbol ?? p.symbolDisplay;
        return { ...p, category: category ?? p.category, source: (category ?? p.category) === 'crypto' ? 'crypto' : 'yahoo', exchange: ex, symbolDisplay: ds, symbolRequest: requestSymbol ?? resolveRequestSymbol(ds, ex), timeframe: timeframe ?? p.timeframe, loading: true, error: null };
      });
    },
    setMarketSnapshot: (s) => setMarket((p) => ({ ...p, ...s, lastUpdate: Date.now() })),
    setActiveTool: (tool) => setTools((p) => ({ ...p, activeTool: tool })),
    addDrawing: (drawing) => setTools((p) => ({ ...p, drawings: [...p.drawings, { ...drawing, id: `${Date.now()}-${Math.random()}`, selected: false }] })),
    selectDrawing: (id) => setTools((p) => ({ ...p, drawings: p.drawings.map((d) => ({ ...d, selected: d.id === id })) })),
    deleteDrawing: (id) => setTools((p) => ({ ...p, drawings: p.drawings.filter((d) => d.id !== id) })),
    clearDrawings: () => setTools((p) => ({ ...p, drawings: [] })),
    setWatchlistSearch: (s) => setWatchlist((p) => ({ ...p, search: s })),
    setWatchlistSort: (by) => setWatchlist((p) => ({ ...p, sortBy: by, sortDir: p.sortBy === by && p.sortDir === 'desc' ? 'asc' : 'desc' })),
    setFavorites: (f) => setWatchlist((p) => ({ ...p, favorites: f })),
    setOrderType: (t) => setOrder((p) => ({ ...p, orderType: t })),
    setOrderInputs: (x) => setOrder((p) => ({ ...p, ...x })),
    placeOrder: (side) => {
      setOrder((p) => {
        const price = p.orderType === 'market' ? market.livePrice : p.priceInput || market.livePrice;
        const next: Order = { id: `${Date.now()}`, symbol: market.symbolDisplay, side, type: p.orderType, quantity: p.size, price, tp: p.tp ?? undefined, sl: p.sl ?? undefined, leverage: p.leverage, status: 'filled', timestamp: Date.now() };
        const pos: Position = { id: `pos-${Date.now()}`, symbol: market.symbolDisplay, side, entryPrice: price, markPrice: market.livePrice || price, quantity: p.size, leverage: p.leverage, pnl: 0, timestamp: Date.now() };
        return { ...p, orders: [next, ...p.orders].slice(0, 100), positions: [pos, ...p.positions].slice(0, 100) };
      });
      setJournal((j) => ({ entries: [{ id: `${Date.now()}`, title: `${side.toUpperCase()} ${market.symbolDisplay}`, content: `Paper ${side} @ ${market.livePrice || 0}`, timestamp: Date.now() }, ...j.entries] }));
    },
    setBrain: (b) => setBrainState((p) => ({ ...p, ...b })),
    pushSignal: (s) => setSignals((p) => ({ history: [{ id: `${Date.now()}`, timestamp: Date.now(), ...s }, ...p.history].slice(0, 120) })),
    addJournal: (title, content) => setJournal((p) => ({ entries: [{ id: `${Date.now()}`, title, content, timestamp: Date.now() }, ...p.entries] })),
    pushNews: (message) => setNews((p) => ({ ...p, feed: [{ id: `${Date.now()}`, message, timestamp: Date.now() }, ...p.feed].slice(0, 80) })),
    addChat: (text, author = 'Trader') => setNews((p) => ({ ...p, chat: [...p.chat, { id: `${Date.now()}`, text, author, timestamp: Date.now() }].slice(-120) })),
    hasAccess,
  }), [ui, market, chart, watchlist, order, signals, brain, journal, news, subscription, system, tools]);

  return <ctx.Provider value={store}>{children}</ctx.Provider>;
}

export function useStore() { const s = useContext(ctx); if (!s) throw new Error('useStore must be used within StoreProvider'); return s; }
