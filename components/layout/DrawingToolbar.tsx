// filepath: components/layout/DrawingToolbar.tsx
'use client';

import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  icon: string;
}

const drawingTools: Tool[] = [
  { id: 'cursor', name: 'Cursor', icon: 'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z' },
  { id: 'cross', name: 'Cross', icon: 'M12 2v20M2 12h20' },
  { id: 'trendline', name: 'Trend Line', icon: 'M3 3v18h18' },
  { id: 'horizontal', name: 'Horizontal Line', icon: 'M3 12h18' },
  { id: 'vertical', name: 'Vertical Line', icon: 'M12 3v18' },
  { id: 'ray', name: 'Ray', icon: 'M3 3l18 18' },
  { id: 'fib', name: 'Fibonacci', icon: 'M4 4v16M8 6v12M12 8v8M16 10v4M20 12v4' },
  { id: 'channel', name: 'Channel', icon: 'M3 3v18M21 3v18' },
  { id: 'rectangle', name: 'Rectangle', icon: 'M3 3h18v18H3z' },
  { id: 'text', name: 'Text', icon: 'M4 7V4h16v3M9 20h6M12 4v16' },
  { id: 'brush', name: 'Brush', icon: 'M3 17c3-3 6-6 9-6s6 3 9 6' },
  { id: 'eraser', name: 'Eraser', icon: 'M20 20H7L3 16l10-10 7 7-4 4' },
];

const indicatorTools: Tool[] = [
  { id: 'ma', name: 'Moving Average', icon: 'M3 12h4l3-9 4 6 3 9h4' },
  { id: 'ema', name: 'EMA', icon: 'M3 12h4l2-6 3 4 2 8 3-4 2-6h4' },
  { id: 'rsi', name: 'RSI', icon: 'M3 12h4v4l2-2 2 4 2-2 2 2 2-4 2 2v-6' },
  { id: 'macd', name: 'MACD', icon: 'M3 12h4v-2l2 2 2-4 2 2v4M12 8v4' },
  { id: 'bollinger', name: 'Bollinger Bands', icon: 'M3 8h18M3 12h18M3 16h18' },
  { id: 'volume', name: 'Volume', icon: 'M4 18v-6h4v6M10 18v-10h4v10M16 18v-8h4v8' },
];

export function DrawingToolbar() {
  const [activeTool, setActiveTool] = useState('cursor');
  const [showIndicators, setShowIndicators] = useState(false);

  return (
    <div className="w-12 bg-[#0d0d0f] border-r border-[#1f1f23] flex flex-col items-center py-2">
      {/* Drawing Tools */}
      <div className="space-y-1">
        {drawingTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`
              w-10 h-10 flex items-center justify-center rounded-md
              transition-colors relative group
              ${activeTool === tool.id 
                ? 'bg-[#e87b3a]' 
                : 'hover:bg-[#1f1f23]'
              }
            `}
            title={tool.name}
          >
            <svg 
              className={`w-5 h-5 ${activeTool === tool.id ? 'text-white' : 'text-[#71717a]'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tool.icon} />
            </svg>
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#1f1f23] text-xs text-[#a1a1aa] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
              {tool.name}
            </span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-[#27272a] my-2" />

      {/* Indicator Toggle */}
      <button
        onClick={() => setShowIndicators(!showIndicators)}
        className={`
          w-10 h-10 flex items-center justify-center rounded-md
          transition-colors
          ${showIndicators ? 'bg-[#e87b3a]' : 'hover:bg-[#1f1f23]'}
        `}
        title="Indicators"
      >
        <svg className={`w-5 h-5 ${showIndicators ? 'text-white' : 'text-[#71717a]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h4l3-9 4 6 3 9h4" />
        </svg>
      </button>

      {/* Indicator Sub-menu */}
      {showIndicators && (
        <div className="absolute left-12 top-0 bg-[#0d0d0f] border border-[#27272a] rounded-lg p-2 shadow-xl z-50">
          {indicatorTools.map((tool) => (
            <button
              key={tool.id}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1f1f23] rounded-md"
              title={tool.name}
            >
              <svg className="w-4 h-4 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tool.icon} />
              </svg>
              <span className="text-sm text-[#a1a1aa]">{tool.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="w-8 h-px bg-[#27272a] my-2" />

      {/* More Tools */}
      <button className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#1f1f23] transition-colors" title="Settings">
        <svg className="w-5 h-5 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
}