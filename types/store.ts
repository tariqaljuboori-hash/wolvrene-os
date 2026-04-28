// Store Types

import { TierLevel } from '@/types/design';

export type RightPanelTab = 'watchlist' | 'orders' | 'ai';
export type DockTab = 'positions' | 'watchlist' | 'trades' | 'journal' | 'signals' | 'calendar' | 'news';

export interface AppState {
  layoutMode: 'normal' | 'pro';
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  dockCollapsed: boolean;
  currentTier: TierLevel;
  currentSymbol: string;
  currentTimeframe: string;
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
