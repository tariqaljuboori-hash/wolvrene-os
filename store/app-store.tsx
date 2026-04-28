// filepath: store/app-store.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, WatchlistItem, Signal, Order, JournalEntry, FeatureGate, RightPanelTab, DockTab } from '@/types/store';

// Mock Data
const mockWatchlist: WatchlistItem[] = [
  { id: '1', symbol: 'BTC/USD', name: 'Bitcoin', price: 67432.50, change: 1250.30, changePercent: 1.89, volume: 28500000000 },
  { id: '2', symbol: 'ETH/USD', name: 'Ethereum', price: 3456.78, change: -45.20, changePercent: -1.29, volume: 15200000000 },
  { id: '3', symbol: 'SOL/USD', name: 'Solana', price: 178.45, change: 12.30, changePercent: 7.41, volume: 3200000000 },
  { id: '4', symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 2.35, changePercent: 1.26, volume: 52000000 },
  { id: '5', symbol: 'TSLA', name: 'Tesla Inc.', price: 245.67, change: -8.90, changePercent: -3.50, volume: 85000000 },
  { id: '6', symbol: 'NVDA', name: 'NVIDIA', price: 892.30, change: 45.20, changePercent: 5.33, volume: 42000000 },
];

const mockSignals: Signal[] = [
  { id: '1', symbol: 'BTC/USD', type: 'buy', strength: 85, timestamp: new Date(), reason: 'Bullish divergence on RSI' },
  { id: '2', symbol: 'ETH/USD', type: 'neutral', strength: 45, timestamp: new Date(), reason: 'Range-bound price action' },
  { id: '3', symbol: 'SOL/USD', type: 'buy', strength: 78, timestamp: new Date(), reason: 'Breaking resistance with volume' },
];

const mockOrders: Order[] = [
  { id: '1', symbol: 'BTC/USD', type: 'limit', side: 'buy', quantity: 0.5, price: 67000, status: 'pending', timestamp: new Date() },
  { id: '2', symbol: 'ETH/USD', type: 'market', side: 'sell', quantity: 2.0, status: 'filled', timestamp: new Date() },
];

const mockJournal: JournalEntry[] = [
  { id: '1', title: 'BTC Analysis Update', content: 'Watching key support at 66500. Volume increasing on up days.', tags: ['BTC', 'analysis'], timestamp: new Date() },
  { id: '2', title: 'Trade Setup - SOL', content: 'Looking for breakout above 180. Stop at 170.', tags: ['SOL', 'setup'], timestamp: new Date() },
];

const featureGates: FeatureGate[] = [
  { key: 'advanced_charting', name: 'Advanced Charting', tiers: ['pro', 'elite'], description: 'Professional chart tools and indicators' },
  { key: 'ai_signals', name: 'AI Signals', tiers: ['pro', 'elite'], description: 'AI-powered trading signals' },
  { key: 'elite_analytics', name: 'Elite Analytics', tiers: ['elite'], description: 'Advanced portfolio analytics' },
  { key: 'priority_support', name: 'Priority Support', tiers: ['pro', 'elite'], description: '24/7 priority support' },
  { key: 'custom_workspaces', name: 'Custom Workspaces', tiers: ['pro', 'elite'], description: 'Create custom workspace layouts' },
  { key: 'api_access', name: 'API Access', tiers: ['elite'], description: 'Full API access for automation' },
];

interface StoreContextType {
  state: AppState;
  watchlist: WatchlistItem[];
  signals: Signal[];
  orders: Order[];
  journal: JournalEntry[];
  featureGates: FeatureGate[];
  setLayoutMode: (mode: 'normal' | 'pro') => void;
  setCurrentSymbol: (symbol: string) => void;
  setCurrentTimeframe: (timeframe: string) => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setDockTab: (tab: DockTab) => void;
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
  currentSymbol: 'BTCUSDT.P',
  currentTimeframe: '2h',
  activeRightPanelTab: 'watchlist',
  activeDockTab: 'positions',
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [watchlist] = useState<WatchlistItem[]>(mockWatchlist);
  const [signals] = useState<Signal[]>(mockSignals);
  const [orders] = useState<Order[]>(mockOrders);
  const [journal] = useState<JournalEntry[]>(mockJournal);

  const setLayoutMode = (mode: 'normal' | 'pro') => {
    setState(prev => ({ ...prev, layoutMode: mode }));
  };

  const setCurrentSymbol = (symbol: string) => {
    setState(prev => ({ ...prev, currentSymbol: symbol }));
  };

  const setCurrentTimeframe = (timeframe: string) => {
    setState(prev => ({ ...prev, currentTimeframe: timeframe }));
  };

  const setRightPanelTab = (tab: RightPanelTab) => {
    setState(prev => ({ ...prev, activeRightPanelTab: tab }));
  };

  const setDockTab = (tab: DockTab) => {
    setState(prev => ({ ...prev, activeDockTab: tab }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const toggleRightPanel = () => {
    setState(prev => ({ ...prev, rightPanelCollapsed: !prev.rightPanelCollapsed }));
  };

  const toggleDock = () => {
    setState(prev => ({ ...prev, dockCollapsed: !prev.dockCollapsed }));
  };

  const hasAccess = (featureKey: string): boolean => {
    const gate = featureGates.find(g => g.key === featureKey);
    if (!gate) return true;
    return gate.tiers.includes(state.currentTier);
  };

  return (
    <StoreContext.Provider value={{
      state,
      watchlist,
      signals,
      orders,
      journal,
      featureGates,
      setLayoutMode,
      setCurrentSymbol,
      setCurrentTimeframe,
      setRightPanelTab,
      setDockTab,
      toggleSidebar,
      toggleRightPanel,
      toggleDock,
      hasAccess,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
