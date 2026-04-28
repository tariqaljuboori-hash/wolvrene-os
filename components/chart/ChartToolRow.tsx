'use client';

import { useStore } from '@/store/app-store';
import { Timeframe } from '@/types/store';

const frames: Timeframe[] = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '1d', '1w', '1M'];

type Props = {
  onSettings?: () => void;
};

export function ChartToolRow({ onSettings }: Props) {
  const { state, setCurrentTimeframe } = useStore();

  return (
    <div className="h-11 rounded-t-xl border-b border-[rgba(212,168,83,0.18)] bg-[#0b1014] px-3 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1">
        {frames.map((tf) => {
          const active = state.currentTimeframe === tf;

          return (
            <button
              key={tf}
              onClick={() => setCurrentTimeframe(tf)}
              className={`min-w-[34px] px-2.5 py-1 rounded-md transition-all ${
                active
                  ? 'text-[#f6a400] bg-[#151e26] shadow-[0_0_0_1px_rgba(246,164,0,0.18)]'
                  : 'text-[#c3cad3] hover:bg-[#121920]'
              }`}
            >
              {tf}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-[#d0d6de]">
        {['Indicators', 'Alert', 'Replay', 'Layout'].map((item) => (
          <button
            key={item}
            className="px-2.5 py-1 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.18)] hover:bg-[#151c23]"
          >
            {item}
          </button>
        ))}

        <button
          onClick={onSettings}
          className="w-7 h-7 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.18)] hover:bg-[#151c23]"
          title="Settings"
        >
          ⚙
        </button>

        <button className="w-7 h-7 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.18)] hover:bg-[#151c23]">
          📷
        </button>

        <button className="w-7 h-7 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.18)] hover:bg-[#151c23]">
          ⛶
        </button>
      </div>
    </div>
  );
}