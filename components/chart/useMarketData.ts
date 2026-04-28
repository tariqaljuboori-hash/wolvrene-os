// filepath: components/chart/useMarketData.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store/app-store';
import { ExchangeId, MarketData } from '@/types/store';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';
const CACHE_DURATION = 5000; // 5 seconds cache

interface PriceCache {
  [symbol: string]: {
    data: MarketData;
    timestamp: number;
  };
}

const priceCache: PriceCache = {};

async function fetchBinancePrice(symbol: string): Promise<MarketData | null> {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/24h?symbol=${symbol.toUpperCase()}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    return {
      symbol: symbol.toUpperCase(),
      price: parseFloat(data.lastPrice),
      change: parseFloat(data.priceChange),
      changePercent: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume),
      high24h: parseFloat(data.highPrice),
      low24h: parseFloat(data.lowPrice),
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

async function fetchYahooPrice(symbol: string): Promise<MarketData | null> {
  try {
    // Yahoo Finance API - using v8 quote endpoint
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
    );
    
    if (!response.ok) return null;
    
    const result = await response.json();
    const quote = result?.chart?.result?.[0];
    
    if (!quote?.meta) return null;
    
    const meta = quote.meta;
    const prevClose = meta.previousClose || meta.chartPreviousClose;
    
    return {
      symbol: symbol,
      price: meta.regularMarketPrice || 0,
      change: (meta.regularMarketPrice || 0) - (prevClose || 0),
      changePercent: prevClose ? (((meta.regularMarketPrice || 0) - prevClose) / prevClose) * 100 : 0,
      volume: meta.volume || 0,
      high24h: meta.regularMarketDayHigh || 0,
      low24h: meta.regularMarketDayLow || 0,
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

export function useMarketData(symbol?: string, exchange?: ExchangeId) {
  const { state, setDataFeedStatus, setLastMarketUpdate, updateMarketData } = useStore();
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetSymbol = symbol || state.currentExchangeSymbol;
  const targetExchange = exchange || state.currentExchange;

  const fetchData = useCallback(async () => {
    if (!targetSymbol) return;

    // Check cache first
    const cached = priceCache[targetSymbol];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setMarketData(cached.data);
      updateMarketData(cached.data);
      setDataFeedStatus('connected');
      return;
    }

    setLoading(true);
    setDataFeedStatus('loading');
    setError(null);

    try {
      let data: MarketData | null = null;

      if (targetExchange === 'binance') {
        data = await fetchBinancePrice(targetSymbol);
      } else if (targetExchange === 'yahoo') {
        data = await fetchYahooPrice(targetSymbol);
      }

      if (data) {
        priceCache[targetSymbol] = {
          data,
          timestamp: Date.now(),
        };
        setMarketData(data);
        updateMarketData(data);
        setDataFeedStatus('connected');
        setLastMarketUpdate(Date.now());
      } else {
        setError('Failed to fetch market data');
        setDataFeedStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setDataFeedStatus('error');
    } finally {
      setLoading(false);
    }
  }, [targetSymbol, targetExchange, setDataFeedStatus, setLastMarketUpdate, updateMarketData]);

  useEffect(() => {
    fetchData();

    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    marketData,
    loading,
    error,
    refetch: fetchData,
  };
}

// Hook for fetching multiple symbols (watchlist)
export function useWatchlistData(symbols: Array<{ symbol: string; exchange: ExchangeId }>) {
  const [data, setData] = useState<Map<string, MarketData>>(new Map());
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    
    const results = await Promise.all(
      symbols.map(async ({ symbol, exchange }) => {
        if (exchange === 'binance') {
          return { symbol, data: await fetchBinancePrice(symbol) };
        } else if (exchange === 'yahoo') {
          return { symbol, data: await fetchYahooPrice(symbol) };
        }
        return { symbol, data: null };
      })
    );

    const newData = new Map<string, MarketData>();
    results.forEach(({ symbol, data }) => {
      if (data) {
        newData.set(symbol, data);
      }
    });

    setData(newData);
    setLoading(false);
  }, [symbols]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { data, loading, refetch: fetchAll };
}