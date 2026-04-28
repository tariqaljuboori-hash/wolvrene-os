'use client';

import { useStore } from '@/store/app-store';
import { WatchlistPanel } from './WatchlistPanel';
import { OrderPanel } from './OrderPanel';
import { AICommandPanel } from './AICommandPanel';

export function RightPanel() {
  const { ui } = useStore();
  if (ui.rightPanelCollapsed) return null;

  return (
    <aside className="w-full xl:w-[430px] shrink-0 p-2 bg-[#050607] border-l border-[rgba(212,168,83,0.22)] overflow-y-auto space-y-2 h-full">
      <WatchlistPanel />
      <OrderPanel />
      <AICommandPanel />
    </aside>
  );
}
