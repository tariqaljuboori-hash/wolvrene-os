// filepath: components/layout/RightPanel.tsx
'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui';

interface WatchlistItem {
  id: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  price: number;
  amount: string;
  status: string;
}

const watchlistData: WatchlistItem[] = [
  { id: '1', symbol: 'BTC/USDT', price: 67432.50, change: 1250.30, changePercent: 1.89 },
  { id: '2', symbol: 'ETH/USDT', price: 3456.78, change: -45.20, changePercent: -1.29 },
  { id: '3', symbol: 'SOL/USDT', price: 178.45, change: 12.30, changePercent: 7.41 },
  { id: '4', symbol: 'BNB/USDT', price: 598.20, change: 8.50, changePercent: 1.44 },
  { id: '5', symbol: 'XRP/USDT', price: 0.5234, change: 0.0123, changePercent: 2.41 },
  { id: '6', symbol: 'DOGE/USDT', price: 0.1234, change: -0.0023, changePercent: -1.83 },
  { id: '7', symbol: 'ADA/USDT', price: 0.4523, change: 0.0234, changePercent: 5.45 },
  { id: '8', symbol: 'AVAX/USDT', price: 35.67, change: 1.23, changePercent: 3.57 },
];

const ordersData: Order[] = [
  { id: '1', symbol: 'BTC/USDT', side: 'buy', type: 'limit', price: 67000, amount: '0.5 BTC', status: 'pending' },
  { id: '2', symbol: 'ETH/USDT', side: 'sell', type: 'market', price: 3456.78, amount: '2 ETH', status: 'filled' },
];

type TabType = 'watchlist' | 'orders' | 'ai';

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('watchlist');

  return (
    <div className="w-72 bg-[#0d0d0f] border-l border-[#1f1f23] flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#1f1f23]">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`
            flex-1 py-3 text-xs font-medium transition-colors border-b-2
            ${activeTab === 'watchlist' 
              ? 'text-[#e87b3a] border-[#e87b3a]' 
              : 'text-[#71717a] border-transparent hover:text-[#a1a1aa]'
            }
          `}
        >
          Watchlist
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`
            flex-1 py-3 text-xs font-medium transition-colors border-b-2
            ${activeTab === 'orders' 
              ? 'text-[#e87b3a] border-[#e87b3a]' 
              : 'text-[#71717a] border-transparent hover:text-[#a1a1aa]'
            }
          `}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`
            flex-1 py-3 text-xs font-medium transition-colors border-b-2
            ${activeTab === 'ai' 
              ? 'text-[#e87b3a] border-[#e87b3a]' 
              : 'text-[#71717a] border-transparent hover:text-[#a1a1aa]'
            }
          `}
        >
          AI
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'watchlist' && (
          <div className="divide-y divide-[#1f1f23]">
            {watchlistData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 hover:bg-[#18181b] cursor-pointer">
                <div>
                  <div className="text-[#fafafa] font-medium text-sm">{item.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#fafafa] font-medium text-sm">${item.price.toLocaleString()}</div>
                  <div className={`text-xs ${item.change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="p-3 space-y-3">
            {ordersData.map((order) => (
              <div key={order.id} className="bg-[#18181b] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={order.side === 'buy' ? 'success' : 'error'}>
                      {order.side.toUpperCase()}
                    </Badge>
                    <span className="text-[#fafafa] font-medium text-sm">{order.symbol}</span>
                  </div>
                  <Badge variant="default">{order.type.toUpperCase()}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-[#71717a]">Price: </span>
                    <span className="text-[#fafafa]">${order.price.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[#71717a]">Amount: </span>
                    <span className="text-[#fafafa]">{order.amount}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-[#71717a]">{order.status}</span>
                  <button className="text-xs text-[#ef4444] hover:text-[#f87171]">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="p-3 space-y-3">
            {/* AI Signal */}
            <div className="bg-[#18181b] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></div>
                <span className="text-[#fafafa] font-medium text-sm">AI Signal</span>
                <Badge variant="success">Strong Buy</Badge>
              </div>
              <p className="text-[#a1a1aa] text-xs mb-2">
                Bullish divergence detected on RSI. Volume increasing on up days.
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#71717a]">Confidence: </span>
                <span className="text-[#22c55e] font-medium">85%</span>
              </div>
            </div>

            {/* Key Levels */}
            <div className="bg-[#18181b] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#fafafa] font-medium text-sm">Key Levels</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a]">Support</span>
                  <span className="text-[#22c55e]">$66,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a]">Resistance</span>
                  <span className="text-[#ef4444]">$68,200</span>
                </div>
              </div>
            </div>

            {/* Market Sentiment */}
            <div className="bg-[#18181b] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#fafafa] font-medium text-sm">Sentiment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#27272a] rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-gradient-to-r from-[#22c55e] to-[#e87b3a] rounded-full"></div>
                </div>
                <span className="text-[#22c55e] text-sm font-medium">70%</span>
              </div>
              <div className="flex justify-between text-xs text-[#71717a] mt-1">
                <span>Sell</span>
                <span>Buy</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}