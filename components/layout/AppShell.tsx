'use client';

import { useStore } from '@/store/app-store';
import { TopHeader } from './TopHeader';
import { DrawingToolbar } from './DrawingToolbar';
import { RightPanel } from './RightPanel';
import { ChartArea } from '@/components/chart';
import { BottomDock } from './BottomDock';
import { BottomInsights } from './BottomInsights';
import { StatusNewsBar } from './StatusNewsBar';

export function AppShell() {
  const { state } = useStore();
  const isPro = state.layoutMode === 'pro';

  return (
    <div className="h-screen bg-[#050607] text-[#f3f4f6] flex flex-col overflow-hidden">
      <TopHeader />
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <DrawingToolbar />
        <main className="flex-1 min-w-0 p-2 space-y-2 overflow-hidden">
          <div className="h-[62%] min-h-[500px] flex gap-2">
            <div className="flex-1 min-w-0"><ChartArea /></div>
            {!isPro && <RightPanel />}
          </div>
          <BottomDock />
          <div className={`${isPro ? 'h-[18%]' : 'h-[28%]'} min-h-[210px]`}>
            <BottomInsights />
          </div>
        </main>
      </div>
      <StatusNewsBar />
    </div>
  );
}
