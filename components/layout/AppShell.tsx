// filepath: components/layout/AppShell.tsx
'use client';

import { ReactNode } from 'react';
import { DrawingToolbar } from './DrawingToolbar';
import { TradingControls } from './TradingControls';
import { RightPanel } from './RightPanel';
import { Dock } from './Dock';
import { ChartArea } from '@/components/chart';

interface AppShellProps {
  children?: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0b] overflow-hidden">
      {/* Top Trading Controls */}
      <TradingControls />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Drawing Toolbar */}
        <DrawingToolbar />

        {/* Center - Chart Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0b]">
          <ChartArea />
        </main>

        {/* Right Panel - Watchlist/Orders/AI */}
        <RightPanel />
      </div>

      {/* Bottom Dock with Tabs */}
      <Dock />
    </div>
  );
}