'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/store/app-store';
import {
  NON_CRYPTO_MARKETS,
  MarketCategory,
} from '@/components/chart/marketUniverse';
import { ExchangeId } from '@/types/store';

type Exchange = ExchangeId;

type Ticker = {
  exchange: Exchange;
  symbol: string;
  display: string;
  base: string;
  last: number;
  chg: number;
  chgP: number;
  volume: number;
  quoteVolume: number;
};

const exchanges: { id: Exchange; label: string }[] = [
  { id: 'binance', label: 'Binance' },
  { id: 'bybit', label: 'Bybit' },
  { id: 'bitget', label: 'Bitget' },
  { id: 'blofin', label: 'BloFin' },
  { id: 'bitunix', label: 'Bitunix' },
  { id: 'coinbase', label: 'Coinbase' },
];

function n(v: unknown) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

function formatPrice(v: number) {
  if (!Number.isFinite(v) || v === 0) return '...';
  if (v >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (v >= 1) return v.toFixed(2);
  return v.toFixed(5);
}

function formatVolume(v: number) {
  if (!Number.isFinite(v) || v === 0) return '...';
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K`;
  return v.toFixed(2);
}

function logo(base: string) {
  return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${base.toLowerCase()}.png`;
}

function normalizeBase(symbol: string) {
  return symbol
    .replace('-SWAP', '')
    .replace('-PERP', '')
    .replace('_UMCBL', '')
    .replace('USDT', '')
    .replace('USDC', '')
    .replace('USD', '')
    .replace(/-/g, '');
}

async function fetchExchange(exchange: Exchange): Promise<Ticker[]> {
  if (exchange === 'binance') {
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
      cache: 'no-store',
    });
    const data = await res.json();

    return Array.isArray(data)
      ? data
          .filter(
            (x: any) =>
              x.symbol?.endsWith('USDT') &&
              !x.symbol.includes('UP') &&
              !x.symbol.includes('DOWN')
          )
          .map((x: any) => ({
            exchange,
            symbol: x.symbol,
            display: `${x.symbol}.P`,
            base: normalizeBase(x.symbol),
            last: n(x.lastPrice),
            chg: n(x.priceChange),
            chgP: n(x.priceChangePercent),
            volume: n(x.volume),
            quoteVolume: n(x.quoteVolume),
          }))
          .sort((a: Ticker, b: Ticker) => b.quoteVolume - a.quoteVolume)
          .slice(0, 100)
      : [];
  }

  if (exchange === 'bybit') {
    const res = await fetch(
      'https://api.bybit.com/v5/market/tickers?category=linear',
      { cache: 'no-store' }
    );
    const json = await res.json();

    return (json.result?.list || [])
      .filter((x: any) => x.symbol?.endsWith('USDT'))
      .map((x: any) => ({
        exchange,
        symbol: x.symbol,
        display: `${x.symbol}.P`,
        base: normalizeBase(x.symbol),
        last: n(x.lastPrice),
        chg: n(x.lastPrice) - n(x.prevPrice24h),
        chgP: n(x.price24hPcnt) * 100,
        volume: n(x.volume24h),
        quoteVolume: n(x.turnover24h),
      }))
      .sort((a: Ticker, b: Ticker) => b.quoteVolume - a.quoteVolume)
      .slice(0, 100);
  }

  if (exchange === 'bitget') {
    const res = await fetch(
      'https://api.bitget.com/api/v2/mix/market/tickers?productType=USDT-FUTURES',
      { cache: 'no-store' }
    );
    const json = await res.json();

    return (json.data || [])
      .filter((x: any) => x.symbol?.endsWith('USDT'))
      .map((x: any) => {
        const last = n(x.lastPr || x.last || x.close);
        const open = n(x.openUtc || x.open24h || x.open || last);
        const chg = last - open;

        return {
          exchange,
          symbol: x.symbol,
          display: `${x.symbol}.P`,
          base: normalizeBase(x.symbol),
          last,
          chg,
          chgP: open ? (chg / open) * 100 : n(x.changeUtc24h) * 100,
          volume: n(x.baseVolume || x.baseVol || x.volume24h),
          quoteVolume: n(x.quoteVolume || x.quoteVol || x.usdtVolume),
        };
      })
      .sort((a: Ticker, b: Ticker) => b.quoteVolume - a.quoteVolume)
      .slice(0, 100);
  }

  if (exchange === 'blofin') {
    const res = await fetch('https://openapi.blofin.com/api/v1/market/tickers', {
      cache: 'no-store',
    });
    const json = await res.json();

    return (json.data || [])
      .filter((x: any) => x.instId?.includes('USDT'))
      .map((x: any) => {
        const symbol = String(x.instId).replace(/-/g, '');
        const last = n(x.last);
        const open = n(x.open24h || last);
        const chg = last - open;

        return {
          exchange,
          symbol,
          display: `${symbol}.P`,
          base: normalizeBase(symbol),
          last,
          chg,
          chgP: open ? (chg / open) * 100 : 0,
          volume: n(x.volCurrency24h || x.vol24h),
          quoteVolume: n(x.vol24h),
        };
      })
      .sort((a: Ticker, b: Ticker) => b.quoteVolume - a.quoteVolume)
      .slice(0, 100);
  }

  if (exchange === 'bitunix') {
    const res = await fetch(
      'https://fapi.bitunix.com/api/v1/futures/market/tickers',
      { cache: 'no-store' }
    );
    const json = await res.json();

    return (json.data || [])
      .filter((x: any) => x.symbol?.endsWith('USDT'))
      .map((x: any) => {
        const last = n(x.lastPrice || x.last || x.close);
        const open = n(x.openPrice || x.open24h || last);
        const chg = n(x.priceChange || last - open);

        return {
          exchange,
          symbol: x.symbol,
          display: `${x.symbol}.P`,
          base: normalizeBase(x.symbol),
          last,
          chg,
          chgP: n(x.priceChangePercent || (open ? (chg / open) * 100 : 0)),
          volume: n(x.volume || x.baseVolume),
          quoteVolume: n(x.quoteVolume || x.turnover),
        };
      })
      .sort((a: Ticker, b: Ticker) => b.quoteVolume - a.quoteVolume)
      .slice(0, 100);
  }

  if (exchange === 'coinbase') {
    const res = await fetch('https://api.exchange.coinbase.com/products', {
      cache: 'no-store',
    });
    const products = await res.json();

    const top = Array.isArray(products)
      ? products
          .filter((x: any) => x.quote_currency === 'USD' && x.status === 'online')
          .slice(0, 60)
      : [];

    const rows = await Promise.all(
      top.map(async (p: any) => {
        try {
          const [tickerRes, statsRes] = await Promise.all([
            fetch(`https://api.exchange.coinbase.com/products/${p.id}/ticker`, {
              cache: 'no-store',
            }),
            fetch(`https://api.exchange.coinbase.com/products/${p.id}/stats`, {
              cache: 'no-store',
            }),
          ]);

          const ticker = await tickerRes.json();
          const stats = await statsRes.json();

          const last = n(ticker.price);
          const open = n(stats.open || last);
          const chg = last - open;
          const symbol = `${p.base_currency}USD`;

          return {
            exchange,
            symbol,
            display: `${symbol}.P`,
            base: p.base_currency,
            last,
            chg,
            chgP: open ? (chg / open) * 100 : 0,
            volume: n(stats.volume || ticker.volume),
            quoteVolume: n(stats.volume || ticker.volume) * last,
          };
        } catch {
          return null;
        }
      })
    );

    return rows
      .filter(Boolean)
      .sort((a: any, b: any) => b.quoteVolume - a.quoteVolume)
      .slice(0, 100) as Ticker[];
  }

  return [];
}

