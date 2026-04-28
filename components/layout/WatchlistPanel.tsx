'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import { useStore } from '@/store/app-store';
import { getCoreMarkets, resolveRequestSymbol } from '@/lib/market/symbol-registry';
import { ExchangeId, MarketCategory } from '@/types/store';

type Row = {
  category: MarketCategory;
  exchange: ExchangeId;
  displaySymbol: string;
  requestSymbol: string;
  base: string;
  name: string;
  last: number;
  change: number;
  changePercent: number;
  volume: number;
  quoteVolume: number;
};

const exchanges: ExchangeId[] = ['binance', 'bybit', 'bitget', 'blofin', 'bitunix', 'coinbase'];

const RowItem = memo(function RowItem({ row, active, favored, onSelect, onFavorite }: { row: Row; active: boolean; favored: boolean; onSelect: () => void; onFavorite: () => void }) {
  return (
    <div onClick={onSelect} className={`h-8 grid grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.8fr] gap-2 items-center rounded-md px-2 cursor-pointer ${active ? 'bg-[#141e27] border border-[rgba(212,168,83,0.2)]' : 'hover:bg-[#121920]'}`}>
      <div className="flex items-center gap-2 min-w-0"><span className="truncate text-[#f3f4f6]">{row.displaySymbol}</span><button onClick={(e) => { e.stopPropagation(); onFavorite(); }} className={favored ? 'text-[#f6a400]' : 'text-[#4d5661]'}>★</button></div>
      <span className="text-[#f3f4f6] tabular-nums">{row.last ? row.last.toFixed(2) : '...'}</span>
      <span className={row.change >= 0 ? 'text-[#00d084]' : 'text-[#ff4444]'}>{row.change ? row.change.toFixed(2) : '...'}</span>
      <span className={row.changePercent >= 0 ? 'text-[#00d084]' : 'text-[#ff4444]'}>{row.changePercent ? `${row.changePercent.toFixed(2)}%` : '...'}</span>
      <span className="text-[#d8dde5]">{row.volume ? Math.round(row.volume).toLocaleString() : '...'}</span>
    </div>
  );
});

export function WatchlistPanel() {
  const { market, setMarketSelection } = useStore();
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [onlyFavs, setOnlyFavs] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wolvrene-favorites-v2');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('wolvrene-favorites-v2', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (market.category === 'crypto') {
        const res = await fetch(`/api/market/adapter?mode=top&exchange=${market.exchange}&limit=100`, { cache: 'no-store' });
        const json = await res.json();
        if (!active) return;
        setRows((json.rows || []).map((x: any) => ({ ...x, category: 'crypto' })));
        return;
      }

      const baseRows = getCoreMarkets().filter((x) => x.category === market.category).map((x) => ({ category: x.category, exchange: 'yahoo' as ExchangeId, displaySymbol: x.display, requestSymbol: resolveRequestSymbol(x.display, 'yahoo'), base: x.base, name: x.name, last: 0, change: 0, changePercent: 0, volume: 0, quoteVolume: 0 }));
      const updated = await Promise.all(baseRows.map(async (r) => {
        const t = await fetch(`/api/market/adapter?mode=ticker&exchange=yahoo&symbol=${encodeURIComponent(r.requestSymbol)}`, { cache: 'no-store' });
        const j = await t.json();
        return { ...r, last: j.row?.last || 0, change: j.row?.change || 0, changePercent: j.row?.changePercent || 0, volume: j.row?.volume || 0 };
      }));
      if (active) setRows(updated);
    }
    load();
    const poll = setInterval(load, market.category === 'crypto' ? 12000 : 20000);
    return () => { active = false; clearInterval(poll); };
  }, [market.exchange, market.category]);

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase();
    const key = `${r.exchange}:${r.requestSymbol}`;
    return (r.displaySymbol.toLowerCase().includes(q) || r.base.toLowerCase().includes(q)) && (!onlyFavs || favorites.includes(key));
  }), [rows, search, onlyFavs, favorites]);

  return (
    <section className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] overflow-hidden">
      <div className="sticky top-0 z-10 bg-[#0b1014] border-b border-[rgba(212,168,83,0.18)] p-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-[#f3f4f6]">WATCHLIST</span>
          {market.category === 'crypto' ? (
            <select value={market.exchange} onChange={(e) => setMarketSelection({ exchange: e.target.value as ExchangeId })} className="h-7 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.2)] px-2 text-[11px] text-[#d8dde5]">
              {exchanges.map((x) => <option key={x} value={x}>{x.toUpperCase()}</option>)}
            </select>
          ) : <span className="text-[11px] text-[#d8dde5]">YAHOO</span>}
        </div>

        <div className="flex items-center gap-2 text-[11px] overflow-x-auto">
          {(['crypto', 'forex', 'indices', 'commodities'] as MarketCategory[]).map((tab) => <button key={tab} onClick={() => setMarketSelection({ category: tab, exchange: tab === 'crypto' ? market.exchange : 'yahoo' })} className={`uppercase px-2 py-1 rounded ${market.category === tab ? 'text-[#f6a400] bg-[#111821]' : 'text-[#8b949e]'}`}>{tab}</button>)}
        </div>

        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="h-8 flex-1 rounded-md bg-[#070c11] border border-[rgba(212,168,83,0.14)] px-2 text-[12px] text-[#f3f4f6] outline-none" />
          <button onClick={() => setOnlyFavs((x) => !x)} className={`h-8 px-3 rounded-md border text-[12px] ${onlyFavs ? 'border-[#f6a400] text-[#f6a400]' : 'border-[rgba(212,168,83,0.14)] text-[#8b949e]'}`}>★</button>
        </div>

        <div className="text-[11px] text-[#8b949e] grid grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.8fr] gap-2"><span>Symbol</span><span>Last</span><span>Chg</span><span>Chg%</span><span>Vol</span></div>
      </div>

      <div className="px-2 pb-2 max-h-[330px] overflow-y-auto text-[12px]">
        {filtered.map((row) => {
          const key = `${row.exchange}:${row.requestSymbol}`;
          return (
            <RowItem
              key={key}
              row={row}
              active={market.symbolDisplay === row.displaySymbol && market.exchange === row.exchange}
              favored={favorites.includes(key)}
              onFavorite={() => setFavorites((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key])}
              onSelect={() => setMarketSelection({ category: row.category, exchange: row.exchange, displaySymbol: row.displaySymbol, requestSymbol: row.requestSymbol })}
            />
          );
        })}
      </div>
    </section>
  );
}
