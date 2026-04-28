// filepath: modules/ai-panel/AIPanel.tsx
'use client';

import { useStore } from '@/store/app-store';
import { Card, Badge, Button } from '@/components/ui';

export function AIPanel() {
  const { hasAccess } = useStore();
  const hasProAccess = hasAccess('ai_signals');

  if (!hasProAccess) {
    return (
      <Card variant="default" padding="lg" className="h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[rgba(212,168,83,0.15)] rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#fafafa] mb-2">AI Signals</h3>
        <p className="text-[#71717a] text-sm mb-4">Upgrade to Pro to access AI-powered trading signals</p>
        <Button variant="primary" size="sm">Upgrade to Pro</Button>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="none" className="h-full">
      <div className="p-3 border-b border-[#27272a] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">AI Analysis</h3>
        <Badge variant="gold">Pro</Badge>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-[#18181b] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></div>
            <span className="text-[#fafafa] font-medium">BTC/USD Analysis</span>
          </div>
          <p className="text-[#a1a1aa] text-sm">
            Strong bullish momentum detected. RSI showing positive divergence. 
            Volume increasing on up days suggesting continued upward movement.
          </p>
        </div>
        
        <div className="bg-[#18181b] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#eab308] rounded-full animate-pulse"></div>
            <span className="text-[#fafafa] font-medium">Key Levels</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-[#71717a]">Support:</span>
              <span className="text-[#fafafa] ml-2">$66,500</span>
            </div>
            <div>
              <span className="text-[#71717a]">Resistance:</span>
              <span className="text-[#fafafa] ml-2">$68,200</span>
            </div>
          </div>
        </div>

        <div className="bg-[#18181b] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#fafafa] font-medium">Confidence Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-[#27272a] rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-gradient-to-r from-[#d4a853] to-[#e87b3a] rounded-full"></div>
            </div>
            <span className="text-[#d4a853] font-semibold">85%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}