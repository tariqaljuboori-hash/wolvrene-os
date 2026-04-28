'use client';

import { useStore } from '@/store/app-store';
import { DockTab } from '@/types/store';

const tabs: DockTab[] = ['wolf-feed','journal','positions','orders','signals','backtester','liquidity-map','market-scanner','community-chat'];

export function BottomDock() {
  const { ui, setDockTab, order, signals, journal, news, market, hasAccess, addChat } = useStore();

  const render = () => {
    switch (ui.activeDockTab) {
      case 'positions':
        return <div className="p-3 text-sm space-y-2 overflow-auto h-full">{order.positions.length ? order.positions.map((p) => <div key={p.id} className="grid grid-cols-5 gap-2"><span>{p.symbol}</span><span>{p.side.toUpperCase()}</span><span>{p.quantity}</span><span>{p.entryPrice.toFixed(2)}</span><span>{p.pnl.toFixed(2)}</span></div>) : <div className="text-[#8b949e]">No open paper positions.</div>}</div>;
      case 'orders':
        return <div className="p-3 text-sm space-y-2 overflow-auto h-full">{order.orders.length ? order.orders.map((o) => <div key={o.id} className="grid grid-cols-6 gap-2"><span>{o.symbol}</span><span>{o.side}</span><span>{o.type}</span><span>{o.quantity}</span><span>{o.price.toFixed(2)}</span><span>{o.status}</span></div>) : <div className="text-[#8b949e]">No order history yet.</div>}</div>;
      case 'signals':
        return <div className="p-3 text-sm space-y-2 overflow-auto h-full">{signals.history.length ? signals.history.map((s) => <div key={s.id} className="grid grid-cols-5 gap-2"><span>{s.symbol}</span><span>{s.direction.toUpperCase()}</span><span>{s.confidence}%</span><span className="col-span-2 truncate">{s.reason}</span></div>) : <div className="text-[#8b949e]">No generated signals yet.</div>}</div>;
      case 'journal':
        return <div className="p-3 text-sm space-y-2 overflow-auto h-full">{journal.entries.length ? journal.entries.map((e) => <div key={e.id}><div className="text-[#f6a400]">{e.title}</div><div className="text-[#c8ced6]">{e.content}</div></div>) : <div className="text-[#8b949e]">No journal entries yet.</div>}</div>;
      case 'wolf-feed':
        return <div className="p-3 text-sm space-y-2 overflow-auto h-full">{news.feed.length ? news.feed.map((n) => <div key={n.id}>{n.message}</div>) : <div className="text-[#8b949e]">Live market feed for {market.symbolDisplay} will appear here.</div>}</div>;
      case 'community-chat':
        if (!hasAccess('community-chat')) return <div className="p-3 text-sm text-[#8b949e]">Upgrade to Elite to access community chat.</div>;
        return <div className="p-3 text-sm h-full flex flex-col gap-2"><div className="flex-1 overflow-auto space-y-1">{news.chat.map((m) => <div key={m.id}><b>{m.author}:</b> {m.text}</div>)}</div><button onClick={() => addChat(`Watching ${market.symbolDisplay} at ${new Date().toLocaleTimeString()}`)} className="h-9 rounded bg-[#10151b] border border-[rgba(212,168,83,0.2)]">Post quick message</button></div>;
      case 'market-scanner':
        if (!hasAccess('market-scanner')) return <div className="p-3 text-sm text-[#8b949e]">Upgrade to Pro for Market Scanner.</div>;
        return <div className="p-3 text-sm">Scanner connected to top mover rows via current exchange feed.</div>;
      case 'backtester':
        return <div className="p-3 text-sm">Functional shell: select symbol/timeframe and replay strategy logic (backend pending).</div>;
      case 'liquidity-map':
        return <div className="p-3 text-sm">Functional shell: liquidity heat structure panel connected to current symbol/timeframe context.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-0 rounded-xl border border-[rgba(212,168,83,0.22)] bg-[#0b1014] px-3 py-2 flex flex-col gap-2">
      <div className="flex gap-1 text-xs sm:text-sm overflow-x-auto">{tabs.map((tab) => { const locked = (tab === 'community-chat' && !hasAccess('community-chat')) || (tab === 'market-scanner' && !hasAccess('market-scanner')); return <button key={tab} onClick={() => !locked && setDockTab(tab)} className={`h-9 px-3 rounded-md whitespace-nowrap ${ui.activeDockTab === tab ? 'bg-[#131b23] text-[#f6a400] border border-[rgba(212,168,83,0.35)]' : 'text-[#c3cad3]'} ${locked ? 'opacity-40' : ''}`}>{tab.toUpperCase().replace('-', ' ')}{locked ? ' · PRO' : ''}</button>; })}</div>
      <div className="h-[220px] min-h-0 overflow-hidden border border-[rgba(212,168,83,0.12)] rounded">{render()}</div>
    </div>
  );
}
