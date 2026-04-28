// filepath: modules/signals/SignalsPanel.tsx
'use client';

import { useStore } from '@/store/app-store';
import { Card, Badge } from '@/components/ui';

export function SignalsPanel() {
  const { signals } = useStore();

  return (
    <Card variant="default" padding="none" className="h-full">
      <div className="p-3 border-b border-[#27272a]">
        <h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">Trading Signals</h3>
      </div>
      <div className="divide-y divide-[#27272a]">
        {signals.map((signal) => (
          <div key={signal.id} className="p-4 hover:bg-[#18181b] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#fafafa] font-semibold">{signal.symbol}</span>
                <Badge variant={signal.type === 'buy' ? 'success' : signal.type === 'sell' ? 'error' : 'default'}>
                  {signal.type.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${signal.strength >= 70 ? 'bg-[#22c55e]' : signal.strength >= 40 ? 'bg-[#eab308]' : 'bg-[#ef4444]'}`}
                    style={{ width: `${signal.strength}%` }}
                  ></div>
                </div>
                <span className="text-[#71717a] text-xs ml-1">{signal.strength}%</span>
              </div>
            </div>
            <p className="text-[#a1a1aa] text-sm">{signal.reason}</p>
            <div className="text-[#71717a] text-xs mt-2">
              {signal.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}