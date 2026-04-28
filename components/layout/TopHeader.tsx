'use client';

import Image from 'next/image';
import { useStore } from '@/store/app-store';
import { useMarketData } from '@/components/chart/useMarketData';

export function TopHeader() {
  const { market, ui, account, setLayoutMode, setCurrentTier } = useStore();
  useMarketData();

  return (
    <header className="h-auto lg:h-20 p-2 lg:px-4 bg-[#050607] border-b border-[rgba(212,168,83,0.22)] flex flex-col lg:flex-row lg:items-center gap-2">
      <div className="h-14 lg:h-full w-full lg:w-[320px] flex items-center gap-3 rounded-xl px-3 bg-[#070b10] border border-[rgba(212,168,83,0.18)]">
        <Image src="/wolvrene-logo.png" alt="Wolvrene OS logo" width={36} height={36} className="rounded-md object-contain" />
        <div>
          <div className="text-[22px] lg:text-[30px] tracking-[-0.06em] font-semibold leading-none"><span className="text-[#f3f4f6]">WOLV</span><span className="text-[#d4a853]">RENE</span></div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#9aa4ae]">AI Trading OS</div>
        </div>
      </div>

      <div className="flex-1 rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] px-3 py-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
        <div><div className="text-[#8b949e]">Symbol</div><div className="text-[#f3f4f6] text-sm font-semibold">{market.symbolDisplay}</div></div>
        <div><div className="text-[#8b949e]">Exchange</div><div className="text-[#f3f4f6] text-sm font-semibold uppercase">{market.exchange}</div></div>
        <div><div className="text-[#8b949e]">Last</div><div className="text-[#f3f4f6] text-sm font-semibold">{market.livePrice ? market.livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '...'}</div></div>
        <div><div className="text-[#8b949e]">24H</div><div className={market.change >= 0 ? 'text-[#00d084]' : 'text-[#ff4444]'}>{market.change >= 0 ? '+' : ''}{market.change.toFixed(2)} ({market.changePercent.toFixed(2)}%)</div></div>
        <div><div className="text-[#8b949e]">Vol</div><div className="text-[#f3f4f6]">{market.volume24h ? market.volume24h.toLocaleString() : '...'}</div></div>
        <div><div className="text-[#8b949e]">Feed</div><div className={market.connected ? 'text-[#00d084]' : 'text-[#ff4444]'}>{market.connected ? 'Connected' : 'Disconnected'}</div></div>
      </div>

      <div className="flex items-center gap-2">
        <button className="h-10 px-4 rounded-lg text-sm font-semibold text-[#f6a400] border border-[rgba(246,164,0,0.45)] bg-[#221706]">HUNT MODE</button>
        <select value={account.tier} onChange={(e) => setCurrentTier(e.target.value as any)} className="h-10 px-2 rounded-lg border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-xs text-[#f3f4f6]">
          <option value="free">Free</option><option value="pro">Pro</option><option value="elite">Elite</option>
        </select>
        <button onClick={() => setLayoutMode(ui.layoutMode === 'pro' ? 'normal' : 'pro')} className="h-10 px-3 rounded-lg border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-[11px] text-[#8b949e]">{ui.layoutMode === 'pro' ? 'Normal' : 'Pro'} Mode</button>
      </div>
    </header>
  );
}
