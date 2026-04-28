'use client';

const tabs = ['WOLF FEED', 'JOURNAL', 'POSITIONS (2)', 'ORDERS', 'SIGNALS', 'BACKTESTER', 'LIQUIDITY MAP', 'MARKET SCANNER', 'COMMUNITY CHAT'];

export function BottomDock() {
  return (
    <div className="h-14 rounded-xl border border-[rgba(212,168,83,0.22)] bg-[#0b1014] px-3 flex items-center justify-between">
      <div className="flex gap-1 text-sm overflow-x-auto">
        {tabs.map((tab, i) => (
          <button key={tab} className={`h-10 px-3 rounded-md whitespace-nowrap ${i === 0 ? 'bg-[#131b23] text-[#f6a400] border border-[rgba(212,168,83,0.35)]' : 'text-[#c3cad3]'}`}>{tab}</button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-sm">{['1D', '7D', '30D', '90D', '+'].map((r, i) => <button key={r} className={`h-9 px-3 rounded ${i===1?'bg-[#3b2c08] text-[#f6a400]':'bg-[#10151b] text-[#b2bac5]'}`}>{r}</button>)}</div>
    </div>
  );
}
