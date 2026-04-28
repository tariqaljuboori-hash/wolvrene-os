'use client';

export function StatusNewsBar() {
  return (
    <footer className="h-11 px-4 border-t border-[rgba(212,168,83,0.22)] bg-[#070c11] text-sm flex items-center justify-between">
      <div className="flex items-center gap-5 text-[#c3cad3]">
        <span className="text-[#f6a400]">WOLVRENE AI ENGINE v2.2.1</span>
        <span className="text-[#00d084]">● Connected</span>
        <span>DATA FEED: BINANCE</span>
        <span>Ping: <span className="text-[#00d084]">128ms</span></span>
        <span>Time: 15:24:45 (UTC+3)</span>
        <span><b className="text-[#f6a400]">WOLVRENE NEWS:</b> New Strategy Pack Available Now!</span>
      </div>
      <div className="flex gap-3 text-[#8b949e]"><span>f</span><span>𝕏</span><span>◉</span><span>✉</span></div>
    </footer>
  );
}
