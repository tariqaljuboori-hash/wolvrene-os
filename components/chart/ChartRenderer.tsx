'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  AreaSeries,
  IChartApi,
  ISeriesApi,
  Time,
} from 'lightweight-charts';
import { Candle, ChartSettings } from './ChartTypes';

type Props = {
  candles: Candle[];
  settings: ChartSettings;
  displaySymbol: string;
  timeframe: string;
  connected: boolean;
};

function normalizeSeriesData<T extends { time: Time }>(data: T[]) {
  const map = new Map<number, T>();

  for (const item of data) {
    const numericTime = Number(item.time);

    if (!Number.isFinite(numericTime)) continue;

    const fixedTime =
      numericTime > 1000000000000
        ? Math.floor(numericTime / 1000)
        : numericTime;

    map.set(fixedTime, {
      ...item,
      time: fixedTime as Time,
    });
  }

  return Array.from(map.values()).sort(
    (a, b) => Number(a.time) - Number(b.time)
  );
}

export function ChartRenderer({
  candles,
  settings,
  displaySymbol,
  timeframe,
  connected,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const chartTypeRef = useRef(settings.chartType);
  const lastKeyRef = useRef('');

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: {
          type: ColorType.Solid,
          color: settings.backgroundColor || '#060d14',
        },
        textColor: settings.scaleTextColor || '#c8ced6',
      },
      grid: {
        vertLines: {
          color: settings.showGrid ? settings.gridColor : 'transparent',
        },
        horzLines: {
          color: settings.showGrid ? settings.gridColor : 'transparent',
        },
      },
      rightPriceScale: {
        visible: settings.showPriceScale,
        borderColor: 'rgba(212,168,83,0.18)',
        borderVisible: true,
      },
      timeScale: {
        visible: settings.showTimeScale,
        borderColor: 'rgba(212,168,83,0.18)',
        borderVisible: true,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: settings.crosshairColor || '#a8a8a8',
          visible: settings.showCrosshair,
        },
        horzLine: {
          color: settings.crosshairColor || '#a8a8a8',
          visible: settings.showCrosshair,
        },
      },
      handleScroll: true,
      handleScale: true,
    });

    chartRef.current = chart;

    const mainSeries = chart.addSeries(CandlestickSeries, {
      upColor: settings.upColor,
      downColor: settings.downColor,
      borderUpColor: settings.upColor,
      borderDownColor: settings.downColor,
      wickUpColor: settings.wickColor,
      wickDownColor: settings.wickColor,
      lastValueVisible: true,
      priceLineVisible: true,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      lastValueVisible: false,
      priceLineVisible: false,
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
      borderVisible: false,
    });

    mainSeriesRef.current = mainSeries;
    volumeSeriesRef.current = volumeSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      mainSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (chartTypeRef.current === settings.chartType && mainSeriesRef.current) {
      return;
    }

    if (mainSeriesRef.current) {
      chart.removeSeries(mainSeriesRef.current);
    }

    if (settings.chartType === 'line') {
      mainSeriesRef.current = chart.addSeries(LineSeries, {
        color: settings.downColor || '#f6a400',
        lineWidth: 2,
        lastValueVisible: true,
        priceLineVisible: true,
      });
    } else if (settings.chartType === 'area') {
      mainSeriesRef.current = chart.addSeries(AreaSeries, {
        lineColor: settings.downColor || '#f6a400',
        topColor: 'rgba(246,164,0,0.24)',
        bottomColor: 'rgba(246,164,0,0.02)',
        lineWidth: 2,
        lastValueVisible: true,
        priceLineVisible: true,
      });
    } else {
      mainSeriesRef.current = chart.addSeries(CandlestickSeries, {
        upColor: settings.upColor,
        downColor: settings.downColor,
        borderUpColor: settings.upColor,
        borderDownColor: settings.downColor,
        wickUpColor: settings.wickColor,
        wickDownColor: settings.wickColor,
        lastValueVisible: true,
        priceLineVisible: true,
      });
    }

    chartTypeRef.current = settings.chartType;
  }, [settings.chartType, settings.upColor, settings.downColor, settings.wickColor]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.applyOptions({
      layout: {
        background: {
          type: ColorType.Solid,
          color: settings.backgroundColor || '#060d14',
        },
        textColor: settings.scaleTextColor || '#c8ced6',
      },
      grid: {
        vertLines: {
          color: settings.showGrid ? settings.gridColor : 'transparent',
        },
        horzLines: {
          color: settings.showGrid ? settings.gridColor : 'transparent',
        },
      },
      rightPriceScale: {
        visible: settings.showPriceScale,
        borderVisible: true,
      },
      timeScale: {
        visible: settings.showTimeScale,
        borderVisible: true,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: {
          color: settings.crosshairColor || '#a8a8a8',
          visible: settings.showCrosshair,
        },
        horzLine: {
          color: settings.crosshairColor || '#a8a8a8',
          visible: settings.showCrosshair,
        },
      },
      handleScroll: true,
      handleScale: true,
    });

    mainSeriesRef.current?.applyOptions?.({
      upColor: settings.upColor,
      downColor: settings.downColor,
      borderUpColor: settings.upColor,
      borderDownColor: settings.downColor,
      wickUpColor: settings.wickColor,
      wickDownColor: settings.wickColor,
      lastValueVisible: true,
      priceLineVisible: true,
    });

    volumeSeriesRef.current?.applyOptions?.({
      lastValueVisible: false,
      priceLineVisible: false,
    });
  }, [settings]);

  useEffect(() => {
    const chart = chartRef.current;
    const mainSeries = mainSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;

    if (!chart || !mainSeries || !volumeSeries) return;

    const clean = candles.filter(
      (c) =>
        Number.isFinite(c.time) &&
        Number.isFinite(c.o) &&
        Number.isFinite(c.h) &&
        Number.isFinite(c.l) &&
        Number.isFinite(c.c)
    );

    if (!clean.length) {
      mainSeries.setData([]);
      volumeSeries.setData([]);
      return;
    }

    const priceData = clean.map((c) => ({
      time: Math.floor(c.time / 1000) as Time,
      open: c.o,
      high: c.h,
      low: c.l,
      close: c.c,
      value: c.c,
    }));

    const volumeData = clean.map((c) => ({
      time: Math.floor(c.time / 1000) as Time,
      value: Number.isFinite(c.v) ? c.v : 0,
      color:
        c.c >= c.o
          ? settings.volumeUpColor || 'rgba(145,150,156,0.45)'
          : settings.volumeDownColor || 'rgba(246,164,0,0.48)',
    }));

    const cleanPriceData = normalizeSeriesData(priceData);
    const cleanVolumeData = normalizeSeriesData(volumeData);

    if (settings.chartType === 'line' || settings.chartType === 'area') {
      mainSeries.setData(
        cleanPriceData.map((c) => ({
          time: c.time,
          value: c.close,
        }))
      );
    } else {
      mainSeries.setData(cleanPriceData);
    }

    volumeSeries.setData(cleanVolumeData);

    const key = `${displaySymbol}-${timeframe}`;

    if (lastKeyRef.current !== key) {
      chart.timeScale().fitContent();
      lastKeyRef.current = key;
    }
  }, [
    candles,
    settings.chartType,
    settings.volumeUpColor,
    settings.volumeDownColor,
    displaySymbol,
    timeframe,
  ]);

  return (
    <div className="relative h-full w-full bg-[#060d14]">
      <div ref={containerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-[#f3f4f6]">
          {displaySymbol} · {timeframe} · WOLVRENE
        </span>

        <span
          className={
            connected
              ? 'text-[9px] text-[#00d084]'
              : 'text-[9px] text-[#ff4444]'
          }
        >
          {connected ? 'LIVE' : 'RECONNECT'}
        </span>
      </div>

      {settings.showLogo && (
        <Image
          src="/wolvrene-logo.png"
          alt="Wolvrene watermark"
          width={360}
          height={360}
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.045]"
        />
      )}
    </div>
  );
}