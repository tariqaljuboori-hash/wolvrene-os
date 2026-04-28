// filepath: components/layout/TradingControls.tsx
'use client';

import Image from 'next/image';
import { useStore } from '@/store/app-store';
import { Timeframe } from '@/types/store';
import { useMarketData } from '@/components/chart/useMarketData';

const headerFrames: Timeframe[] = ['1m', '3m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'];

export function TradingControls() {
  const { state, setLayoutMode, setCurrentTimeframe } = useStore();
  const isPro = state.layoutMode === 'pro';

  // Live market data for header stats
  const { marketData, loading: marketLoading } = useMarketData(
    state.currentExchangeSymbol,
    state.currentExchange
  );

  return (
    <header className="h-16 bg-[#0b1014] border-b border-[rgba(212,168,83,0.22)] px-4 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-3 min-w-[260px]">
        <Image src="/window.svg" alt="Wolvrene logo" width={24} height={24} className="opacity-95" />
        <div>
          <div className="text-[#f5f5f5] text-sm font-semibold tracking-[0.18em]">WOLVRENE</div>
          <div className="text-[10px] text-[#8d95a1] tracking-[0.14em] uppercase">AI Precision Trading</div>
        </div>
      </div>

      {/* Dynamic price display */}
      <div className="flex items-center gap-4">
        {marketData && (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#10151b] border border-[rgba(212,168,83,0.18)]">
            <span className="text-[14px] font-semibold text-[#f3f4f6]">
              {state.currentExchangeSymbol}
            </span>
            <span className="text-[16px] font-bold text-[#f3f4f6]">
              ${marketData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-[12px] font-medium ${marketData.change >= 0 ? 'text-[#00d084]' : 'text-[#ff4444]'}`}>
              {marketData.change >= 0 ? '+' : ''}{marketData.changePercent.toFixed(2)}%
            </span>
            <span className={`text-[10px] ${state.dataFeedStatus === 'connected' ? 'text-[#00d084]' : 'text-[#ff4444]'}`}>
              ● {state.dataFeedStatus.toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 bg-[#10151b] border border-[rgba(212,168,83,0.22)] rounded-lg p-1">
          {headerFrames.map((tf) => (
            <button
              key={tf}
              onClick={() => setCurrentTimeframe(tf)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${state.currentTimeframe === tf ? 'bg-[#d4a853] text-[#050607]' : 'text-[#9ca3af] hover:text-[#f3f4f6]'}`}
            >
              {tf}
            </button>
          ))}
        </div>
        {['Indicators', 'AI Tools', 'Alert', 'Replay'].map((a) => (
          <button key={a} className="px-3 py-1.5 text-[11px] rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.22)] text-[#d1d5db] hover:text-white">
            {a}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 min-w-[300px] justify-end">
        <select className="bg-[#10151b] border border-[rgba(212,168,83,0.22)] text-[#e5e7eb] text-[11px] px-2 py-1.5 rounded-md">
          <option>Wolvrene AI / Pro Plan</option>
        </select>
        <button className="px-3 py-1.5 text-[11px] rounded-md bg-[#f6a400] text-[#050607] font-semibold">VIP Access</button>
        <button className="w-8 h-8 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.22)] text-[#a1a1aa]">⌕</button>
        <button className="w-8 h-8 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.22)] text-[#a1a1aa]">⚙</button>
        <button
          onClick={() => setLayoutMode(isPro ? 'normal' : 'pro')}
          className="px-3 py-1.5 text-[11px] rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.22)] text-[#d4a853]"
        >
          {isPro ? 'Normal Mode' : 'Pro Mode'}
        </button>
        <button className="px-3 py-1.5 text-[11px] rounded-md bg-[#d4a853] text-[#050607] font-semibold">Publish</button>
      </div>
    </header>
  );
}
