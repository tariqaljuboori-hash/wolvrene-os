'use client';

import { useStore } from '@/store/app-store';
import { Card } from '@/components/ui';

export function WatchlistPanel() {
  const { watchlist } = useStore();
  return <Card variant="default" padding="none" className="h-full"><div className="p-3 border-b border-[#27272a]"><h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">Watchlist Snapshot</h3></div><div className="p-3 text-sm text-[#8b949e]">Rows: {watchlist.rows.length} · Favorites: {watchlist.favorites.length}</div></Card>;
}
