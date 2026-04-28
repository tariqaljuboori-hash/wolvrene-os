'use client';

import { useEffect, useState } from 'react';
import { ExchangeId } from '@/types/store';
import { Candle } from './ChartTypes';

function bybitInterval(i: string) {
  return ({ '1m':'1','3m':'3','5m':'5','15m':'15','30m':'30','1h':'60','2h':'120','4h':'240','1d':'D','1w':'W','1M':'M' } as Record<string,string>)[i] ?? '60';
}

function bitgetInterval(i: string) {
  return ({ '1m':'1min','3m':'3min','5m':'5min','15m':'15min','30m':'30min','1h':'1H','2h':'2H','4h':'4H','1d':'1D','1w':'1W','1M':'1M' } as Record<string,string>)[i] ?? '1H';
}

function blofinInterval(i: string) {
  return ({ '1m':'1m','3m':'3m','5m':'5m','15m':'15m','30m':'30m','1h':'1H','2h':'2H','4h':'4H','1d':'1D','1w':'1W','1M':'1M' } as Record<string,string>)[i] ?? '1H';
}

function bitunixInterval(i: string) {
  return ({ '1m':'1m','3m':'3m','5m':'5m','15m':'15m','30m':'30m','1h':'1h','2h':'2h','4h':'4h','1d':'1d','1w':'1w' } as Record<string,string>)[i] ?? '1h';
}

function coinbaseIntervalSeconds(i: string) {
  return ({ '1m':60,'5m':300,'15m':900,'30m':1800,'1h':3600,'2h':7200,'4h':14400,'1d':86400 } as Record<string,number>)[i] ?? 3600;
}

function normalizeSymbol(exchange: ExchangeId, symbol: string) {
  if (exchange === 'coinbase') {
    if (symbol.includes('-')) return symbol;
    return symbol.replace('USDT', '-USD').replace('USD', '-USD');
  }

  if (exchange === 'blofin') {
    if (symbol.includes('-')) return symbol;
    return symbol.replace('USDT', '-USDT');
  }

  return symbol.replace('.P', '');
}

