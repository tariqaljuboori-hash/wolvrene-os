'use client';

import { useStore } from '@/store/app-store';
import { useMarketData } from '@/components/chart/useMarketData';

export function OrderPanel() {
  const { state } = useStore();
  
  // Get live market data for the current symbol
  const { marketData, loading } = useMarketData(
    state.currentExchangeSymbol,
    state.currentExchange
  );

  const symbol = state.currentSymbol || 'BTCUSDT.P';
  const price = marketData?.price || 0;
  const change = marketData?.change || 0;
  const changePercent = marketData?.changePercent || 0;

  return (
    <section className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3 text-sm">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-[#f3f4f6] text-2xl">₿ {symbol}</div>
          <div className="text-[#9aa4ae]">Perpetual · {state.currentExchange.toUpperCase()}</div>
        </div>
        <button className="px-2 py-1 rounded border border-[rgba(212,168,83,0.25)] bg-[#10151b]">20x ▾</button>
      </div>
      
      {/* Live price display */}
      {marketData && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[18px] font-bold text-[#f3f4f6]">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-[12px] ${change >= 0 ? 'text-[#00d084]' : 'text-[#ff4444]'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button className="h-10 rounded bg-[#0f6f4c] text-[#dff9ee]">LONG</button>
        <button className="h-10 rounded bg-[#4f1d1b] text-[#ffd8d6]">SHORT</button>
      </div>
      <div className="mt-2 flex justify-between text-[#b4bcc7]">{['Limit', 'Market', 'Stop', 'Trailing'].map((t, i) => <span key={t} className={i===0?'text-[#f6a400] border-b border-[#f6a400]':''}>{t}</span>)}</div>
      <div className="mt-3 space-y-2">
        <div className="grid grid-cols-[1fr_1.3fr_auto] gap-2 items-center"><span>Order Price</span><input defaultValue={price > 0 ? price.toFixed(2) : "76778.20"} className="h-9 rounded bg-[#10151b] border border-[rgba(212,168,83,0.22)] px-2"/><span>USDT</span></div>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 items-center"><span>Size</span><button className="h-9 rounded bg-[#10151b] border border-[rgba(212,168,83,0.22)]">BTC ▾</button><input defaultValue="0.01" className="h-9 rounded bg-[#10151b] border border-[rgba(212,168,83,0.22)] px-2"/></div>
        <div className="h-2 rounded bg-[#10151b] relative"><div className="absolute left-[28%] top-[-4px] w-3 h-3 rounded-full bg-[#f6a400]"/></div>
        <div className="grid grid-cols-5 text-center text-[#8b949e]">{['10%', '25%', '50%', '75%', '100%'].map((p)=> <span key={p}>{p}</span>)}</div>
        <div className="flex items-center justify-between"><span>TP / SL</span><span className="w-10 h-6 rounded-full bg-[#0f6f4c] inline-flex items-center"><span className="w-4 h-4 rounded-full bg-white ml-5"/></span></div>
        <div className="grid grid-cols-2 gap-2">
          <div><div className="text-[#8b949e]">Take Profit</div><input defaultValue={price > 0 ? (price * 1.025).toFixed(2) : "78,800.00"} className="h-9 w-full rounded bg-[#10151b] border border-[rgba(212,168,83,0.22)] px-2"/></div>
          <div><div className="text-[#8b949e]">Stop Loss</div><input defaultValue={price > 0 ? (price * 0.975).toFixed(2) : "75,200.00"} className="h-9 w-full rounded bg-[#10151b] border border-[rgba(212,168,83,0.22)] px-2"/></div>
        </div>
      </div>
      <button className="w-full h-11 mt-3 rounded bg-[#f6a400] text-[#201000] text-xl">Place Long Order</button>
      <div className="mt-2 flex justify-between text-[#8b949e] text-xs"><span>Cost: {price > 0 ? (0.01 * price).toFixed(2) : "38.39"} USDT</span><span>Est. Liq. Price: {price > 0 ? (price * 0.95).toFixed(2) : "72,450.10"}</span></div>
    </section>
  );
}
