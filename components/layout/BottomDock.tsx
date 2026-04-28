'use client';

import { useMemo } from 'react';
import { useStore } from '@/store/app-store';
import { DockTab } from '@/types/store';
import { SignalsPanel } from '@/modules/signals';
import { JournalPanel } from '@/modules/journal';
import { OrdersPanel } from '@/modules/orders';
import { WatchlistPanel as WatchlistModule } from '@/modules/watchlist';

const tabs: { id: DockTab; label: string; feature?: string }[] = [
  { id: 'positions', label: 'POSITIONS' },
  { id: 'watchlist', label: 'WATCHLIST' },
  { id: 'trades', label: 'TRADES', feature: 'risk-engine' },
  { id: 'journal', label: 'JOURNAL' },
  { id: 'signals', label: 'SIGNALS' },
  { id: 'calendar', label: 'CALENDAR', feature: 'community-chat' },
  { id: 'news', label: 'NEWS' },
];

function Placeholder({ title, body }: { title: string; body: string }) {
  return <div className="h-full rounded-xl border border-[rgba(212,168,83,0.2)] bg-[#0b1014] p-3 text-sm text-[#c3cad3]"><div className="text-[#f6a400] text-xs mb-2">{title}</div><p>{body}</p></div>;
}

export function BottomDock() {
  const { ui, setDockTab, hasAccess } = useStore();

  const activeContent = useMemo(() => {
    switch (ui.activeDockTab) {
      case 'watchlist': return <WatchlistModule />;
      case 'signals': return <SignalsPanel />;
      case 'journal': return <JournalPanel />;
      case 'positions': return <OrdersPanel />;
      default: return <Placeholder title={ui.activeDockTab.toUpperCase()} body="Future backend-integrated module placeholder." />;
    }
  }, [ui.activeDockTab]);

  return (
    <div className="min-h-0 rounded-xl border border-[rgba(212,168,83,0.22)] bg-[#0b1014] px-3 py-2 flex flex-col gap-2">
      <div className="flex gap-1 text-xs sm:text-sm overflow-x-auto">
        {tabs.map((tab) => {
          const locked = tab.feature ? !hasAccess(tab.feature) : false;
          return <button key={tab.id} onClick={() => !locked && setDockTab(tab.id)} className={`h-9 px-3 rounded-md whitespace-nowrap ${ui.activeDockTab === tab.id ? 'bg-[#131b23] text-[#f6a400] border border-[rgba(212,168,83,0.35)]' : 'text-[#c3cad3]'} ${locked ? 'opacity-40' : ''}`}>{tab.label}{locked ? ' · PRO' : ''}</button>;
        })}
      </div>
      <div className="h-[220px] min-h-0 overflow-hidden">{activeContent}</div>
    </div>
  );
}
