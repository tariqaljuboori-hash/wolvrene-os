// filepath: components/layout/Sidebar.tsx
'use client';

import { useStore } from '@/store/app-store';
import { Badge } from '@/components/ui';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'workspace', label: 'Workspace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'watchlist', label: 'Watchlist', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'ai-panel', label: 'AI Panel', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', badge: 'Pro' },
  { id: 'signals', label: 'Signals', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'journal', label: 'Journal', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
];

export function Sidebar() {
  const { state, toggleSidebar, hasAccess } = useStore();
  const collapsed = state.sidebarCollapsed;

  return (
    <aside 
      className={`
        bg-[#111113] border-r border-[#27272a] flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-56'}
      `}
    >
      {/* Toggle Button */}
      <div className="p-3 border-b border-[#27272a]">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 hover:bg-[#27272a] rounded-md transition-colors"
        >
          <svg 
            className={`w-5 h-5 text-[#a1a1aa] transition-transform ${collapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {navItems.map((item) => {
          const isLocked = item.badge && !hasAccess(item.badge.toLowerCase() + '_signals');
          
          return (
            <button
              key={item.id}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg mb-1
                hover:bg-[#27272a] transition-colors
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <svg className="w-5 h-5 text-[#a1a1aa] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {!collapsed && (
                <>
                  <span className="text-[#fafafa] text-sm font-medium flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="gold">{item.badge}</Badge>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[#27272a]">
        {!collapsed ? (
          <div className="bg-[#18181b] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#fafafa] text-sm font-medium">Free Plan</span>
              <Badge variant="default">v0.1.0</Badge>
            </div>
            <p className="text-[#71717a] text-xs">Upgrade to Pro for advanced features</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-[#27272a] rounded-full flex items-center justify-center">
              <span className="text-[#71717a] text-xs">v</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}