export function WatchlistPanel() {
  const store = useStore();

  const [category, setCategory] = useState<MarketCategory>('crypto');
  const [exchange, setExchange] = useState<Exchange>('binance');
  const [rows, setRows] = useState<Ticker[]>([]);
  const [search, setSearch] = useState('');
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    const saved = localStorage.getItem('wolvrene-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('wolvrene-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (category !== 'crypto') {
      setRows([]);
      setStatus('live');
      return;
    }

    let alive = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function load() {
      try {
        if (!rows.length) setStatus('loading');

        const data = await fetchExchange(exchange);
        if (!alive) return;

        setRows(data);
        setStatus(data.length ? 'live' : 'error');
      } catch {
        if (alive) setStatus('error');
      }
    }

    setRows([]);
    load();
    timer = setInterval(load, 3000);

    return () => {
      alive = false;
      if (timer) clearInterval(timer);
    };
  }, [exchange, category]);

  const marketRows = useMemo<Ticker[]>(() => {
    if (category === 'crypto') return rows;

    return NON_CRYPTO_MARKETS.filter((x) => x.category === category).map((x) => ({
      exchange: 'yahoo' as Exchange,
      symbol: x.symbol,
      display: x.display,
      base: x.base,
      last: 0,
      chg: 0,
      chgP: 0,
      volume: 0,
      quoteVolume: 0,
    }));
  }, [category, rows]);

  const filtered = useMemo(() => {
    return marketRows
      .filter((r) => {
        const q = search.toLowerCase();
        const favKey = `${r.exchange}:${r.symbol}`;

        return (
          (r.symbol.toLowerCase().includes(q) ||
            r.base.toLowerCase().includes(q) ||
            r.display.toLowerCase().includes(q)) &&
          (!onlyFavs || favorites.includes(favKey))
        );
      })
      .sort((a, b) => {
        const af = favorites.includes(`${a.exchange}:${a.symbol}`) ? 1 : 0;
        const bf = favorites.includes(`${b.exchange}:${b.symbol}`) ? 1 : 0;
        return bf - af || b.quoteVolume - a.quoteVolume;
      });
  }, [marketRows, search, onlyFavs, favorites]);

  function selectSymbol(row: Ticker) {
    store.setCurrentSymbol(row.display, row.symbol, row.exchange);
  }

  function toggleFavorite(row: Ticker) {
    const key = `${row.exchange}:${row.symbol}`;

    setFavorites((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  }

  return (
    <section className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] overflow-hidden">
      <div className="h-11 px-3 flex items-center justify-between border-b border-[rgba(212,168,83,0.18)]">
        <div className="flex items-center gap-2">
          <span className="text-[15px] text-[#f3f4f6]">WATCHLIST</span>
          <span
            className={
              status === 'live'
                ? 'text-[9px] text-[#00d084]'
                : 'text-[9px] text-[#ff4444]'
            }
          >
            {status === 'live' ? 'LIVE' : status.toUpperCase()}
          </span>
        </div>

        {category === 'crypto' ? (
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value as Exchange)}
            className="h-7 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.2)] px-2 text-[11px] text-[#d8dde5]"
          >
            {exchanges.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="h-7 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.2)] px-2 flex items-center text-[11px] text-[#d8dde5]">
            Yahoo
          </div>
        )}
      </div>

      <div className="px-3 h-9 flex items-center gap-3 text-[12px] border-b border-[rgba(212,168,83,0.12)]">
        {(['crypto', 'forex', 'indices', 'commodities'] as MarketCategory[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => {
                setCategory(tab);
                setSearch('');
              }}
              className={
                category === tab
                  ? 'text-[#f6a400] border-b border-[#f6a400] pb-1 uppercase'
                  : 'text-[#8b949e] uppercase hover:text-[#f3f4f6]'
              }
            >
              {tab}
            </button>
          )
        )}
      </div>

      <div className="px-3 py-2 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            category === 'crypto'
              ? 'Search coin...'
              : `Search ${category}...`
          }
          className="h-8 flex-1 rounded-md bg-[#070c11] border border-[rgba(212,168,83,0.14)] px-2 text-[12px] text-[#f3f4f6] outline-none"
        />

        <button
          onClick={() => setOnlyFavs((v) => !v)}
          className={`h-8 px-3 rounded-md border text-[12px] ${
            onlyFavs
              ? 'border-[#f6a400] text-[#f6a400]'
              : 'border-[rgba(212,168,83,0.14)] text-[#8b949e]'
          }`}
        >
          ★
        </button>
      </div>

      <div className="px-3 py-2 text-[11px] text-[#8b949e] grid grid-cols-[1.35fr_0.85fr_0.8fr_0.8fr_0.9fr] gap-2">
        <span>Symbol</span>
        <span>Last</span>
        <span>Chg</span>
        <span>Chg%</span>
        <span>Volume</span>
      </div>

      <div className="px-2 pb-2 max-h-[305px] overflow-y-auto text-[12px]">
        {filtered.map((row) => {
          const up = row.chg >= 0;
          const fav = favorites.includes(`${row.exchange}:${row.symbol}`);

          return (
            <div
              key={`${row.exchange}:${row.symbol}`}
              onClick={() => selectSymbol(row)}
              className="h-8 grid grid-cols-[1.35fr_0.85fr_0.8fr_0.8fr_0.9fr] gap-2 items-center rounded-md px-2 hover:bg-[#121920] cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                {category === 'crypto' ? (
                  <img
                    src={logo(row.base)}
                    alt={row.base}
                    className="w-4 h-4 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-[#151b22] border border-[rgba(212,168,83,0.25)] flex items-center justify-center text-[8px] text-[#f6a400]">
                    W
                  </span>
                )}

                <span className="truncate text-[#f3f4f6]">{row.display}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(row);
                  }}
                  className={fav ? 'text-[#f6a400]' : 'text-[#4d5661]'}
                >
                  ★
                </button>
              </div>

              <span className="text-[#f3f4f6] tabular-nums">
                {formatPrice(row.last)}
              </span>

              <span className={up ? 'text-[#00d084]' : 'text-[#ff4444]'}>
                {row.chg ? row.chg.toFixed(2) : '...'}
              </span>

              <span className={up ? 'text-[#00d084]' : 'text-[#ff4444]'}>
                {row.chgP ? `${row.chgP.toFixed(2)}%` : '...'}
              </span>

              <span className="text-[#d8dde5]">{formatVolume(row.volume)}</span>
            </div>
          );
        })}

        {!filtered.length && (
          <div className="h-20 flex items-center justify-center text-[12px] text-[#8b949e]">
            No markets found.
          </div>
        )}
      </div>
    </section>
  );
}