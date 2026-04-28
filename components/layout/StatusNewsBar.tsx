'use client';

import { useEffect, useState } from 'react';

export function StatusNewsBar() {
  const [time, setTime] = useState('--:--:--');
  const [feedStatus, setFeedStatus] = useState<'Connected' | 'Reconnecting'>(
    'Connected'
  );

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          hour12: false,
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    ws.onopen = () => setFeedStatus('Connected');
    ws.onclose = () => setFeedStatus('Reconnecting');
    ws.onerror = () => setFeedStatus('Reconnecting');

    return () => {
      clearInterval(timer);
      ws.close();
    };
  }, []);

  return (
    <footer className="h-11 px-4 border-t border-[rgba(212,168,83,0.22)] bg-[#070c11] text-sm flex items-center justify-between">
      <div className="flex items-center gap-5 text-[#c3cad3]">
        <span className="text-[#f6a400]">WOLVRENE AI ENGINE v2.2.1</span>

        <span className={feedStatus === 'Connected' ? 'text-[#00d084]' : 'text-[#ff4444]'}>
          ● {feedStatus}
        </span>

        <span>DATA FEED: BINANCE LIVE</span>
        <span>Ping: <span className="text-[#00d084]">Live WS</span></span>
        <span>Time: {time}</span>

        <span>
          <b className="text-[#f6a400]">WOLVRENE NEWS:</b> Binance live market data MVP active
        </span>
      </div>

      <div className="flex gap-3 text-[#8b949e]">
        <span>f</span>
        <span>𝕏</span>
        <span>◉</span>
        <span>✉</span>
      </div>
    </footer>
  );
}