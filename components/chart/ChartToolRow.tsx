'use client';

import { useStore } from '@/store/app-store';
import { Timeframe } from '@/types/store';

const frames: Timeframe[] = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '1d', '1w', '1M'];

export function ChartToolRow({ onSettings }: { onSettings?: () => void }) {
  const { market, setMarketSelection, hasAccess } = useStore();

  return (
    <div className="h-11 rounded-t-xl border-b border-[rgba(212,168,83,0.18)] bg-[#0b1014] px-3 flex items-center justify-between text-xs gap-2">
      <div className="flex items-center gap-1 overflow-x-auto">
        {frames.map((tf) => (
          <button
            key={tf}
            onClick={() => setMarketSelection({ timeframe: tf })}
            className={`min-w-[34px] px-2.5 py-1 rounded-md transition-all ${market.timeframe === tf ? 'text-[#f6a400] bg-[#151e26]' : 'text-[#c3cad3] hover:bg-[#121920]'}`}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-2 text-[#d0d6de]">
        {['Indicators', 'Alert', 'Replay', 'Layout'].map((item) => {
          const locked = item !== 'Replay' && !hasAccess(item === 'Alert' ? 'decision-brain' : 'risk-engine');
          return <button key={item} className={`px-2.5 py-1 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.18)] ${locked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#151c23]'}`}>{item}{locked ? ' · PRO' : ''}</button>;
        })}
        <button onClick={onSettings} className="w-7 h-7 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.18)]">⚙</button>
      </div>
    </div>
  );
}
