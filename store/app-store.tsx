'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  AppState,
  WatchlistItem,
  Signal,
  Order,
  JournalEntry,
  FeatureGate,
  RightPanelTab,
  DockTab,
  Timeframe,
  DataFeedStatus,
  ExchangeId,
  MarketData,
} from '@/types/store';

const defaultWatchlist: WatchlistItem[] = [
  {
    id: 'btc-binance',
    symbol: 'BTCUSDT.P',
    exchangeSymbol: 'BTCUSDT',
    exchange: 'binance',
    name: 'Bitcoin',
    price: 76778.2,
    change: 176.9,
    changePercent: 0.23,
    volume: 54530000,
  },
  {
    id: 'eth-binance',
    symbol: 'ETHUSDT.P',
    exchangeSymbol: 'ETHUSDT',
    exchange: 'binance',
    name: 'Ethereum',
    price: 3573.21,
    change: 45.32,
    changePercent: 1.28,
    volume: 31221000,
  },
  {
    id: 'sol-binance',
    symbol: 'SOLUSDT.P',
    exchangeSymbol: 'SOLUSDT',
    exchange: 'binance',
    name: 'Solana',
    price: 172.48,
    change: 2.47,
    changePercent: 1.45,
    volume: 12341000,
  },

  {
    id: 'eurusd-yahoo',
    symbol: 'EURUSD',
    exchangeSymbol: 'EURUSD=X',
    exchange: 'yahoo',
    name: 'Euro / US Dollar',
    price: 0,
    change: 0,
    changePercent: 0,
    volume: 0,
  },
  {
    id: 'gbpusd-yahoo',
    symbol: 'GBPUSD',
    exchangeSymbol: 'GBPUSD=X',
    exchange: 'yahoo',
    name: 'British Pound / US Dollar',
    price: 0,
    change: 0,
    changePercent: 0,
    volume: 0,
  },
  {
    id: 'nas100-yahoo',
    symbol: 'NAS100',
    exchangeSymbol: '^NDX',
    exchange: 'yahoo',
    name: 'Nasdaq 100',
    price: 0,
    change: 0,
    changePercent: 0,
    volume: 0,
  },
  {
    id: 'us30-yahoo',
    symbol: 'US30',
    exchangeSymbol: '^DJI',
    exchange: 'yahoo',
    name: 'Dow Jones',
    price: 0,
    change: 0,
    changePercent: 0,
    volume: 0,
  },
  {
    id: 'gold-yahoo',
    symbol: 'GOLD',
    exchangeSymbol: 'GC=F',
    exchange: 'yahoo',
    name: 'Gold Futures',
    price: 0,
    change: 0,
    changePercent: 0,
    volume: 0,
  },
  {
    id: 'silver-yahoo',
    symbol: 'SILVER',
    exchangeSymbol: 'SI=F',
    exchange: 'yahoo',
    name: 'Silver Futures',
    price: 0,
    change: 0,
    changePercent: 0,
    volume: 0,
  },
];

const mockSignals: Signal[] = [
  {
    id: '1',
    symbol: 'BTCUSDT.P',
    type: 'buy',
    strength: 68,
    timestamp: new Date(),
    reason: 'Liquidity sweep detected',
  },
];

const mockOrders: Order[] = [];
const mockJournal: JournalEntry[] = [];
const featureGates: FeatureGate[] = [];

interface StoreContextType {
  state: AppState;
  watchlist: WatchlistItem[];
  signals: Signal[];
  orders: Order[];
  journal: JournalEntry[];
  featureGates: FeatureGate[];
  marketData: MarketData | null;

  setLayoutMode: (mode: 'normal' | 'pro') => void;
  setCurrentSymbol: (
    symbol: string,
    exchangeSymbol?: string,
    exchange?: ExchangeId
  ) => void;
  setCurrentExchange: (exchange: ExchangeId) => void;
  setCurrentTimeframe: (timeframe: Timeframe) => void;
  setActiveDrawingTool: (tool: string) => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setDockTab: (tab: DockTab) => void;

