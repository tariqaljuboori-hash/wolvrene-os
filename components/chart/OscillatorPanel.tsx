'use client';

import { useEffect, useState } from 'react';

export function OscillatorPanel() {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          hour12: false,
        })
      );
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[170px] border-t border-[rgba(212,168,83,0.2)] bg-[#070d12] px-3 py-2">
      <div className="flex items-center gap-2 text-[12px] leading-none">
        <span className="text-[#f3f4f6] font-medium tracking-[-0.01em]">
          WOLVRENE PRECISION OSCILLATOR (WPO)
        </span>
        <span className="text-[#8b949e]">64.2</span>
        <span className="text-[#f6a400]">58.7</span>
        <span className="text-[#ff7a1a]">76.0</span>
        <span className="text-[#c8cdd3]">26.0</span>
      </div>

      <div className="mt-2 h-[95px] rounded-md border border-[rgba(212,168,83,0.12)] bg-[#081018] relative overflow-hidden">
        {[24, 50, 76].map((v) => (
          <div
            key={v}
            className="absolute left-0 right-0 border-t border-dashed border-[#3a3f46]"
            style={{ top: `${v}%` }}
          />
        ))}

        <svg viewBox="0 0 1000 120" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wpoGlow" x1="0" x2="1">
              <stop offset="0%" stopColor="#f6a400" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#f6a400" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f6a400" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <path
            d="M0 55 C100 35 150 85 260 50 C350 22 420 95 520 64 C620 32 720 88 820 48 C900 28 960 48 1000 42"
            fill="none"
            stroke="#f6a400"
            strokeWidth="2"
          />
          <path
            d="M0 62 C90 80 180 20 270 70 C370 104 460 36 560 80 C660 104 760 30 860 64 C920 84 960 58 1000 52"
            fill="none"
            stroke="#ff4d22"
            strokeWidth="2"
          />
          <path
            d="M0 58 C110 15 220 100 330 48 C430 28 540 95 640 62 C740 24 840 78 940 30 1000 26"
            fill="none"
            stroke="#9ea5ae"
            strokeWidth="1.8"
            opacity="0.8"
          />
        </svg>

        <div className="absolute right-2 top-2 text-[11px] text-[#8b949e]">80.0</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#8b949e]">
          40.0
        </div>
        <div className="absolute right-2 bottom-1 text-[11px] text-[#8b949e]">0.0</div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[12px] text-[#b5bdc8]">
        <div className="flex gap-4">
          {['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'All'].map((r) => (
            <button key={r} className="hover:text-[#f6a400] transition-colors">
              {r}
            </button>
          ))}
        </div>

        <span>{time} (UTC+3)</span>
      </div>
    </div>
  );
}