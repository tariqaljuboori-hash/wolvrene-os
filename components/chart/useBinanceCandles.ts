'use client';

import { useEffect, useState } from 'react';
import { Candle } from './ChartTypes';

export function useBinanceCandles(symbol: string, interval: string) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    async function loadHistory() {
      try {
        setConnected(false);

        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=260`,
          { cache: 'no-store' }
        );

        const data = await res.json();
        if (!Array.isArray(data)) return;

        const parsed: Candle[] = data.map((k: unknown[]) => ({
          time: Number(k[0]),
          o: Number(k[1]),
          h: Number(k[2]),
          l: Number(k[3]),
          c: Number(k[4]),
          v: Number(k[5]),
        }));

        if (!cancelled) setCandles(parsed);
      } catch {
        if (!cancelled) setConnected(false);
      }
    }

    function connectWS() {
      ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
      );

      ws.onopen = () => !cancelled && setConnected(true);
      ws.onerror = () => !cancelled && setConnected(false);

      ws.onclose = () => {
        if (cancelled) return;
        setConnected(false);
        reconnectTimer = setTimeout(connectWS, 1800);
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const k = msg.k;

        const live: Candle = {
          time: Number(k.t),
          o: Number(k.o),
          h: Number(k.h),
          l: Number(k.l),
          c: Number(k.c),
          v: Number(k.v),
        };

        setCandles((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];

          if (last?.time === live.time) {
            copy[copy.length - 1] = live;
          } else {
            copy.push(live);
            if (copy.length > 260) copy.shift();
          }

          return copy;
        });
      };
    }

    loadHistory();
    connectWS();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [symbol, interval]);

  return { candles, connected };
}