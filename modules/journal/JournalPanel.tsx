'use client';

import { useStore } from '@/store/app-store';
import { Card } from '@/components/ui';

export function JournalPanel() {
  const { journal } = useStore();
  return <Card variant="default" padding="none" className="h-full"><div className="p-3 border-b border-[#27272a]"><h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">Journal</h3></div><div className="p-3 text-sm">{journal.entries.length ? journal.entries.map((e)=><div key={e.id} className="mb-2"><div className="text-[#f6a400]">{e.title}</div><div className="text-[#c8ced6]">{e.content}</div></div>) : <span className="text-[#8b949e]">No entries.</span>}</div></Card>;
}
