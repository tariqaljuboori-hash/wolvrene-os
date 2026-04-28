'use client';

import { useState } from 'react';
import { useStore } from '@/store/app-store';

const tools = [
  'Crosshair',
  'Trend Line',
  'Ray',
  'Info Line',
  'Extended Line',
  'Horizontal Line',
  'Vertical Line',
  'Fib Retracement',
  'Fib Extension',
  'Brush',
  'Rectangle',
  'Channel',
  'Parallel Channel',
  'Triangle',
  'Ellipse',
  'Path',
  'Text',
  'Note',
  'Arrow',
  'Magnet',
];

export function DrawingToolbar() {
  const { state, setActiveDrawingTool } = useStore();
  const [localActive, setLocalActive] = useState(state.activeDrawingTool || 'Crosshair');

  const handleToolClick = (tool: string) => {
    setLocalActive(tool);
    setActiveDrawingTool(tool);
  };

  return (
    <aside className="w-[170px] shrink-0 p-2 bg-[#070b10] border-r border-[rgba(212,168,83,0.22)] flex flex-col">
      <div className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.2)] p-2 flex-1 space-y-1 overflow-y-auto">
        {tools.map((tool) => (
          <button
            key={tool}
            onClick={() => handleToolClick(tool)}
            className={`w-full h-9 px-2 rounded-md flex items-center gap-2 text-xs ${localActive === tool ? 'bg-[rgba(212,168,83,0.18)] text-[#f6a400] border border-[rgba(212,168,83,0.35)]' : 'text-[#c8ced6] hover:bg-[#10151b]'}`}
          >
            <span className="w-4 text-center">✣</span>
            <span>{tool}</span>
          </button>
        ))}
      </div>
      <div className="mt-2 rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.2)] h-12 px-2 flex items-center justify-between text-[#9ca3af]">
        <button>☆</button><button>◈</button><button>⌂</button>
      </div>
    </aside>
  );
}
