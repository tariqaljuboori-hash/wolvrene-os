'use client';

import { useStore } from '@/store/app-store';

export function OrderPanel() {
  const { market } = useStore();
  const price = market.livePrice;

  return (
    <section className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3 text-sm">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-[#f3f4f6] text-xl">{market.symbolDisplay}</div>
          <div className="text-[#9aa4ae]">Perpetual · {market.exchange.toUpperCase()}</div>
        </div>
        <button className="px-2 py-1 rounded border border-[rgba(212,168,83,0.25)] bg-[#10151b]">20x ▾</button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-[18px] font-bold text-[#f3f4f6]">{price ? `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '...'}</span>
        <span className={`text-[12px] ${market.change >= 0 ? 'text-[#00d084]' : 'text-[#ff4444]'}`}>{market.change >= 0 ? '+' : ''}{market.change.toFixed(2)} ({market.changePercent.toFixed(2)}%)</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <button className="h-10 rounded bg-[#0f6f4c] text-[#dff9ee]">LONG</button>
        <button className="h-10 rounded bg-[#4f1d1b] text-[#ffd8d6]">SHORT</button>
      </div>
      <button className="w-full h-10 mt-3 rounded bg-[#f6a400] text-[#201000]">Place Order</button>
    </section>
  );
}
