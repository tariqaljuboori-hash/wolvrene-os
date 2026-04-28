'use client';

import { useStore } from '@/store/app-store';

export function BottomInsights() {
  const { brain, order, signals, news } = useStore();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-full text-sm">
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3 overflow-auto"><div className="text-[#f6a400] mb-2">WOLF FEED</div>{news.feed.slice(0, 4).map((n) => <p key={n.id} className="text-[#c8ced6] mb-2">{n.message}</p>)}{!news.feed.length && <p className="text-[#8b949e]">No feed events yet.</p>}</article>
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3 overflow-auto"><div className="text-[#f6a400] mb-2">SIGNALS</div>{signals.history.slice(0, 5).map((s) => <div key={s.id} className="grid grid-cols-4 h-7 items-center text-xs"><span>{s.symbol}</span><span>{s.direction.toUpperCase()}</span><span>{s.confidence}%</span><span>{new Date(s.timestamp).toLocaleTimeString()}</span></div>)}{!signals.history.length && <p className="text-[#8b949e]">No signals yet.</p>}</article>
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3 overflow-auto"><div className="text-[#f6a400] mb-2">POSITIONS</div>{order.positions.slice(0, 4).map((p) => <div key={p.id} className="text-xs mb-2">{p.symbol} {p.side.toUpperCase()} · Size {p.quantity} · Entry {p.entryPrice.toFixed(2)}</div>)}{!order.positions.length && <p className="text-[#8b949e]">No open positions.</p>}</article>
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3 overflow-auto"><div className="text-[#f6a400] mb-2">DECISION BRAIN</div><div className="text-[#00d084] text-2xl">{brain.confidence}%</div><div className="text-xs text-[#c8ced6] mt-2">Lifecycle: {brain.lifecycle}</div><div className="text-xs text-[#8b949e] mt-1">Quality: {brain.setupQuality}</div><div className="text-xs text-[#8b949e] mt-1">{brain.nextAction}</div></article>
    </section>
  );
}
