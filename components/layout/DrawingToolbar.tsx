'use client';

import { useStore } from '@/store/app-store';

const tools = ['Crosshair','Trend Line','Ray','Info Line','Extended Line','Horizontal Line','Vertical Line','Fib Retracement','Fib Extension','Brush','Rectangle','Channel','Parallel Channel','Triangle','Ellipse','Path','Text','Note','Arrow','Magnet'];

export function DrawingToolbar() {
  const { tools: toolState, setActiveTool, hasAccess } = useStore();

  return (
    <aside className="hidden lg:flex w-[170px] shrink-0 p-2 bg-[#070b10] border-r border-[rgba(212,168,83,0.22)] flex-col">
      <div className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.2)] p-2 flex-1 space-y-1 overflow-y-auto">
        {tools.map((tool) => {
          const locked = ['Fib Retracement', 'Fib Extension', 'Magnet'].includes(tool) && !hasAccess('risk-engine');
          return (
            <button key={tool} onClick={() => !locked && setActiveTool(tool)} className={`w-full h-9 px-2 rounded-md flex items-center gap-2 text-xs ${toolState.activeTool === tool ? 'bg-[rgba(212,168,83,0.18)] text-[#f6a400]' : 'text-[#c8ced6] hover:bg-[#10151b]'} ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}>
              <span className="w-4 text-center">◦</span>
              <span className="truncate">{tool}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
