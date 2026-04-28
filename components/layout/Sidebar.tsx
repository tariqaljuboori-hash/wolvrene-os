// filepath: components/layout/Sidebar.tsx
'use client';

import { useStore } from '@/store/app-store';

const navItems = [
  'Dashboard',
  'Chart',
  'AI Signals',
  'Analytics',
  'Backtest',
  'Pro Tools',
  'Strategies',
  'Market Scan',
  'Orders',
  'Positions',
  'Alerts',
  'Journal',
  'Settings',
  'Help & Docs',
];

export function Sidebar() {
  const { state, toggleSidebar } = useStore();

  if (state.sidebarCollapsed) {
    return (
      <aside className="w-14 bg-[#0b1014] border-r border-[rgba(212,168,83,0.22)] flex flex-col items-center py-3">
        <button onClick={toggleSidebar} className="w-8 h-8 rounded-md bg-[#10151b] text-[#d4a853]">›</button>
      </aside>
    );
  }

  return (
    <aside className="w-56 bg-[#0b1014] border-r border-[rgba(212,168,83,0.22)] flex flex-col">
      <div className="p-2.5 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item, idx) => (
          <button
            key={item}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-[12px] transition-colors ${
              idx === 0 ? 'bg-[#10151b] text-[#f9fafb] border border-[rgba(212,168,83,0.35)]' : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#10151b]'
            }`}
          >
            <span className="text-[10px]">⬢</span>
            {item}
          </button>
        ))}
      </div>

      <div className="p-2.5 border-t border-[rgba(212,168,83,0.22)] space-y-2">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-[#10151b] border border-[rgba(212,168,83,0.22)]">
          <span className="text-[11px] text-[#a7f3d0]">LIVE / Connected</span>
          <span className="w-2 h-2 rounded-full bg-[#00d084]" />
        </div>
        <button onClick={toggleSidebar} className="w-full px-2 py-1.5 rounded-md text-[11px] text-[#d4a853] bg-[#10151b] border border-[rgba(212,168,83,0.22)]">
          Collapse
        </button>
      </div>
    </aside>
  );
}
