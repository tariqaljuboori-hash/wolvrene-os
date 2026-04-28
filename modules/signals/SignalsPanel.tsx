'use client';

import { useStore } from '@/store/app-store';
import { Card } from '@/components/ui';

export function SignalsPanel() {
  const { signals, brain } = useStore();
  return <Card variant="default" padding="none" className="h-full"><div className="p-3 border-b border-[#27272a]"><h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">Signals</h3></div><div className="p-3 text-sm text-[#c8ced6]">State: {brain.lifecycle}<div className="mt-2 space-y-1">{signals.history.length ? signals.history.map((s)=><div key={s.id}>{s.symbol} · {s.direction.toUpperCase()} · {s.confidence}%</div>) : <span className="text-[#8b949e]">No signals.</span>}</div></div></Card>;
}
