'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/store/app-store';
import { Candle } from './ChartTypes';

function normalizeCandles(rows: Candle[]) {
  const map = new Map<number, Candle>();
  rows.forEach((c) => {
    const t = Number(c.time);
    const ms = t < 1000000000000 ? t * 1000 : t;
    if (!Number.isFinite(ms)) return;
    map.set(ms, { ...c, time: ms });
  });
  return Array.from(map.values()).sort((a, b) => a.time - b.time);
}

export function useMarketCandles() {
  const { market, setMarketSnapshot } = useStore();
  const [candles, setCandles] = useState<Candle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchCandles = async () => {
      try {
        setError(null);
        const res = await fetch(`/api/market/adapter?mode=candles&exchange=${market.exchange}&symbol=${encodeURIComponent(market.symbolRequest)}&timeframe=${market.timeframe}&limit=300`, { cache: 'no-store' });
        const json = await res.json();
        if (!active) return;
        const rows = normalizeCandles(json.rows || []);
        setCandles(rows);
        setMarketSnapshot({ connected: true, loading: false, error: rows.length ? null : 'No candle data' });
      } catch {
        if (!active) return;
        setCandles([]);
        setError('Failed to load candles');
        setMarketSnapshot({ connected: false, loading: false, error: 'Failed to load candles' });
      }
    };

    fetchCandles();
    const poll = setInterval(fetchCandles, 12000);
    return () => { active = false; clearInterval(poll); };
  }, [market.exchange, market.symbolRequest, market.timeframe]);

  return useMemo(() => ({ candles, connected: market.connected, error }), [candles, market.connected, error]);
}
