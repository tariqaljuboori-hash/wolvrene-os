'use client';

import { useStore } from '@/store/app-store';

export function Toolbar() {
  const { ui, setLayoutMode } = useStore();
  return <header className="h-10 bg-[#0b1014] border-b border-[rgba(212,168,83,0.2)] px-3 flex items-center justify-between text-xs"><span className="text-[#8b949e]">Workspace Toolbar</span><button onClick={() => setLayoutMode(ui.layoutMode === 'pro' ? 'normal' : 'pro')} className="px-2 py-1 rounded border border-[rgba(212,168,83,0.2)]">Toggle Layout</button></header>;
}
