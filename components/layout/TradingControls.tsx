'use client';

import { useStore } from '@/store/app-store';

export function TradingControls() {
  const { market, setMarketSelection } = useStore();
  return <div className="hidden"><button onClick={() => setMarketSelection({ timeframe: market.timeframe })}>Sync</button></div>;
}
