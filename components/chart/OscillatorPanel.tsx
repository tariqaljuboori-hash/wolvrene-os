'use client';

import { useMemo } from 'react';
import { Candle } from './ChartTypes';

function ema(values: number[], period: number) {
  if (!values.length) return [];
  const k = 2 / (period + 1);
  const out = [values[0]];
  for (let i = 1; i < values.length; i++) out.push(values[i] * k + out[i - 1] * (1 - k));
  return out;
}

function rsi(values: number[], period = 14) {
  if (values.length < period + 1) return [];
  const out: number[] = [];
  for (let i = period; i < values.length; i++) {
    let gain = 0, loss = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const d = values[j] - values[j - 1];
      if (d >= 0) gain += d; else loss += Math.abs(d);
    }
    const rs = loss === 0 ? 100 : gain / loss;
    out.push(100 - 100 / (1 + rs));
  }
  return out;
}

export function OscillatorPanel({ candles = [] }: { candles?: Candle[] }) {
  const close = useMemo(() => candles.map((c) => c.c), [candles]);
  const rsi14 = useMemo(() => rsi(close, 14), [close]);
  const ema21 = useMemo(() => ema(close, 21), [close]);
  const ema50 = useMemo(() => ema(close, 50), [close]);
  const ema200 = useMemo(() => ema(close, 200), [close]);

  const latestRsi = rsi14.at(-1) ?? 0;
  const wpo = latestRsi - 50;

  return (
    <div className="h-[170px] border-t border-[rgba(212,168,83,0.2)] bg-[#070d12] px-3 py-2">
      <div className="flex items-center gap-2 text-[12px] leading-none"><span className="text-[#f3f4f6] font-medium">WPO</span><span className="text-[#f6a400]">{wpo.toFixed(2)}</span><span className="text-[#8b949e]">RSI {latestRsi.toFixed(2)}</span><span className="text-[#00d084]">EMA21 {ema21.at(-1)?.toFixed(2) || '...'}</span><span className="text-[#ff7a1a]">EMA50 {ema50.at(-1)?.toFixed(2) || '...'}</span><span className="text-[#9ea5ae]">EMA200 {ema200.at(-1)?.toFixed(2) || '...'}</span></div>
      <div className="mt-2 h-[95px] rounded-md border border-[rgba(212,168,83,0.12)] bg-[#081018] relative overflow-hidden">
        <svg viewBox="0 0 1000 120" className="w-full h-full" preserveAspectRatio="none">
          <path d={`M${rsi14.map((v, i) => `${(i / Math.max(1, rsi14.length - 1)) * 1000} ${120 - (v / 100) * 120}`).join(' L')}`} fill="none" stroke="#f6a400" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
