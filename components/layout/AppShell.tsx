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
  const { state } = useStore();
  const isPro = state.layoutMode === 'pro';

  return (
    <div className="h-screen bg-[#050607] text-[#f3f4f6] flex flex-col overflow-hidden font-sans">
      <TopHeader />

      <div className="flex-1 min-h-0 flex overflow-hidden">
        <DrawingToolbar />

        <main className="flex-1 min-w-0 p-2 flex flex-col gap-2 overflow-hidden">
          <div className="flex-1 min-h-0 flex gap-2">
            <div className="flex-1 min-w-0 min-h-0">
              <ChartArea />
            </div>

            {!isPro && (
              <aside className="w-[430px] shrink-0 min-h-0 overflow-hidden">
                <RightPanel />
              </aside>
            )}
          </div>

          <BottomDock />

          <div
            className={`shrink-0 ${
              isPro ? 'h-[150px]' : 'h-[230px]'
            } min-h-0 overflow-hidden`}
          >
            <BottomInsights />
          </div>
        </main>
      </div>

      <StatusNewsBar />
    </div>
  );
}