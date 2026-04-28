// filepath: modules/watchlist/WatchlistPanel.tsx
'use client';

import { useStore } from '@/store/app-store';
import { Card, Badge } from '@/components/ui';

export function WatchlistPanel() {
  const { watchlist } = useStore();

  return (
    <Card variant="default" padding="none" className="h-full">
      <div className="p-3 border-b border-[#27272a]">
        <h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">Watchlist</h3>
      </div>
      <div className="divide-y divide-[#27272a]">
        {watchlist.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 hover:bg-[#18181b] transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[#fafafa] font-medium">{item.symbol}</span>
                <Badge variant="default">{item.name}</Badge>
              </div>
              <div className="text-[#71717a] text-xs mt-0.5">Vol: ${(item.volume / 1e9).toFixed(1)}B</div>
            </div>
            <div className="text-right">
              <div className="text-[#fafafa] font-semibold">${item.price.toLocaleString()}</div>
              <div className={`text-sm ${item.change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}