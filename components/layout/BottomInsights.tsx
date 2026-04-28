'use client';

import { useStore } from '@/store/app-store';

export function BottomInsights() {
  const { market, signals } = useStore();
  const quality = signals.confidence >= 70 ? 'High' : signals.confidence >= 45 ? 'Moderate' : 'Low';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-2 h-full text-sm">
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3"><div className="text-[#f6a400] mb-2">Current Bias</div><div className="text-[#f3f4f6]">{market.change >= 0 ? 'Bullish drift' : 'Bearish pressure'} on {market.symbolDisplay} ({market.timeframe}).</div></article>
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3"><div className="text-[#f6a400] mb-2">Why Waiting</div><div className="text-[#c8ced6]">Decision Brain state: {signals.lifecycle}. Awaiting stronger structural confirmation before execution.</div></article>
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3"><div className="text-[#f6a400] mb-2">Setup Quality</div><div className="text-[#f3f4f6]">{quality} ({signals.confidence}%)</div><div className="text-[#8b949e] mt-2">{signals.explanation}</div></article>
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3"><div className="text-[#f6a400] mb-2">Risk Warning</div><div className="text-[#c8ced6]">No profit guarantee. Respect position sizing and avoid oversized leverage.</div></article>
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3"><div className="text-[#f6a400] mb-2">Session Context</div><div className="text-[#c8ced6]">Feed: {market.connected ? 'Live' : 'Syncing'} · Exchange aligned: {market.exchange.toUpperCase()} · Last update: {market.lastUpdate ? new Date(market.lastUpdate).toLocaleTimeString() : '...'}.</div></article>
    </section>
  );
}
