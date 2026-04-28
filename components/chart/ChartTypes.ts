export type Candle = {
  time: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

export type ChartType = 'candles' | 'hollow' | 'bars' | 'line' | 'area';

export type SettingsTab =
  | 'symbol'
  | 'status'
  | 'scales'
  | 'canvas'
  | 'trading'
  | 'alerts'
  | 'events';

export type ChartSettings = {
  chartType: ChartType;

  showLogo: boolean;
  showTitle: boolean;
  showVolume: boolean;
  showValues: boolean;
  showGrid: boolean;
  showPriceScale: boolean;
  showTimeScale: boolean;
  showCrosshair: boolean;

  showBuySellButtons: boolean;
  oneClickTrading: boolean;
  executionSound: boolean;
  showPositionsOrders: boolean;
  showProfitLoss: boolean;
  showExecutionMarks: boolean;
  extendedPriceLines: boolean;

  showAlertLines: boolean;
  onlyActiveAlerts: boolean;
  hideToasts: boolean;

  showIdeas: boolean;
  showSessionBreaks: boolean;
  showEconomicEvents: boolean;
  onlyFutureEvents: boolean;
  showLatestNews: boolean;
  showNewsNotifications: boolean;

  backgroundMode: 'solid' | 'gradient';
  gridMode: 'none' | 'normal' | 'strong';
  watermarkMode: 'always' | 'replay' | 'hidden';
  navigationButtons: 'always' | 'hover' | 'hidden';
  paneButtons: 'always' | 'hover' | 'hidden';

  scaleCurrencyUnit: 'always' | 'hover' | 'hidden';
  scaleMode: 'always' | 'hover' | 'hidden';
  scalesPlacement: 'auto' | 'right' | 'left';
  noOverlappingLabels: boolean;
  plusButton: boolean;
  countdownToClose: boolean;

  dateFormat: string;
  timeFormat: '12-hours' | '24-hours';
  timezone: string;
  precision: 'default' | 'price' | 'integer';

  upColor: string;
  downColor: string;
  wickColor: string;
  volumeUpColor: string;
  volumeDownColor: string;
  backgroundColor: string;
  gridColor: string;
  crosshairColor: string;
  scaleTextColor: string;
};

export const DEFAULT_CHART_SETTINGS: ChartSettings = {
  chartType: 'candles',

  showLogo: true,
  showTitle: true,
  showVolume: true,
  showValues: true,
  showGrid: true,
  showPriceScale: true,
  showTimeScale: true,
  showCrosshair: true,

  showBuySellButtons: true,
  oneClickTrading: false,
  executionSound: false,
  showPositionsOrders: true,
  showProfitLoss: true,
  showExecutionMarks: true,
  extendedPriceLines: true,

  showAlertLines: true,
  onlyActiveAlerts: true,
  hideToasts: true,

  showIdeas: false,
  showSessionBreaks: false,
  showEconomicEvents: true,
  onlyFutureEvents: true,
  showLatestNews: true,
  showNewsNotifications: false,

  backgroundMode: 'solid',
  gridMode: 'normal',
  watermarkMode: 'always',
  navigationButtons: 'hover',
  paneButtons: 'hover',

  scaleCurrencyUnit: 'always',
  scaleMode: 'hover',
  scalesPlacement: 'auto',
  noOverlappingLabels: true,
  plusButton: true,
  countdownToClose: true,

  dateFormat: "29 Sep '97",
  timeFormat: '24-hours',
  timezone: '(UTC-4) Toronto',
  precision: 'default',

  upColor: '#f2f4f7',
  downColor: '#f6a400',
  wickColor: '#9ea5ae',
  volumeUpColor: 'rgba(145,150,156,0.45)',
  volumeDownColor: 'rgba(246,164,0,0.48)',
  backgroundColor: '#060d14',
  gridColor: 'rgba(90,102,116,0.13)',
  crosshairColor: '#a8a8a8',
  scaleTextColor: '#c8ced6',
};

export const INTERVAL_MAP: Record<string, string> = {
  '1m': '1m',
  '3m': '3m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '2h': '2h',
  '4h': '4h',
  '1d': '1d',
  D: '1d',
  W: '1w',
  M: '1M',
};

export function formatPrice(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: value > 100 ? 2 : 4,
    maximumFractionDigits: value > 100 ? 2 : 5,
  });
}

export function formatVolume(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(2);
}

export function loadChartSettings(): ChartSettings {
  if (typeof window === 'undefined') return DEFAULT_CHART_SETTINGS;

  try {
    const saved = window.localStorage.getItem('wolvrene-chart-settings');
    if (!saved) return DEFAULT_CHART_SETTINGS;
    return { ...DEFAULT_CHART_SETTINGS, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_CHART_SETTINGS;
  }
}

export function saveChartSettings(settings: ChartSettings) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('wolvrene-chart-settings', JSON.stringify(settings));
}