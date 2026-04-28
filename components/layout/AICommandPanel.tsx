'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/app-store';

const flow = ['WATCHING', 'SPAWNED', 'VALIDATING', 'ARMED'] as const;

export function AICommandPanel() {
  const { signals, market, hasAccess, setSignalLifecycle, setCurrentTier } = useStore();
  const locked = !hasAccess('decision-brain');

  useEffect(() => {
    if (locked) {
      setSignalLifecycle({ lifecycle: 'NONE', confidence: 0, explanation: 'Upgrade to Pro to enable Decision Brain.' });
      return;
    }
    let idx = 0;
    setSignalLifecycle({ lifecycle: 'WATCHING', confidence: 52, explanation: `Scanning ${market.symbolDisplay} structure and liquidity.` });
    const id = setInterval(() => {
      idx = (idx + 1) % flow.length;
      const stage = flow[idx];
      const confidence = stage === 'ARMED' ? 72 : stage === 'VALIDATING' ? 64 : 58;
      setSignalLifecycle({ lifecycle: stage, confidence, explanation: `${stage} context from ${market.exchange.toUpperCase()} ${market.timeframe} feed.` });
    }, 7000);
    return () => clearInterval(id);
  }, [locked, market.symbolDisplay, market.exchange, market.timeframe, setSignalLifecycle]);

  return (
    <section className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3">
      <div className="flex items-center justify-between"><h3 className="text-[#f3f4f6] text-lg">DECISION BRAIN</h3><span className="text-xs text-[#f6a400]">{locked ? 'PRO REQUIRED' : signals.lifecycle}</span></div>
      <div className="mt-2 text-[#c8ced6] text-sm">{signals.explanation}</div>
      <div className="mt-3 h-2 bg-[#121920] rounded"><div className="h-full rounded bg-[#f6a400]" style={{ width: `${signals.confidence}%` }} /></div>
      <div className="mt-2 text-[#f3f4f6] text-sm">Confidence: {signals.confidence}%</div>
      {locked && <button onClick={() => setCurrentTier('pro')} className="w-full mt-3 h-9 rounded bg-[#2d1f06] text-[#f3d19a]">Upgrade to Pro</button>}
    </section>
  );
}
