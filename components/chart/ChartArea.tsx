'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { ChartToolRow } from './ChartToolRow';
import { OscillatorPanel } from './OscillatorPanel';

type Candle = { o: number; h: number; l: number; c: number; v: number };

function buildCandles(): Candle[] {
  const out: Candle[] = [];
  let prev = 77212;
  for (let i = 0; i < 90; i += 1) {
    const swing = Math.sin(i / 7) * 850 + Math.cos(i / 5) * 420;
    const o = prev;
    const c = 76000 + swing + (i % 6 - 2) * 60;
    const h = Math.max(o, c) + 250 + (i % 5) * 20;
    const l = Math.min(o, c) - 240 - (i % 4) * 22;
    const v = 120 + ((i * 13) % 100);
    out.push({ o, h, l, c, v });
    prev = c;
  }
  return out;
}

export function ChartArea() {
  const candles = useMemo(() => buildCandles(), []);

  return (
    <section className="h-full min-h-0 rounded-xl border border-[rgba(212,168,83,0.22)] bg-[#0b1014] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      <ChartToolRow />
      <div className="h-[calc(100%-214px)] min-h-[420px] relative bg-[#060d14] border-b border-[rgba(212,168,83,0.14)] overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(90,102,116,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(90,102,116,0.15) 1px, transparent 1px)', backgroundSize: '72px 56px' }} />
        <div className="absolute top-4 left-4 z-20 text-[32px]">
          <div className="text-xl text-[#f3f4f6]">BTCUSDT.P · 1h · WOLVRENE</div>
          <div className="mt-1 text-[#ff4b42]">O 77,212.1&nbsp; H 77,450.0&nbsp; L 77,050.3&nbsp; C 76,778.20&nbsp; -433.90 (-0.56%)</div>
          <div className="mt-1 text-[#f3f4f6]">Vol · BTC <span className="text-[#ff6633]">1.23K</span></div>
        </div>

        <Image src="/window.svg" alt="Wolvrene watermark" width={420} height={420} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" />

        <div className="absolute top-14 right-32 z-30 rounded-lg bg-[#10151bd9] border border-[rgba(212,168,83,0.2)] px-2 py-1 flex gap-2 text-sm text-[#c9d0d8]">{['╱', '╲', '◫', 'T', '◻', '🗑', '✎'].map((i) => <span key={i} className="w-6 h-6 grid place-items-center">{i}</span>)}</div>

        <div className="absolute inset-x-5 bottom-14 top-20">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 560">
            {candles.map((c, i) => {
              const x = 30 + i * 12.6;
              const yScale = (n: number) => 520 - ((n - 71000) / (82000 - 71000)) * 470;
              const wick = '#9ea5ae';
              const up = c.c >= c.o;
              const body = up ? '#f2f4f7' : '#f6a400';
              return (
                <g key={i}>
                  <line x1={x} y1={yScale(c.h)} x2={x} y2={yScale(c.l)} stroke={wick} strokeWidth="1.4" />
                  <rect x={x - 3.6} y={Math.min(yScale(c.o), yScale(c.c))} width={7.2} height={Math.max(2, Math.abs(yScale(c.o) - yScale(c.c)))} fill={body} rx="1" />
                  <rect x={x - 3.6} y={540 - c.v} width={7.2} height={c.v} fill={up ? 'rgba(145,150,156,0.45)' : 'rgba(246,164,0,0.45)'} />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="absolute right-2 top-14 bottom-14 text-xs text-[#c8ced6] flex flex-col justify-between text-right">
          {['82,000.00', '81,000.00', '80,000.00', '79,000.00', '78,000.00', '77,000.00', '76,000.00', '75,000.00', '74,000.00', '73,000.00', '72,000.00', '71,000.00'].map((p) => <span key={p}>{p}</span>)}
        </div>
        <div className="absolute right-2 top-[44%] px-2 py-1 rounded bg-[#9d1b13] text-[#fff] text-xs">76,778.20</div>

        <div className="absolute bottom-4 left-8 right-20 flex justify-between text-xs text-[#8b949e]">
          {['21', '12:00', '22', '12:00', '24', '12:00', '25', '12:00', '26', '12:00', '27'].map((t) => <span key={t}>{t}</span>)}
        </div>

        <div className="absolute left-[24%] top-[22%] px-3 py-1 border border-[#ff4444] bg-[#390a08] rounded-md text-[#ff4444] text-sm">AI SHORT</div>
        <div className="absolute left-[40%] top-[35%] px-3 py-1 border border-[#ff4444] bg-[#390a08] rounded-md text-[#ff4444] text-sm">AI SHORT</div>
        <div className="absolute left-[33%] bottom-[24%] px-3 py-1 border border-[#00d084] bg-[#032d26] rounded-md text-[#00d084] text-sm">AI LONG</div>
        <div className="absolute left-[70%] bottom-[24%] px-3 py-1 border border-[#00d084] bg-[#032d26] rounded-md text-[#00d084] text-sm">AI LONG</div>
      </div>
      <OscillatorPanel />
    </section>
  );
}
