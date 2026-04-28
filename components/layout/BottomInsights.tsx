'use client';

export function BottomInsights() {
  return (
    <section className="grid grid-cols-4 gap-2 h-full text-sm">
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3">
        <div className="text-[#f6a400] mb-2">WOLF FEED</div>
        <div className="space-y-3 text-[#c8ced6]">
          <p><span className="text-[#8b949e]">26 MAY 2024</span> <span className="text-[#00d084]">LONG</span> BTCUSDT.P <span className="text-[#00d084]">+1,208.50 USDT</span><br/>Good entry on liquidity sweep and BOS confirmation.</p>
          <p><span className="text-[#8b949e]">26 MAY 2024</span> <span className="text-[#00d084]">LONG</span> ETHUSDT.P <span className="text-[#00d084]">+645.20 USDT</span><br/>AI signal was accurate. Strong follow through.</p>
          <p><span className="text-[#8b949e]">25 MAY 2024</span> <span className="text-[#ff4444]">SHORT</span> SOLUSDT.P <span className="text-[#ff4444]">-210.30 USDT</span><br/>Exited early. Market turned against the position.</p>
        </div>
      </article>
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3">
        <div className="text-[#f6a400] mb-2">TOP AI SIGNALS</div>
        <div className="grid grid-cols-4 text-[#8b949e] mb-2"><span>Symbol</span><span>Direction</span><span>Confidence</span><span>Time</span></div>
        {[
          ['BTCUSDT.P','LONG','68%','3m ago'],['ETHUSDT.P','LONG','62%','5m ago'],['SOLUSDT.P','LONG','60%','8m ago'],['XRPUSDT.P','LONG','58%','10m ago'],['BNBUSDT.P','SHORT','55%','12m ago']
        ].map((r) => <div key={r[0]} className="grid grid-cols-4 h-8 items-center"><span>{r[0]}</span><span className={r[1]==='SHORT'?'text-[#ff4444]':'text-[#00d084]'}>{r[1]}</span><span>{r[2]}</span><span>{r[3]}</span></div>)}
      </article>
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3">
        <div className="text-[#f6a400] mb-2">POSITIONS (2)</div>
        <div className="space-y-3">
          <div>BTCUSDT.P LONG 20x <span className="text-[#00d084]">+3,057.20 USDT (+12.4%)</span><div className="text-[#8b949e]">Size 4,000 · Entry 77,473.90 · Liq 72,450.10</div></div>
          <div>ETHUSDT.P LONG 20x <span className="text-[#00d084]">+312.10 USDT (+11.5%)</span><div className="text-[#8b949e]">Size 3,000 · Entry 3,512.20 · Liq 3,120.30</div></div>
        </div>
      </article>
      <article className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3">
        <div className="text-[#f6a400] mb-2">PERFORMANCE</div>
        <div className="text-[#00d084] text-3xl">+3,274.69 USDT</div>
        <div className="grid grid-cols-3 text-[#8b949e] mt-2"><span>Win Rate<br/><b className="text-[#f3f4f6]">68.23%</b></span><span>Total Trades<br/><b className="text-[#f3f4f6]">124</b></span><span>Profit Factor<br/><b className="text-[#f3f4f6]">1.87</b></span></div>
        <svg viewBox="0 0 260 80" className="w-full h-20 mt-3"><path d="M0 75 L20 70 L40 68 L60 64 L80 61 L100 58 L120 62 L140 54 L160 45 L180 43 L200 34 L220 28 L240 26 L260 6" fill="none" stroke="#f6a400" strokeWidth="2.5"/><path d="M0 75 L260 75" stroke="#2f3942"/></svg>
      </article>
    </section>
  );
}
