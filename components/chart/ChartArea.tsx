'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/app-store';
import { ChartToolRow } from './ChartToolRow';
import { OscillatorPanel } from './OscillatorPanel';
import { ChartRenderer } from './ChartRenderer';
import { ChartContextMenu } from './ChartContextMenu';
import { ChartSettingsModal } from './ChartSettingsModal';
import {
  ChartSettings,
  DEFAULT_CHART_SETTINGS,
  INTERVAL_MAP,
  formatPrice,
  loadChartSettings,
  saveChartSettings,
} from './ChartTypes';
import { useMarketCandles } from './useMarketCandles';
import { useMarketData } from './useMarketData';

export function ChartArea() {
  const { state } = useStore();

  const symbol = state.currentExchangeSymbol || 'BTCUSDT';
  const displaySymbol = state.currentSymbol || 'BTCUSDT.P';
  const timeframe = state.currentTimeframe || '2h';
  const interval = INTERVAL_MAP[timeframe] ?? timeframe;

  const { candles, connected } = useMarketCandles(
    state.currentExchange,
    symbol,
    interval
  );

  // Live market data for current symbol
  const { marketData, loading: marketLoading } = useMarketData(symbol, state.currentExchange);

  const [settings, setSettings] = useState<ChartSettings>(DEFAULT_CHART_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menu, setMenu] = useState({ open: false, x: 0, y: 0 });

  useEffect(() => {
    setSettings(loadChartSettings());
  }, []);

  useEffect(() => {
    saveChartSettings(settings);
  }, [settings]);

  const latest = candles.at(-1);

  return (
    <section className="h-full min-h-0 rounded-xl border border-[rgba(212,168,83,0.22)] bg-[#0b1014] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      <ChartToolRow onSettings={() => setSettingsOpen(true)} />

      <div
        className="relative h-[calc(100%-214px)] min-h-[420px] bg-[#060d14] border-b border-[rgba(212,168,83,0.14)] overflow-hidden"
        onContextMenu={(e) => {
          e.preventDefault();
          setMenu({ open: true, x: e.clientX, y: e.clientY });
        }}
        onClick={() => setMenu((p) => ({ ...p, open: false }))}
      >
        <div className="absolute left-4 top-4 z-20 pointer-events-none">
          {settings.showTitle && (
            <div className="text-[16px] font-medium text-[#f3f4f6]">
              {displaySymbol} · {timeframe} · WOLVRENE
            </div>
          )}

          {/* Live price display from market data */}
          {marketData && (
            <div className="mt-2 text-[24px] font-bold text-[#f3f4f6]">
              ${marketData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className={`ml-3 text-[14px] ${marketData.change >= 0 ? 'text-[#00d084]' : 'text-[#ff4444]'}`}>
                {marketData.change >= 0 ? '+' : ''}{marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
              </span>
            </div>
          )}

          {latest && settings.showValues && (
            <div className="mt-2 text-[12px] text-[#ff4b42]">
              O {latest.o.toFixed(2)} &nbsp;
              H {latest.h.toFixed(2)} &nbsp;
              L {latest.l.toFixed(2)} &nbsp;
              C {latest.c.toFixed(2)}
            </div>
          )}

          {latest && settings.showVolume && (
            <div className="mt-2 text-[17px] text-[#f3f4f6]">
              Vol · {symbol.replace('USDT', '')}{' '}
              <span className="text-[#ff6633]">{latest.v.toFixed(2)}</span>
            </div>
          )}
        </div>

        <ChartRenderer
          candles={candles}
          settings={settings}
          displaySymbol={displaySymbol}
          timeframe={timeframe}
          connected={connected}
        />

        <div className="absolute left-4 bottom-2 z-20 text-[11px]">
          <span className={connected ? 'text-[#00d084]' : 'text-[#ff4444]'}>
            ● {connected ? `${state.currentExchange.toUpperCase()} LIVE` : 'RECONNECTING'}
          </span>
        </div>

        <ChartContextMenu
          open={menu.open}
          x={menu.x}
          y={menu.y}
          latestPrice={latest ? formatPrice(latest.c) : undefined}
          symbol={displaySymbol}
          onClose={() => setMenu((p) => ({ ...p, open: false }))}
          onOpenSettings={() => setSettingsOpen(true)}
          onReset={() => window.location.reload()}
        />
      </div>

      <OscillatorPanel />

      <ChartSettingsModal
        open={settingsOpen}
        settings={settings}
        setSettings={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </section>
  );
}