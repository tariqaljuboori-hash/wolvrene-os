// filepath: components/layout/Toolbar.tsx
'use client';

import { useStore } from '@/store/app-store';

export function Toolbar() {
  const { state, setLayoutMode, toggleSidebar, toggleRightPanel } = useStore();
  const isPro = state.layoutMode === 'pro';

  return (
    <header className="h-14 bg-[#111113] border-b border-[#27272a] flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-[#27272a] rounded-md transition-colors"
          title="Toggle Sidebar"
        >
          <svg className="w-5 h-5 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#d4a853] to-[#e87b3a] rounded-lg flex items-center justify-center">
            <span className="text-[#0a0a0b] font-bold text-lg">W</span>
          </div>
          <span className="text-[#fafafa] font-semibold text-lg tracking-tight">WOLVRENE</span>
        </div>
      </div>

      {/* Center Section - Mode Toggle */}
      <div className="flex items-center bg-[#18181b] rounded-lg p-1">
        <button
          onClick={() => setLayoutMode('normal')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            !isPro 
              ? 'bg-[#27272a] text-[#fafafa]' 
              : 'text-[#71717a] hover:text-[#a1a1aa]'
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => setLayoutMode('pro')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            isPro 
              ? 'bg-[#d4a853] text-[#0a0a0b]' 
              : 'text-[#71717a] hover:text-[#a1a1aa]'
          }`}
        >
          Pro
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-[#27272a] rounded-md transition-colors" title="Search">
          <svg className="w-5 h-5 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <button className="p-2 hover:bg-[#27272a] rounded-md transition-colors" title="Notifications">
          <svg className="w-5 h-5 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <button 
          onClick={toggleRightPanel}
          className="p-2 hover:bg-[#27272a] rounded-md transition-colors"
          title="Toggle Right Panel"
        >
          <svg className="w-5 h-5 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </button>

        <div className="w-8 h-8 bg-[#27272a] rounded-full flex items-center justify-center">
          <span className="text-[#a1a1aa] text-sm font-medium">U</span>
        </div>
      </div>
    </header>
  );
}