function normalizeCandles(data: Candle[]) {
  const map = new Map<number, Candle>();

  for (const c of data) {
    const time = c.time > 1000000000000 ? c.time : c.time * 1000;

    if (
      Number.isFinite(time) &&
      Number.isFinite(c.o) &&
      Number.isFinite(c.h) &&
      Number.isFinite(c.l) &&
      Number.isFinite(c.c)
    ) {
      map.set(time, {
        time,
        o: c.o,
        h: c.h,
        l: c.l,
        c: c.c,
        v: Number.isFinite(c.v) ? c.v : 0,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => a.time - b.time)
    .slice(-300);
}

function upsert(prev: Candle[], live: Candle) {
  return normalizeCandles([...prev, live]);
}

export function useMarketCandles(exchange: ExchangeId, symbol: string, interval: string) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let ws: WebSocket | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;

    const exSymbol = normalizeSymbol(exchange, symbol);

    async function loadHistory() {
      setConnected(false);

      if (exchange === 'yahoo') {
        const res = await fetch(`/api/market/yahoo?symbol=${encodeURIComponent(exSymbol)}&interval=${interval}`, { cache: 'no-store' });
        const json = await res.json();
        if (!cancelled) {
          setCandles(normalizeCandles(json.candles || []));
          setConnected(true);
        }
        return;
      }

      if (exchange === 'bybit') {
        const res = await fetch(`https://api.bybit.com/v5/market/kline?category=linear&symbol=${exSymbol}&interval=${bybitInterval(interval)}&limit=300`, { cache: 'no-store' });
        const json = await res.json();
        const parsed = (json.result?.list || []).map((k: any[]) => ({
          time: Number(k[0]), o: Number(k[1]), h: Number(k[2]), l: Number(k[3]), c: Number(k[4]), v: Number(k[5]),
        })).reverse();
        if (!cancelled) setCandles(normalizeCandles(parsed));
        return;
      }

      if (exchange === 'bitget') {
        const res = await fetch(`https://api.bitget.com/api/v2/mix/market/candles?symbol=${exSymbol}&productType=USDT-FUTURES&granularity=${bitgetInterval(interval)}&limit=300`, { cache: 'no-store' });
        const json = await res.json();
        const parsed = (json.data || []).map((k: any[]) => ({
          time: Number(k[0]), o: Number(k[1]), h: Number(k[2]), l: Number(k[3]), c: Number(k[4]), v: Number(k[5]),
        }));
        if (!cancelled) setCandles(normalizeCandles(parsed));
        return;
      }

      if (exchange === 'blofin') {
        const res = await fetch(`https://openapi.blofin.com/api/v1/market/candles?instId=${exSymbol}&bar=${blofinInterval(interval)}&limit=300`, { cache: 'no-store' });
        const json = await res.json();
        const parsed = (json.data || []).map((k: any[]) => ({
          time: Number(k[0]), o: Number(k[1]), h: Number(k[2]), l: Number(k[3]), c: Number(k[4]), v: Number(k[5]),
        }));
        if (!cancelled) setCandles(normalizeCandles(parsed));
        return;
      }

      if (exchange === 'bitunix') {
        const res = await fetch(`https://fapi.bitunix.com/api/v1/futures/market/kline?symbol=${exSymbol}&interval=${bitunixInterval(interval)}&limit=300`, { cache: 'no-store' });
        const json = await res.json();
        const parsed = (json.data || []).map((k: any) => ({
          time: Number(k.time || k.t || k[0]),
          o: Number(k.open || k.o || k[1]),
          h: Number(k.high || k.h || k[2]),
          l: Number(k.low || k.l || k[3]),
          c: Number(k.close || k.c || k[4]),
          v: Number(k.volume || k.v || k[5]),
        }));
        if (!cancelled) setCandles(normalizeCandles(parsed));
        return;
      }

      if (exchange === 'coinbase') {
        const granularity = coinbaseIntervalSeconds(interval);
        const res = await fetch(`https://api.exchange.coinbase.com/products/${exSymbol}/candles?granularity=${granularity}`, { cache: 'no-store' });
        const json = await res.json();
        const parsed = Array.isArray(json) ? json.map((k: any[]) => ({
          time: Number(k[0]) * 1000,
          l: Number(k[1]),
          h: Number(k[2]),
          o: Number(k[3]),
          c: Number(k[4]),
          v: Number(k[5]),
        })) : [];
        if (!cancelled) setCandles(normalizeCandles(parsed));
        return;
      }

      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${exSymbol}&interval=${interval}&limit=300`, { cache: 'no-store' });
      const data = await res.json();
      const parsed = Array.isArray(data) ? data.map((k: any[]) => ({
        time: Number(k[0]), o: Number(k[1]), h: Number(k[2]), l: Number(k[3]), c: Number(k[4]), v: Number(k[5]),
      })) : [];
      if (!cancelled) setCandles(normalizeCandles(parsed));
    }

    function connectLive() {
      if (exchange === 'binance') {
        ws = new WebSocket(`wss://stream.binance.com:9443/ws/${exSymbol.toLowerCase()}@kline_${interval}`);
        ws.onopen = () => !cancelled && setConnected(true);
        ws.onmessage = (e) => {
          const k = JSON.parse(e.data).k;
          setCandles((p) => upsert(p, { time: Number(k.t), o: Number(k.o), h: Number(k.h), l: Number(k.l), c: Number(k.c), v: Number(k.v) }));
        };
        ws.onclose = () => !cancelled && setConnected(false);
        return;
      }

      if (exchange === 'bybit') {
        ws = new WebSocket('wss://stream.bybit.com/v5/public/linear');
        ws.onopen = () => {
          ws?.send(JSON.stringify({ op: 'subscribe', args: [`kline.${bybitInterval(interval)}.${exSymbol}`] }));
          if (!cancelled) setConnected(true);
        };
        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data);
          const k = msg.data?.[0];
          if (!k) return;
          setCandles((p) => upsert(p, { time: Number(k.start), o: Number(k.open), h: Number(k.high), l: Number(k.low), c: Number(k.close), v: Number(k.volume) }));
        };
        ws.onclose = () => !cancelled && setConnected(false);
        return;
      }

      poll = setInterval(loadHistory, exchange === 'yahoo' ? 15000 : 3000);
      setConnected(true);
    }

    setCandles([]);
    loadHistory().then(connectLive).catch(() => {
      if (!cancelled) {
        setCandles([]);
        setConnected(false);
      }
    });

    return () => {
      cancelled = true;
      ws?.close();
      if (poll) clearInterval(poll);
    };
  }, [exchange, symbol, interval]);

  return { candles, connected };
}