'use client';

import { useStore } from '@/store/app-store';

const frames = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', 'D', 'W', 'M'];

export function ChartToolRow() {
  const { state, setCurrentTimeframe } = useStore();

  return (
    <div className="h-11 rounded-t-xl border-b border-[rgba(212,168,83,0.18)] bg-[#0b1014] px-3 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1">
        {frames.map((tf) => (
          <button
            key={tf}
            onClick={() => setCurrentTimeframe(tf)}
            className={`px-2 py-1 rounded ${state.currentTimeframe === tf ? 'text-[#f6a400] bg-[#151e26]' : 'text-[#c3cad3]'}`}
          >
            {tf}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[#d0d6de]">
        {['Indicators', 'Alert', 'Replay', 'Layout'].map((item) => <button key={item} className="px-2 py-1 rounded bg-[#10151b] border border-[rgba(212,168,83,0.18)]">{item}</button>)}
        {['⚙', '📷', '⛶'].map((item) => <button key={item} className="w-7 h-7 rounded bg-[#10151b] border border-[rgba(212,168,83,0.18)]">{item}</button>)}
      </div>
    </div>
  );
}
