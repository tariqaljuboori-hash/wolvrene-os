'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/store/app-store';

export function useMarketData() {
  const { market, setMarketSnapshot } = useStore();
  const [loading, setLoading] = useState(false);

  const fetchTicker = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/market/adapter?mode=ticker&exchange=${market.exchange}&symbol=${encodeURIComponent(market.symbolRequest)}`, { cache: 'no-store' });
      const json = await res.json();
      const row = json.row;
      if (!row) {
        setMarketSnapshot({ loading: false, connected: false, error: 'Ticker unavailable' });
        return;
      }
      setMarketSnapshot({
        livePrice: Number(row.last) || 0,
        change: Number(row.change) || 0,
        changePercent: Number(row.changePercent) || 0,
        high24h: Number(row.high24h) || 0,
        low24h: Number(row.low24h) || 0,
        volume24h: Number(row.volume) || 0,
        funding: Number(row.funding) || 0,
        connected: true,
        loading: false,
        error: null,
      });
    } catch {
      setMarketSnapshot({ loading: false, connected: false, error: 'Ticker request failed' });
    } finally {
      setLoading(false);
    }
  }, [market.exchange, market.symbolRequest, setMarketSnapshot]);

  useEffect(() => {
    fetchTicker();
    const interval = setInterval(fetchTicker, 8000);
    return () => clearInterval(interval);
  }, [fetchTicker]);

  return { loading, refetch: fetchTicker };
}