  setDataFeedStatus: (status: DataFeedStatus) => void;
  setLastMarketUpdate: (time: number) => void;
  updateMarketData: (data: MarketData | null) => void;

  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  toggleDock: () => void;

  hasAccess: (featureKey: string) => boolean;
}

const defaultState: AppState = {
  layoutMode: 'normal',
  sidebarCollapsed: false,
  rightPanelCollapsed: false,
  dockCollapsed: false,

  currentTier: 'free',

  currentExchange: 'binance',
  currentSymbol: 'BTCUSDT.P',
  currentExchangeSymbol: 'BTCUSDT',
  currentTimeframe: '2h',
  activeDrawingTool: 'Crosshair',

  dataFeedStatus: 'idle',
  lastMarketUpdate: null,

  activeRightPanelTab: 'watchlist',
  activeDockTab: 'positions',
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const [watchlist] = useState(defaultWatchlist);
  const [signals] = useState(mockSignals);
  const [orders] = useState(mockOrders);
  const [journal] = useState(mockJournal);
  const [marketData, setMarketData] = useState<MarketData | null>(null);

  const setLayoutMode = (mode: 'normal' | 'pro') => {
    setState((prev) => ({ ...prev, layoutMode: mode }));
  };

  const setCurrentSymbol = (
    symbol: string,
    exchangeSymbol?: string,
    exchange?: ExchangeId
  ) => {
    const cleanExchangeSymbol =
      exchangeSymbol ?? symbol.replace('.P', '').replace('/', '');

    setState((prev) => ({
      ...prev,
      currentSymbol: symbol,
      currentExchangeSymbol: cleanExchangeSymbol,
      currentExchange: exchange ?? prev.currentExchange,
      dataFeedStatus: 'loading',
      lastMarketUpdate: Date.now(),
    }));
  };

  const setCurrentExchange = (exchange: ExchangeId) => {
    setState((prev) => ({
      ...prev,
      currentExchange: exchange,
      dataFeedStatus: 'loading',
      lastMarketUpdate: Date.now(),
    }));
  };

  const setCurrentTimeframe = (timeframe: Timeframe) => {
    setState((prev) => ({
      ...prev,
      currentTimeframe: timeframe,
      dataFeedStatus: 'loading',
      lastMarketUpdate: Date.now(),
    }));
  };

  const setActiveDrawingTool = (tool: string) => {
    setState((prev) => ({ ...prev, activeDrawingTool: tool }));
  };

  const setRightPanelTab = (tab: RightPanelTab) => {
    setState((prev) => ({ ...prev, activeRightPanelTab: tab }));
  };

  const setDockTab = (tab: DockTab) => {
    setState((prev) => ({ ...prev, activeDockTab: tab }));
  };

  const setDataFeedStatus = (status: DataFeedStatus) => {
    setState((prev) => ({ ...prev, dataFeedStatus: status }));
  };

  const setLastMarketUpdate = (time: number) => {
    setState((prev) => ({ ...prev, lastMarketUpdate: time }));
  };

  const updateMarketData = (data: MarketData | null) => {
    setMarketData(data);
  };

  const toggleSidebar = () => {
    setState((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  };

  const toggleRightPanel = () => {
    setState((prev) => ({
      ...prev,
      rightPanelCollapsed: !prev.rightPanelCollapsed,
    }));
  };

  const toggleDock = () => {
    setState((prev) => ({
      ...prev,
      dockCollapsed: !prev.dockCollapsed,
    }));
  };

  const hasAccess = () => true;

  return (
    <StoreContext.Provider
      value={{
        state,
        watchlist,
        signals,
        orders,
        journal,
        featureGates,
        marketData,

        setLayoutMode,
        setCurrentSymbol,
        setCurrentExchange,
        setCurrentTimeframe,
        setActiveDrawingTool,
        setRightPanelTab,
        setDockTab,

        setDataFeedStatus,
        setLastMarketUpdate,
        updateMarketData,

        toggleSidebar,
        toggleRightPanel,
        toggleDock,

        hasAccess,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context;
}