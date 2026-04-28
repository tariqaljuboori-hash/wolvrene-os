'use client';

import { useState } from 'react';
import {
  ChartSettings,
  ChartType,
  DEFAULT_CHART_SETTINGS,
  SettingsTab,
} from './ChartTypes';

type Props = {
  open: boolean;
  settings: ChartSettings;
  setSettings: (v: ChartSettings) => void;
  onClose: () => void;
};

const tabs: { id: SettingsTab; label: string; icon: string }[] = [
  { id: 'symbol', label: 'Symbol', icon: '⌘' },
  { id: 'status', label: 'Status line', icon: '☰' },
  { id: 'scales', label: 'Scales and lines', icon: '↕' },
  { id: 'canvas', label: 'Canvas', icon: '✎' },
  { id: 'trading', label: 'Trading', icon: '〽' },
  { id: 'alerts', label: 'Alerts', icon: '◴' },
  { id: 'events', label: 'Events', icon: '▣' },
];

export function ChartSettingsModal({
  open,
  settings,
  setSettings,
  onClose,
}: Props) {
  const [tab, setTab] = useState<SettingsTab>('symbol');

  if (!open) return null;

  function update<K extends keyof ChartSettings>(
    key: K,
    value: ChartSettings[K]
  ) {
    setSettings({ ...settings, [key]: value });
  }

  const Checkbox = ({
    k,
    label,
    note,
    indent = false,
  }: {
    k: keyof ChartSettings;
    label: string;
    note?: string;
    indent?: boolean;
  }) => (
    <label className={`flex items-start gap-3 ${indent ? 'ml-8' : ''}`}>
      <input
        type="checkbox"
        checked={Boolean(settings[k])}
        onChange={(e) => update(k, e.target.checked as never)}
        className="mt-1 h-5 w-5 accent-white"
      />
      <span>
        <span className="block text-[15px] font-semibold text-[#d9d9d9]">{label}</span>
        {note && <span className="block mt-1 text-[13px] text-[#8d8d8d]">{note}</span>}
      </span>
    </label>
  );

  const Select = ({
    k,
    label,
    options,
  }: {
    k: keyof ChartSettings;
    label: string;
    options: string[];
  }) => (
    <label className="grid grid-cols-[210px_1fr] items-center gap-4">
      <span className="text-[15px] font-semibold text-[#d8d8d8]">{label}</span>
      <select
        value={String(settings[k])}
        onChange={(e) => update(k, e.target.value as never)}
        className="h-10 w-[220px] rounded-md border border-[#4a4a4a] bg-[#242424] px-3 text-[#d8d8d8]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  const Color = ({
    k,
    label,
  }: {
    k: keyof ChartSettings;
    label: string;
  }) => (
    <label className="grid grid-cols-[210px_1fr] items-center gap-4">
      <span className="text-[15px] font-semibold text-[#d8d8d8]">{label}</span>
      <input
        type="color"
        value={String(settings[k]).startsWith('#') ? String(settings[k]) : '#999999'}
        onChange={(e) => update(k, e.target.value as never)}
        className="h-10 w-12 rounded border border-[#444] bg-[#242424]"
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-[300] bg-black/55 grid place-items-center">
      <div className="w-[820px] max-w-[94vw] max-h-[92vh] rounded-lg bg-[#202020] border border-[#3a3a3a] overflow-hidden text-white shadow-[0_30px_90px_rgba(0,0,0,0.7)]">
        <div className="h-[78px] px-7 flex items-center justify-between border-b border-[#343434]">
          <h2 className="text-[24px] font-semibold text-[#e8e8e8]">Settings</h2>
          <button onClick={onClose} className="text-4xl font-light text-[#dedede] hover:text-white">
            ×
          </button>
        </div>

        <div className="grid grid-cols-[245px_1fr] min-h-[560px] max-h-[calc(92vh-150px)]">
          <aside className="border-r border-[#3b3b3b] bg-[#1f1f1f]">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`h-[48px] w-full px-6 flex items-center gap-4 text-left ${
                  tab === t.id ? 'bg-[#303030] text-white' : 'text-[#d0d0d0] hover:bg-[#292929]'
                }`}
              >
                <span className="text-[22px] w-6">{t.icon}</span>
                <span className="font-semibold">{t.label}</span>
              </button>
            ))}
          </aside>

          <main className="p-6 overflow-y-auto bg-[#202020]">
            {tab === 'symbol' && (
              <div className="space-y-6">
                <Section title="VOLUME CANDLES">
                  <Checkbox k="showValues" label="Color bars based on previous close" />
                  <div className="grid grid-cols-[100px_80px_80px] gap-3 items-center">
                    <span className="font-semibold text-[#d8d8d8]">Body</span>
                    <ColorBox value={settings.upColor} onChange={(v) => update('upColor', v)} />
                    <ColorBox value={settings.downColor} onChange={(v) => update('downColor', v)} />
                    <span className="font-semibold text-[#d8d8d8]">Borders</span>
                    <ColorBox value={settings.upColor} onChange={(v) => update('upColor', v)} />
                    <ColorBox value={settings.downColor} onChange={(v) => update('downColor', v)} />
                    <span className="font-semibold text-[#d8d8d8]">Wick</span>
                    <ColorBox value={settings.wickColor} onChange={(v) => update('wickColor', v)} />
                    <ColorBox value={settings.downColor} onChange={(v) => update('downColor', v)} />
                  </div>
                </Section>

                <Section title="DATA MODIFICATION">
                  <Select k="precision" label="Precision" options={['default', 'price', 'integer']} />
                  <Select k="timezone" label="Timezone" options={['(UTC-4) Toronto', 'UTC', '(UTC+3) Baghdad']} />
                </Section>

                <Section title="CHART TYPE">
                  <div className="flex gap-2">
                    {(['candles', 'hollow', 'bars', 'line', 'area'] as ChartType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => update('chartType', type)}
                        className={`px-3 py-2 rounded-md border capitalize ${
                          settings.chartType === type
                            ? 'border-[#f6a400] text-[#f6a400] bg-[#2a220f]'
                            : 'border-[#444] text-[#d8d8d8] bg-[#242424]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {tab === 'status' && (
              <div className="space-y-7">
                <Section title="INSTRUMENT">
                  <Checkbox k="showLogo" label="Logo" />
                  <Select k="showTitle" label="Title" options={['true', 'false']} />
                  <Checkbox k="showValues" label="Chart values" />
                  <Checkbox k="showVolume" label="Volume" />
                  <Checkbox k="showValues" label="Bar change values" />
                  <Checkbox k="showValues" label="Last day change values" />
                </Section>

                <Section title="INDICATORS">
                  <Checkbox k="showTitle" label="Titles" />
                  <Checkbox k="showValues" label="Inputs" indent />
                  <Checkbox k="showValues" label="Values" />
                  <Checkbox k="showLogo" label="Background" />
                </Section>
              </div>
            )}

            {tab === 'scales' && (
              <div className="space-y-7">
                <Section title="PRICE SCALE">
                  <Select k="scaleCurrencyUnit" label="Currency and Unit" options={['always', 'hover', 'hidden']} />
                  <Select k="scaleMode" label="Scale modes (A and L)" options={['always', 'hover', 'hidden']} />
                  <Checkbox k="showPriceScale" label="Lock price to bar ratio" />
                  <Select k="scalesPlacement" label="Scales placement" options={['auto', 'right', 'left']} />
                </Section>

                <Section title="PRICE LABELS & LINES">
                  <Checkbox k="noOverlappingLabels" label="No overlapping labels" />
                  <Checkbox k="plusButton" label="Plus button" />
                  <Checkbox k="countdownToClose" label="Countdown to bar close" />
                  <Select k="dateFormat" label="Date format" options={["29 Sep '97", '2026-04-28', '28/04/2026']} />
                  <Select k="timeFormat" label="Time hours format" options={['24-hours', '12-hours']} />
                </Section>
              </div>
            )}

            {tab === 'canvas' && (
              <div className="space-y-7">
                <Section title="CHART BASIC STYLES">
                  <Select k="backgroundMode" label="Background" options={['solid', 'gradient']} />
                  <Color k="backgroundColor" label="Background color" />
                  <Select k="gridMode" label="Grid lines" options={['none', 'normal', 'strong']} />
                  <Color k="gridColor" label="Grid color" />
                  <Color k="crosshairColor" label="Crosshair" />
                  <Select k="watermarkMode" label="Watermark" options={['always', 'replay', 'hidden']} />
                </Section>

                <Section title="SCALES">
                  <Color k="scaleTextColor" label="Text" />
                  <Color k="gridColor" label="Lines" />
                </Section>

                <Section title="BUTTONS">
                  <Select k="navigationButtons" label="Navigation" options={['always', 'hover', 'hidden']} />
                  <Select k="paneButtons" label="Pane" options={['always', 'hover', 'hidden']} />
                </Section>
              </div>
            )}

            {tab === 'trading' && (
              <div className="space-y-7">
                <Section title="GENERAL">
                  <Checkbox k="showBuySellButtons" label="Buy/sell buttons" note="Displays buy and sell buttons directly on the chart" />
                  <Checkbox k="oneClickTrading" label="One-click trading" note="Instantly place, edit, cancel orders, or close positions without confirmation" />
                  <Checkbox k="executionSound" label="Execution sound" />
                  <Checkbox k="showPositionsOrders" label="Positions and orders" />
                  <Checkbox k="showProfitLoss" label="Profit and loss value" />
                  <Checkbox k="showExecutionMarks" label="Execution marks" />
                  <Checkbox k="extendedPriceLines" label="Extended price lines across the entire chart width" />
                </Section>
              </div>
            )}

            {tab === 'alerts' && (
              <div className="space-y-7">
                <Section title="CHART LINE VISIBILITY">
                  <Checkbox k="showAlertLines" label="Alert lines" />
                  <Checkbox k="onlyActiveAlerts" label="Only active alerts" />
                </Section>

                <Section title="NOTIFICATIONS">
                  <Checkbox k="hideToasts" label="Automatically hide toasts" />
                </Section>
              </div>
            )}

            {tab === 'events' && (
              <div className="space-y-7">
                <Section title="EVENTS">
                  <Checkbox k="showIdeas" label="Ideas" />
                  <Checkbox k="showSessionBreaks" label="Session breaks" />
                  <Checkbox k="showEconomicEvents" label="Economic events" />
                  <Checkbox k="onlyFutureEvents" label="Only future events" indent />
                  <Checkbox k="showLatestNews" label="Latest news" />
                  <Checkbox k="showNewsNotifications" label="News notification" />
                </Section>
              </div>
            )}
          </main>
        </div>

        <div className="h-[72px] px-6 border-t border-[#343434] flex items-center justify-between bg-[#202020]">
          <button className="h-10 px-4 rounded-md border border-[#555] bg-[#242424] text-[#e0e0e0]">
            Template⌄
          </button>

          <div className="flex gap-3">
            <button onClick={onClose} className="h-10 px-6 rounded-md border border-[#d8d8d8] text-white">
              Cancel
            </button>
            <button onClick={onClose} className="h-10 px-6 rounded-md bg-white text-black font-semibold">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 text-[12px] uppercase text-[#8d8d8d]">{title}</div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ColorBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const safeValue = value.startsWith('#') ? value : '#f6a400';

  return (
    <input
      type="color"
      value={safeValue}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-10 rounded-md border border-[#555] bg-[#2a2a2a]"
    />
  );
}