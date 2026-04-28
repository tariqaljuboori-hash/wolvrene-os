'use client';

import { useStore } from '@/store/app-store';
import { WatchlistPanel } from './WatchlistPanel';
import { OrderPanel } from './OrderPanel';
import { AICommandPanel } from './AICommandPanel';

export function RightPanel() {
  const { state } = useStore();
  if (state.rightPanelCollapsed) return null;

  return (
    <aside className="w-[490px] shrink-0 p-2 bg-[#050607] border-l border-[rgba(212,168,83,0.22)] overflow-y-auto space-y-2">
      <WatchlistPanel />
      <OrderPanel />
      <AICommandPanel />
    </aside>
  );
}
