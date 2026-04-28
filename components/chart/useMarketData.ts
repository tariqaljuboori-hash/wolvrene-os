'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/app-store';

export function useMarketData() {
  const { market, setMarketSnapshot } = useStore();
  const inFlight = useRef(false);

  useEffect(() => {
    let active = true;
    const fetchTicker = async () => {
      if (inFlight.current) return;
      inFlight.current = true;
      try {
        const started = Date.now();
        const res = await fetch(`/api/market/adapter?mode=ticker&exchange=${market.exchange}&symbol=${encodeURIComponent(market.symbolRequest)}`, { cache: 'no-store' });
        const json = await res.json();
        if (!active) return;
        const row = json.row;
        if (!row) {
          setMarketSnapshot({ loading: false, connected: false, error: 'Ticker unavailable' });
          return;
        }
        setMarketSnapshot({ livePrice: Number(row.last) || 0, change: Number(row.change) || 0, changePercent: Number(row.changePercent) || 0, high24h: Number(row.high24h) || 0, low24h: Number(row.low24h) || 0, volume24h: Number(row.volume) || 0, funding: Number(row.funding) || 0, connected: true, loading: false, error: null });
      } catch {
        if (active) setMarketSnapshot({ loading: false, connected: false, error: 'Ticker request failed' });
      } finally {
        inFlight.current = false;
      }
    };

    fetchTicker();
    const interval = setInterval(fetchTicker, 7000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [market.exchange, market.symbolRequest]);
}
