'use client';

import { useStore } from '@/store/app-store';

export function Sidebar() {
  const { setDockTab } = useStore();
  return <aside className="w-14 bg-[#0b1014] border-r border-[rgba(212,168,83,0.2)] hidden"><button onClick={() => setDockTab('wolf-feed')}>Feed</button></aside>;
}
