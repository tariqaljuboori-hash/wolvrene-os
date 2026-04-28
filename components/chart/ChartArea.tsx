'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/store/app-store';
import { ChartToolRow } from './ChartToolRow';
import { OscillatorPanel } from './OscillatorPanel';
import { ChartRenderer } from './ChartRenderer';
import { ChartContextMenu } from './ChartContextMenu';
import { ChartSettingsModal } from './ChartSettingsModal';
import { ChartSettings, DEFAULT_CHART_SETTINGS, formatPrice, loadChartSettings, saveChartSettings } from './ChartTypes';
import { useMarketCandles } from './useMarketCandles';

export function ChartArea() {
  const { market, tools, addDrawing, clearDrawings, selectDrawing, deleteDrawing } = useStore();
  const { candles, connected, error } = useMarketCandles();
  const [settings, setSettings] = useState<ChartSettings>(DEFAULT_CHART_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menu, setMenu] = useState({ open: false, x: 0, y: 0 });

  useEffect(() => setSettings(loadChartSettings()), []);
  useEffect(() => saveChartSettings(settings), [settings]);
  const latest = candles.at(-1);
  const visibleDrawings = useMemo(() => tools.drawings.filter((d) => d.symbol === market.symbolDisplay && d.timeframe === market.timeframe), [tools.drawings, market.symbolDisplay, market.timeframe]);
  const selected = visibleDrawings.find((d) => d.selected);

  return (
    <section className="h-full min-h-0 rounded-xl border border-[rgba(212,168,83,0.22)] bg-[#0b1014] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      <ChartToolRow onSettings={() => setSettingsOpen(true)} />
      <div className="relative h-[calc(100%-214px)] min-h-[320px] lg:min-h-[420px] bg-[#060d14] border-b border-[rgba(212,168,83,0.14)] overflow-hidden" onContextMenu={(e) => { e.preventDefault(); setMenu({ open: true, x: e.clientX, y: e.clientY }); }} onClick={(e) => {
        if (tools.activeTool === 'Crosshair') return;
        const rect = e.currentTarget.getBoundingClientRect();
        addDrawing({ tool: tools.activeTool, x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100, symbol: market.symbolDisplay, timeframe: market.timeframe });
      }}>
        <div className="absolute left-4 top-4 z-20 pointer-events-none"><div className="text-[14px] font-medium text-[#f3f4f6]">{market.symbolDisplay} · {market.timeframe} · {market.exchange.toUpperCase()}</div>{market.loading && <div className="mt-2 text-xs text-[#f6a400]">Loading market feed...</div>}{error && <div className="mt-2 text-xs text-[#ff4444]">{error}</div>}</div>
        <div className="absolute right-4 top-4 z-20 flex gap-2"><button onClick={(e) => { e.stopPropagation(); clearDrawings(); }} className="h-7 px-2 rounded bg-[#10151b] border border-[rgba(212,168,83,0.2)] text-xs text-[#d8dde5]">Clear All</button>{selected && <button onClick={(e) => { e.stopPropagation(); deleteDrawing(selected.id); }} className="h-7 px-2 rounded bg-[#2a1515] border border-[rgba(255,68,68,0.3)] text-xs text-[#ff9999]">Delete</button>}</div>
        <ChartRenderer candles={candles} settings={settings} displaySymbol={market.symbolDisplay} timeframe={market.timeframe} connected={connected} />
        {visibleDrawings.map((mark) => <button key={mark.id} className="absolute z-30 text-[10px]" style={{ left: `${mark.x}%`, top: `${mark.y}%`, transform: 'translate(-50%, -50%)' }} onClick={(e) => { e.stopPropagation(); selectDrawing(mark.id); }}><span className={`rounded px-1.5 py-0.5 ${mark.selected ? 'bg-[#f6a400] text-[#050607]' : 'bg-[rgba(12,17,23,0.9)] text-[#f6a400]'} border border-[rgba(246,164,0,0.35)]`}>{mark.tool}</span></button>)}
        <div className="absolute left-4 bottom-2 z-20 text-[11px]"><span className={connected ? 'text-[#00d084]' : 'text-[#ff4444]'}>● {connected ? 'LIVE' : 'RECONNECTING'}</span>{latest && <span className="ml-2 text-[#d8dde5]">Last: {formatPrice(latest.c)}</span>}</div>
        <ChartContextMenu open={menu.open} x={menu.x} y={menu.y} latestPrice={latest ? formatPrice(latest.c) : undefined} symbol={market.symbolDisplay} onClose={() => setMenu((p) => ({ ...p, open: false }))} onOpenSettings={() => setSettingsOpen(true)} onReset={clearDrawings} />
      </div>
      <OscillatorPanel candles={candles} />
      <ChartSettingsModal open={settingsOpen} settings={settings} setSettings={setSettings} onClose={() => setSettingsOpen(false)} />
    </section>
  );
}
