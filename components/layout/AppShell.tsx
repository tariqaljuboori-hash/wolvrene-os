'use client';

import { useStore } from '@/store/app-store';
import { TopHeader } from './TopHeader';
import { DrawingToolbar } from './DrawingToolbar';
import { RightPanel } from './RightPanel';
import { ChartArea } from '@/components/chart/ChartArea';
import { BottomDock } from './BottomDock';
import { BottomInsights } from './BottomInsights';
import { StatusNewsBar } from './StatusNewsBar';

export function AppShell() {
  const { ui } = useStore();
  const hunt = ui.huntMode;

  return (
    <div className="h-screen bg-[#050607] text-[#f3f4f6] flex flex-col overflow-hidden font-sans">
      <TopHeader />
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {!hunt && <DrawingToolbar />}
        <main className="flex-1 min-w-0 p-2 flex flex-col gap-2 overflow-hidden">
          <div className="flex-1 min-h-0 flex gap-2 flex-col xl:flex-row">
            <div className="flex-1 min-w-0 min-h-0"><ChartArea /></div>
            {!hunt && ui.layoutMode !== 'pro' && <aside className="xl:w-[430px] shrink-0 min-h-0 overflow-hidden"><RightPanel /></aside>}
          </div>
          {!hunt && <BottomDock />}
          {!hunt && <div className="shrink-0 h-[160px] min-h-0 overflow-hidden hidden md:block"><BottomInsights /></div>}
        </main>
      </div>
      <StatusNewsBar />
    </div>
  );
}
