'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/app-store';

export function OrderPanel() {
  const { market, order, setOrderType, setOrderInputs, placeOrder } = useStore();

  useEffect(() => {
    if (!order.priceInput && market.livePrice) setOrderInputs({ priceInput: market.livePrice, tp: market.livePrice * 1.02, sl: market.livePrice * 0.98 });
  }, [market.livePrice]);

  const cost = (order.size || 0) * (order.priceInput || market.livePrice || 0) / order.leverage;
  const liq = order.sl ?? (order.priceInput || market.livePrice) * (order.leverage > 1 ? 1 - 1 / (order.leverage * 1.4) : 0.9);

  return (
    <section className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3 text-sm">
      <div className="flex justify-between items-center"><div><div className="text-[#f3f4f6] text-xl">{market.symbolDisplay}</div><div className="text-[#9aa4ae]">{order.paperMode ? 'Paper Mode' : 'Broker Connected'} · {market.exchange.toUpperCase()}</div></div><select value={order.leverage} onChange={(e) => setOrderInputs({ leverage: Number(e.target.value) })} className="px-2 py-1 rounded border border-[rgba(212,168,83,0.25)] bg-[#10151b]">{[1,5,10,20,30,50].map((x) => <option key={x} value={x}>{x}x</option>)}</select></div>
      <div className="mt-2 flex items-center gap-2"><span className="text-[18px] font-bold text-[#f3f4f6]">{market.livePrice ? `$${market.livePrice.toFixed(2)}` : '...'}</span><span className={`text-[12px] ${market.change >= 0 ? 'text-[#00d084]' : 'text-[#ff4444]'}`}>{market.changePercent.toFixed(2)}%</span></div>
      <div className="grid grid-cols-2 gap-2 mt-3"><button onClick={() => placeOrder('buy')} className="h-10 rounded bg-[#0f6f4c] text-[#dff9ee]">LONG</button><button onClick={() => placeOrder('sell')} className="h-10 rounded bg-[#4f1d1b] text-[#ffd8d6]">SHORT</button></div>
      <div className="mt-2 flex justify-between text-[#b4bcc7]">{(['limit','market','stop','trailing'] as const).map((t) => <button key={t} onClick={() => setOrderType(t)} className={order.orderType===t?'text-[#f6a400] border-b border-[#f6a400]':'text-[#8b949e]'}>{t.toUpperCase()}</button>)}</div>
      <div className="mt-3 space-y-2">
        <div className="grid grid-cols-[1fr_1.3fr_auto] gap-2 items-center"><span>Order Price</span><input value={order.priceInput} onChange={(e) => setOrderInputs({ priceInput: Number(e.target.value) })} className="h-9 rounded bg-[#10151b] border border-[rgba(212,168,83,0.22)] px-2"/><span>USDT</span></div>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 items-center"><span>Size</span><span className="h-9 rounded bg-[#10151b] border border-[rgba(212,168,83,0.22)] grid place-items-center">{market.symbolDisplay.replace('USDT.P','')}</span><input value={order.size} onChange={(e) => setOrderInputs({ size: Number(e.target.value) })} className="h-9 rounded bg-[#10151b] border border-[rgba(212,168,83,0.22)] px-2"/></div>
        <div className="grid grid-cols-2 gap-2"><div><div className="text-[#8b949e]">Take Profit</div><input value={order.tp ?? 0} onChange={(e)=>setOrderInputs({tp:Number(e.target.value)})} className="h-9 w-full rounded bg-[#10151b] border border-[rgba(212,168,83,0.22)] px-2"/></div><div><div className="text-[#8b949e]">Stop Loss</div><input value={order.sl ?? 0} onChange={(e)=>setOrderInputs({sl:Number(e.target.value)})} className="h-9 w-full rounded bg-[#10151b] border border-[rgba(212,168,83,0.22)] px-2"/></div></div>
      </div>
      <div className="mt-2 flex justify-between text-[#8b949e] text-xs"><span>Cost: {Number.isFinite(cost) ? cost.toFixed(2) : '0.00'} USDT</span><span>Est. Liq: {Number.isFinite(liq) ? liq.toFixed(2) : '...'} </span></div>
    </section>
  );
}
