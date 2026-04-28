'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/app-store';

export function StatusNewsBar() {
  const { market, news } = useStore();
  const [time, setTime] = useState('--:--:--');
  useEffect(() => { const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { hour12: false })), 1000); return () => clearInterval(t); }, []);

  return (
    <footer className="h-11 px-4 border-t border-[rgba(212,168,83,0.22)] bg-[#070c11] text-sm flex items-center justify-between">
      <div className="flex items-center gap-5 text-[#c3cad3] overflow-x-auto"><span className="text-[#f6a400]">WOLVRENE AI ENGINE v2.3.2</span><span className={market.connected ? 'text-[#00d084]' : 'text-[#ff4444]'}>● {market.connected ? 'Connected' : 'Reconnecting'}</span><span>DATA FEED: {market.exchange.toUpperCase()}</span><span>Time: {time}</span><span><b className="text-[#f6a400]">NEWS:</b> {news.feed[0]?.message || 'Market monitor active'}</span></div>
    </footer>
  );
}
