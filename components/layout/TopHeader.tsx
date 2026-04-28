'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/app-store';

const utilityIcons = ['⌕', '✉', '🔔', '⚙'];

type MarketTicker = {
  price: string;
  change: string;
  changePercent: string;
  high: string;
  low: string;
  volume: string;
};

function formatPrice(n: number) {
  if (!Number.isFinite(n)) return '...';
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(2);
  return n.toFixed(5);
}

function formatVolume(n: number, base: string) {
  if (!Number.isFinite(n)) return '...';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M ${base}`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K ${base}`;
  return `${n.toFixed(2)} ${base}`;
}

function getBase(symbol: string) {
  return symbol.replace('USDT', '').replace('USDC', '').replace('USD', '');
}

export function TopHeader() {
  const { state, setLayoutMode } = useStore();
  const isPro = state.layoutMode === 'pro';

  const exchangeSymbol = state.currentExchangeSymbol || 'BTCUSDT';
  const displaySymbol = state.currentSymbol || 'BTCUSDT.P';
  const base = getBase(exchangeSymbol);

  const [ticker, setTicker] = useState<MarketTicker>({
    price: '...',
    change: '...',
    changePercent: '...',
    high: '...',
    low: '...',
    volume: '...',
  });

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;
    const baseAsset = getBase(exchangeSymbol);

    async function loadInitial() {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${exchangeSymbol}`,
          { cache: 'no-store' }
        );

        const data = await res.json();
        if (cancelled) return;

        setTicker({
          price: formatPrice(Number(data.lastPrice)),
          change: formatPrice(Number(data.priceChange)),
          changePercent: `${Number(data.priceChangePercent).toFixed(2)}%`,
          high: formatPrice(Number(data.highPrice)),
          low: formatPrice(Number(data.lowPrice)),
          volume: formatVolume(Number(data.volume), baseAsset),
        });
      } catch {
        if (!cancelled) {
          setTicker({
            price: '...',
            change: '...',
            changePercent: '...',
            high: '...',
            low: '...',
            volume: '...',
          });
        }
      }
    }

    function connectSocket() {
      ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${exchangeSymbol.toLowerCase()}@ticker`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (cancelled) return;

        setTicker({
          price: formatPrice(Number(data.c)),
          change: formatPrice(Number(data.p)),
          changePercent: `${Number(data.P).toFixed(2)}%`,
          high: formatPrice(Number(data.h)),
          low: formatPrice(Number(data.l)),
          volume: formatVolume(Number(data.v), baseAsset),
        });
      };

      ws.onclose = () => {
        if (cancelled) return;
        reconnectTimer = setTimeout(connectSocket, 2000);
      };
    }

    setTicker({
      price: '...',
      change: '...',
      changePercent: '...',
      high: '...',
      low: '...',
      volume: '...',
    });

    loadInitial();
    connectSocket();

    return () => {
      cancelled = true;
      ws?.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [exchangeSymbol]);

  const isUp = !ticker.change.startsWith('-');

  return (
    <header className="h-20 px-4 bg-[#050607] border-b border-[rgba(212,168,83,0.22)] flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <div className="w-[360px] h-full flex items-center gap-3 rounded-xl px-3 bg-[#070b10] border border-[rgba(212,168,83,0.18)]">
        <Image
          src="/wolvrene-logo.png"
          alt="Wolvrene OS logo"
          width={46}
          height={46}
          className="rounded-md object-contain drop-shadow-[0_0_12px_rgba(246,164,0,0.35)]"
        />

        <div>
          <div className="flex items-end gap-2 leading-none">
            <div className="text-[38px] tracking-[-0.06em] font-semibold">
              <span className="text-[#f3f4f6]">WOLV</span>
              <span className="text-[#d4a853]">RENE</span>
            </div>

            <span className="mb-1 rounded-md border border-[#d4a853]/45 bg-[#1b1205] px-2 py-1 text-[12px] font-bold tracking-[0.18em] text-[#f6a400]">
              OS
            </span>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] text-[#9aa4ae]">
            AI Precision Trading Operating System
          </div>
        </div>
      </div>

      <div className="flex-1 h-full flex items-center min-w-0">
        <div className="w-full h-[64px] rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] px-4 grid grid-cols-7 text-xs overflow-hidden">
          <div className="col-span-2 flex items-center gap-3 border-r border-[rgba(212,168,83,0.16)] min-w-0">
            <span className="w-6 h-6 rounded-full bg-[#f6a400] text-[#050607] text-[10px] font-bold grid place-items-center">
              {base.slice(0, 1)}
            </span>

            <span className="text-[#f3f4f6] font-semibold text-xl truncate">
              {displaySymbol.replace('.P', '')}
            </span>

            <span className="text-[#8b949e]">▾</span>
          </div>

          <div className="flex flex-col justify-center px-3 border-r border-[rgba(212,168,83,0.16)]">
            <span
              className={`text-[38px] leading-none font-semibold ${
                isUp ? 'text-[#00d084]' : 'text-[#ff4444]'
              }`}
            >
              {ticker.price}
            </span>

            <span className={isUp ? 'text-[#00d084]' : 'text-[#ff4444]'}>
              {isUp ? '+' : ''}
              {ticker.change} ({ticker.changePercent})
            </span>
          </div>

          {[
            ['24H High', ticker.high],
            ['24H Low', ticker.low],
            ['24H Vol', ticker.volume],
            ['Funding', '0.0100%'],
            ['Market', 'Open'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col justify-center px-3 border-r last:border-r-0 border-[rgba(212,168,83,0.16)] min-w-0"
            >
              <span className="uppercase text-[10px] tracking-[0.12em] text-[#8b949e]">
                {label}
              </span>

              <span
                className={`text-[16px] font-semibold truncate ${
                  label === 'Market' ? 'text-[#00d084]' : 'text-[#f3f4f6]'
                }`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[460px] flex justify-end items-center gap-2">
        <button className="h-12 px-5 rounded-lg text-[18px] font-semibold text-[#f6a400] border border-[rgba(246,164,0,0.45)] bg-[linear-gradient(180deg,rgba(51,33,0,0.6),rgba(20,14,6,0.9))]">
          ◉ HUNT MODE
        </button>

        {utilityIcons.map((icon) => (
          <button
            key={icon}
            className="w-12 h-12 rounded-lg border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-[#d5dae0]"
          >
            {icon}
          </button>
        ))}

        <button className="h-12 px-3 rounded-lg border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-left leading-tight">
          <div className="flex items-center gap-2">
            <Image src="/wolvrene-logo.png" alt="Wolvrene Pro" width={18} height={18} />
            <span className="text-xs text-[#f3f4f6]">WOLVRENE PRO</span>
          </div>

          <div className="text-[11px] text-[#d4a853]">Elite Plan ▾</div>
        </button>

        <button
          onClick={() => setLayoutMode(isPro ? 'normal' : 'pro')}
          className="h-12 px-3 rounded-lg border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-[11px] text-[#8b949e]"
        >
          {isPro ? 'Normal' : 'Pro'} Mode
        </button>
      </div>
    </header>
  );
}