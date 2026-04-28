'use client';

import { useStore } from '@/store/app-store';
import { Card } from '@/components/ui';

export function SignalsPanel() {
  const { signals, market } = useStore();
  return <Card variant="default" padding="none" className="h-full"><div className="p-3 border-b border-[#27272a]"><h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">Signal Lifecycle</h3></div><div className="p-4 text-sm text-[#c8ced6]"><div>{market.symbolDisplay}</div><div className="mt-1 text-[#f6a400]">{signals.lifecycle}</div><div className="mt-1 text-[#8b949e]">{signals.explanation}</div></div></Card>;
}
