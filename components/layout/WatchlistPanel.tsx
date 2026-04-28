'use client';

const rows = [
  ['BTCUSDT.P', '76,778.20', '176.90', '0.23%', '54.53K', true],
  ['ETHUSDT.P', '3,573.21', '45.32', '1.28%', '312.21K', false],
  ['SOLUSDT.P', '172.48', '2.47', '1.45%', '123.41K', false],
  ['BNBUSDT.P', '595.19', '-1.21', '-0.20%', '32.11K', false],
  ['XRPUSDT.P', '0.6049', '0.0088', '1.48%', '65.23M', false],
  ['ADAUSDT.P', '0.7258', '0.0101', '1.41%', '18.21M', false],
  ['DOGEUSDT.P', '0.14123', '0.00182', '1.30%', '142.11M', false],
] as const;

export function WatchlistPanel() {
  return (
    <section className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] overflow-hidden">
      <div className="h-11 px-3 flex items-center justify-between border-b border-[rgba(212,168,83,0.18)] text-[#f3f4f6]">
        <span className="text-lg">WATCHLIST</span>
        <div className="text-lg">＋ ⋯</div>
      </div>
      <div className="px-3 h-10 flex items-center gap-3 text-sm border-b border-[rgba(212,168,83,0.12)]">
        <span className="text-[#f6a400] border-b border-[#f6a400] pb-1">CRYPTO</span><span>FOREX</span><span>INDICES</span><span>COMMODITIES</span>
      </div>
      <div className="px-3 py-2 text-sm text-[#8b949e] grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_1fr] gap-2">
        <span>Symbol</span><span>Last</span><span>Chg</span><span>Chg%</span><span>Volume</span>
      </div>
      <div className="px-3 pb-2 space-y-1 text-sm">
        {rows.map(([symbol, last, chg, chgP, vol, star], i) => {
          const up = !chg.startsWith('-');
          return (
            <div key={symbol} className="h-9 grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_1fr] gap-2 items-center rounded px-1 hover:bg-[#121920]">
              <span className="text-[#f3f4f6]">{['🟠','🟣','🟢','🟡','🔵','🔷','🟤'][i]} {symbol} {star && '★'}</span>
              <span>{last}</span>
              <span className={up ? 'text-[#00d084]' : 'text-[#ff4444]'}>{chg}</span>
              <span className={up ? 'text-[#00d084]' : 'text-[#ff4444]'}>{chgP}</span>
              <span>{vol}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
