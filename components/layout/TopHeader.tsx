'use client';

import Image from 'next/image';
import { useStore } from '@/store/app-store';
import { useMarketData } from '@/components/chart/useMarketData';

export function TopHeader() {
  const { market, ui, subscription, setLayoutMode, setTier, setHuntMode, pushNews } = useStore();
  useMarketData();

  return (
    <header className="h-auto lg:h-20 p-2 lg:px-4 bg-[#050607] border-b border-[rgba(212,168,83,0.22)] flex flex-col lg:flex-row lg:items-center gap-2">
      <div className="h-14 lg:h-full w-full lg:w-[320px] flex items-center gap-3 rounded-xl px-3 bg-[#070b10] border border-[rgba(212,168,83,0.18)]">
        <Image src="/wolvrene-logo.png" alt="Wolvrene OS logo" width={36} height={36} className="rounded-md object-contain" />
        <div><div className="text-[22px] lg:text-[30px] tracking-[-0.06em] font-semibold leading-none"><span className="text-[#f3f4f6]">WOLV</span><span className="text-[#d4a853]">RENE</span></div><div className="text-[10px] uppercase tracking-[0.2em] text-[#9aa4ae]">AI Precision Trading</div></div>
      </div>

      <div className="flex-1 rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] px-3 py-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
        <div><div className="text-[#8b949e]">Symbol</div><div className="text-[#f3f4f6] text-sm font-semibold">{market.symbolDisplay}</div></div>
        <div><div className="text-[#8b949e]">Exchange</div><div className="text-[#f3f4f6] text-sm font-semibold uppercase">{market.exchange}</div></div>
        <div><div className="text-[#8b949e]">Last</div><div className="text-[#f3f4f6] text-sm font-semibold">{market.livePrice ? market.livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '...'}</div></div>
        <div><div className="text-[#8b949e]">24H High</div><div className="text-[#f3f4f6]">{market.high24h ? market.high24h.toFixed(2) : '...'}</div></div>
        <div><div className="text-[#8b949e]">24H Low</div><div className="text-[#f3f4f6]">{market.low24h ? market.low24h.toFixed(2) : '...'}</div></div>
        <div><div className="text-[#8b949e]">Vol</div><div className="text-[#f3f4f6]">{market.volume24h ? market.volume24h.toLocaleString() : '...'}</div></div>
        <div><div className="text-[#8b949e]">Funding</div><div className="text-[#f3f4f6]">{market.funding ? `${market.funding.toFixed(4)}%` : 'N/A'}</div></div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <button onClick={() => setHuntMode(!ui.huntMode)} className={`h-10 px-4 rounded-lg text-sm font-semibold border ${ui.huntMode ? 'text-[#050607] bg-[#f6a400] border-[#f6a400]' : 'text-[#f6a400] border-[rgba(246,164,0,0.45)] bg-[#221706]'}`}>HUNT MODE</button>
        {['Search','Alerts','Settings'].map((x) => <button key={x} onClick={() => pushNews(`${x} opened for ${market.symbolDisplay}`)} className="h-10 px-3 rounded border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-[#d5dae0] text-xs">{x}</button>)}
        <select value={subscription.tier} onChange={(e) => setTier(e.target.value as any)} className="h-10 px-2 rounded-lg border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-xs text-[#f3f4f6]"><option value="free">Free</option><option value="pro">Pro</option><option value="elite">Elite</option></select>
        <button onClick={() => setLayoutMode(ui.layoutMode === 'pro' ? 'normal' : 'pro')} className="h-10 px-3 rounded-lg border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-[11px] text-[#8b949e]">{ui.layoutMode === 'pro' ? 'Normal' : 'Pro'} Mode</button>
      </div>
    </header>
  );
}
