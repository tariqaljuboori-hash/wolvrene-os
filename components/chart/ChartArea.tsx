// filepath: components/chart/ChartArea.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui';

// Chart data interface for real data integration
export interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface ChartConfig {
  symbol: string;
  timeframe: string;
  showVolume: boolean;
  showGrid: boolean;
}

// Mock data generator for demo
function generateMockData(count: number = 100): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let basePrice = 67000;
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const volatility = (Math.random() - 0.5) * 200;
    const open = basePrice + volatility;
    const close = open + (Math.random() - 0.5) * 150;
    const high = Math.max(open, close) + Math.random() * 50;
    const low = Math.min(open, close) - Math.random() * 50;
    
    data.push({
      time: now - (count - i) * 60000,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000000,
    });
    
    basePrice = close;
  }
  
  return data;
}

export function ChartArea() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Load mock data
  useEffect(() => {
    setIsLoading(true);
    // Simulate data loading
    setTimeout(() => {
      setData(generateMockData(100));
      setIsLoading(false);
    }, 300);
  }, [selectedTimeframe]);

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W', '1M'];
  
  const currentPrice = data.length > 0 ? data[data.length - 1].close : 0;
  const previousPrice = data.length > 1 ? data[data.length - 2].close : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

  // Calculate price range for chart scaling
  const prices = data.flatMap(d => [d.high, d.low]);
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0b] p-2">
      {/* Chart Header - Compact */}
      <div className="flex items-center justify-between px-2 py-1 mb-2">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-[#fafafa]">BTC/USDT</span>
          <span className="text-xl font-bold text-[#fafafa]">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <Badge variant={priceChange >= 0 ? 'success' : 'error'}>
            {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`
                px-2 py-1 rounded text-xs font-medium transition-colors
                ${selectedTimeframe === tf 
                  ? 'bg-[#e87b3a] text-white' 
                  : 'text-[#71717a] hover:text-[#fafafa] hover:bg-[#1f1f23]'
                }
              `}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div 
        ref={chartRef}
        className="flex-1 relative bg-[#0d0d0f] rounded-lg overflow-hidden"
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#71717a]">Loading chart...</div>
          </div>
        ) : (
          <>
            {/* Grid Lines */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Horizontal grid */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-b border-[#1f1f23]"
                  style={{ top: `${(i + 1) * 16.66}%` }}
                />
              ))}
              {/* Vertical grid */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-r border-[#1f1f23]"
                  style={{ left: `${(i + 1) * 12.5}%` }}
                />
              ))}
            </div>

            {/* Candlestick Chart */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="candleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Candlesticks */}
              {data.map((candle, i) => {
                const x = (i / (data.length - 1)) * 100;
                const candleWidth = 100 / data.length * 0.6;
                const isGreen = candle.close >= candle.open;
                const color = isGreen ? '#22c55e' : '#ef4444';
                
                const highY = 100 - ((candle.high - minPrice) / priceRange) * 100;
                const lowY = 100 - ((candle.low - minPrice) / priceRange) * 100;
                const openY = 100 - ((candle.open - minPrice) / priceRange) * 100;
                const closeY = 100 - ((candle.close - minPrice) / priceRange) * 100;
                
                return (
                  <g key={i}>
                    {/* Wick */}
                    <line
                      x1={`${x}%`}
                      y1={`${highY}%`}
                      x2={`${x}%`}
                      y2={`${lowY}%`}
                      stroke={color}
                      strokeWidth="1"
                    />
                    {/* Body */}
                    <rect
                      x={`${x - candleWidth/2}%`}
                      y={`${Math.min(openY, closeY)}%`}
                      width={`${candleWidth}%`}
                      height={`${Math.abs(closeY - openY)}%`}
                      fill={color}
                      rx="1"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Current Price Line */}
            {data.length > 0 && (
              <div 
                className="absolute right-0 flex items-center"
                style={{
                  top: `${100 - ((currentPrice - minPrice) / priceRange) * 100}%`,
                }}
              >
                <div className="h-px flex-1 bg-[#e87b3a]" />
                <div className="bg-[#e87b3a] px-2 py-0.5 rounded-l text-xs font-medium text-white">
                  ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            )}

            {/* Chart Controls */}
            <div className="absolute top-2 right-2 flex gap-1">
              <button className="p-1.5 bg-[#18181b] hover:bg-[#27272a] rounded transition-colors" title="Zoom In">
                <svg className="w-3.5 h-3.5 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
              <button className="p-1.5 bg-[#18181b] hover:bg-[#27272a] rounded transition-colors" title="Zoom Out">
                <svg className="w-3.5 h-3.5 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              <button className="p-1.5 bg-[#18181b] hover:bg-[#27272a] rounded transition-colors" title="Settings">
                <svg className="w-3.5 h-3.5 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Chart Footer - Stats */}
      <div className="grid grid-cols-4 gap-2 mt-2 px-2">
        <div className="bg-[#18181b] rounded px-2 py-1">
          <div className="text-[#71717a] text-xs">24h High</div>
          <div className="text-[#fafafa] text-sm font-medium">${(currentPrice * 1.02).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="bg-[#18181b] rounded px-2 py-1">
          <div className="text-[#71717a] text-xs">24h Low</div>
          <div className="text-[#fafafa] text-sm font-medium">${(currentPrice * 0.98).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="bg-[#18181b] rounded px-2 py-1">
          <div className="text-[#71717a] text-xs">24h Vol</div>
          <div className="text-[#fafafa] text-sm font-medium">$28.5B</div>
        </div>
        <div className="bg-[#18181b] rounded px-2 py-1">
          <div className="text-[#71717a] text-xs">Open Interest</div>
          <div className="text-[#fafafa] text-sm font-medium">$12.8B</div>
        </div>
      </div>
    </div>
  );
}