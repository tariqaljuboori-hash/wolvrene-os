'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/app-store';

const flow = ['WATCHING', 'SPAWNED', 'VALIDATING', 'ARMED'] as const;

export function AICommandPanel() {
  const { signals, market, hasAccess, setSignalLifecycle, setCurrentTier } = useStore();
  const locked = !hasAccess('decision-brain');

  useEffect(() => {
    if (locked) {
      setBrain({ lifecycle: 'IDLE', bias: 'neutral', confidence: 0, whyWaiting: 'Decision Brain is locked on Free tier.', nextAction: 'Upgrade', setupQuality: 'Locked', riskWarning: 'No automated decision support.', sessionContext: 'Unavailable' });
      return;
    }

    const momentum = Math.abs(market.changePercent);
    const bias = market.changePercent > 0.1 ? 'bullish' : market.changePercent < -0.1 ? 'bearish' : 'neutral';
    const confidence = Math.min(90, Math.max(20, Math.round(momentum * 20 + (market.connected ? 20 : 0))));
    const lifecycle = confidence >= 70 ? 'ARMED' : confidence >= 50 ? 'WATCHING' : 'SCANNING';
    const why = lifecycle === 'ARMED' ? 'Setup meets momentum and volatility criteria.' : lifecycle === 'WATCHING' ? 'Confluence forming but confirmation still pending.' : 'Market context weak; scanning for stronger alignment.';
    const action = lifecycle === 'ARMED' ? 'Prepare managed entry with strict risk.' : 'Wait for structure confirmation.';

    setBrain({ lifecycle, bias, confidence, whyWaiting: why, nextAction: action, setupQuality: confidence >= 70 ? 'A' : confidence >= 55 ? 'B' : 'C', riskWarning: confidence >= 75 ? 'Avoid overleverage into late moves.' : 'Use reduced size until trend confirms.', sessionContext: `Exchange: ${market.exchange.toUpperCase()} · TF: ${market.timeframe}` });

    if (lifecycle === 'ARMED') {
      pushSignal({ symbol: market.symbolDisplay, direction: bias === 'bullish' ? 'long' : bias === 'bearish' ? 'short' : 'neutral', confidence, reason: why });
    }
  }, [locked, market.symbolDisplay, market.exchange, market.timeframe, market.changePercent, market.connected]);

  return (
    <section className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3">
      <div className="flex items-center justify-between"><h3 className="text-[#f3f4f6] text-lg">WOLVRENE AI COMMAND</h3><span className="text-xs text-[#f6a400]">{locked ? 'PRO REQUIRED' : brain.lifecycle}</span></div>
      <div className="mt-2 text-sm text-[#c8ced6]">Bias: <span className={brain.bias === 'bullish' ? 'text-[#00d084]' : brain.bias === 'bearish' ? 'text-[#ff4444]' : 'text-[#f3f4f6]'}>{brain.bias.toUpperCase()}</span> · Confidence {brain.confidence}%</div>
      <ul className="mt-2 text-xs text-[#9ca3af] space-y-1"><li>Why waiting: {brain.whyWaiting}</li><li>Risk warning: {brain.riskWarning}</li><li>Session context: {brain.sessionContext}</li><li>Next action: {brain.nextAction}</li></ul>
      {locked ? <button onClick={() => setTier('pro')} className="w-full mt-3 h-9 rounded bg-[#2d1f06] text-[#f3d19a]">Upgrade to Pro</button> : <button className="w-full mt-3 h-9 rounded border border-[rgba(212,168,83,0.28)] bg-[#10151b] text-[#f3f4f6]" onClick={() => pushNews(`Analysis opened for ${market.symbolDisplay}`)}>Open Full Analysis</button>}
    </section>
  );
}
