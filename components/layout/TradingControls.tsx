// filepath: components/layout/TradingControls.tsx
'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui';

interface SymbolInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const symbols: SymbolInfo[] = [
  { symbol: 'BTC/USDT', name: 'Bitcoin', price: 67432.50, change: 1250.30, changePercent: 1.89 },
  { symbol: 'ETH/USDT', name: 'Ethereum', price: 3456.78, change: -45.20, changePercent: -1.29 },
  { symbol: 'SOL/USDT', name: 'Solana', price: 178.45, change: 12.30, changePercent: 7.41 },
  { symbol: 'BNB/USDT', name: 'BNB', price: 598.20, change: 8.50, changePercent: 1.44 },
];

const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W', '1M'];

export function TradingControls() {
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');

  return (
    <div className="h-12 bg-[#0d0d0f] border-b border-[#1f1f23] flex items-center justify-between px-4">
      {/* Left Section - Symbol Selector */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#e87b3a] to-[#d4a853] rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="text-[#fafafa] font-semibold text-sm">WOLVRENE</span>
        </div>

        {/* Symbol Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1f1f23] rounded-md hover:bg-[#27272a] transition-colors">
            <span className="text-[#fafafa] font-semibold">{selectedSymbol.symbol}</span>
            <svg className="w-4 h-4 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute left-0 top-full mt-1 w-64 bg-[#0d0d0f] border border-[#27272a] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {symbols.map((sym) => (
              <button
                key={sym.symbol}
                onClick={() => setSelectedSymbol(sym)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#1f1f23]"
              >
                <div className="text-left">
                  <div className="text-[#fafafa] font-medium">{sym.symbol}</div>
                  <div className="text-[#71717a] text-xs">{sym.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#fafafa]">${sym.price.toLocaleString()}</div>
                  <div className={`text-xs ${sym.change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {sym.change >= 0 ? '+' : ''}{sym.changePercent.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Price Display */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-[#fafafa]">${selectedSymbol.price.toLocaleString()}</span>
          <Badge variant={selectedSymbol.change >= 0 ? 'success' : 'error'}>
            {selectedSymbol.change >= 0 ? '+' : ''}{selectedSymbol.changePercent.toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Center Section - Timeframes */}
      <div className="flex items-center gap-1 bg-[#18181b] rounded-lg p-1">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setSelectedTimeframe(tf)}
            className={`
              px-3 py-1 rounded-md text-xs font-medium transition-colors
              ${selectedTimeframe === tf 
                ? 'bg-[#e87b3a] text-white' 
                : 'text-[#71717a] hover:text-[#fafafa]'
              }
            `}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Right Section - Trading Actions */}
      <div className="flex items-center gap-2">
        {/* Buy Button */}
        <button className="px-4 py-1.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm rounded-md transition-colors">
          BUY
        </button>
        
        {/* Sell Button */}
        <button className="px-4 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold text-sm rounded-md transition-colors">
          SELL
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[#27272a] mx-2" />

        {/* Quick Actions */}
        <button className="p-2 hover:bg-[#1f1f23] rounded-md transition-colors" title="Fullscreen">
          <svg className="w-4 h-4 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        <button className="p-2 hover:bg-[#1f1f23] rounded-md transition-colors" title="Settings">
          <svg className="w-4 h-4 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>
    </div>
  );
}