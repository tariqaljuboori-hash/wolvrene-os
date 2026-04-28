// filepath: modules/journal/JournalPanel.tsx
'use client';

import { useStore } from '@/store/app-store';
import { Card, Badge } from '@/components/ui';

export function JournalPanel() {
  const { journal } = useStore();

  return (
    <Card variant="default" padding="none" className="h-full">
      <div className="p-3 border-b border-[#27272a]">
        <h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">Trading Journal</h3>
      </div>
      <div className="divide-y divide-[#27272a]">
        {journal.map((entry) => (
          <div key={entry.id} className="p-4 hover:bg-[#18181b] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[#fafafa] font-medium">{entry.title}</h4>
              <span className="text-[#71717a] text-xs">
                {entry.timestamp.toLocaleDateString()}
              </span>
            </div>
            <p className="text-[#a1a1aa] text-sm mb-2">{entry.content}</p>
            <div className="flex gap-1 flex-wrap">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}