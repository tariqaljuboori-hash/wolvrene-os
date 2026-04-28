'use client';

export function OscillatorPanel() {
  return (
    <div className="h-[170px] border-t border-[rgba(212,168,83,0.2)] bg-[#070d12] px-3 py-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#f3f4f6]">WOLVRENE PRECISION OSCILLATOR (WPO)</span>
        <span className="text-[#8b949e]">64.2</span>
        <span className="text-[#f6a400]">58.7</span>
        <span className="text-[#ff7a1a]">76.0</span>
        <span className="text-[#c8cdd3]">26.0</span>
      </div>
      <div className="mt-2 h-[95px] rounded-md border border-[rgba(212,168,83,0.12)] bg-[#081018] relative overflow-hidden">
        {[20, 50, 80].map((v) => <div key={v} className="absolute left-0 right-0 border-t border-dashed border-[#3a3f46]" style={{ top: `${v}%` }} />)}
        <svg viewBox="0 0 1000 120" className="w-full h-full">
          <path d="M0 55 C100 35 150 85 260 50 C350 22 420 95 520 64 C620 32 720 88 820 48 C900 28 960 48 1000 42" fill="none" stroke="#f6a400" strokeWidth="2" />
          <path d="M0 62 C90 80 180 20 270 70 C370 104 460 36 560 80 C660 104 760 30 860 64 C920 84 960 58 1000 52" fill="none" stroke="#ff4d22" strokeWidth="2" />
          <path d="M0 58 C110 15 220 100 330 48 C430 28 540 95 640 62 C740 24 840 78 940 30 1000 26" fill="none" stroke="#9ea5ae" strokeWidth="2" opacity="0.8" />
        </svg>
        <div className="absolute right-2 top-2 text-xs text-[#8b949e]">80.0</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#8b949e]">40.0</div>
        <div className="absolute right-2 bottom-1 text-xs text-[#8b949e]">0.0</div>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-[#b5bdc8]">
        <div className="flex gap-4">{['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'All'].map((r) => <button key={r}>{r}</button>)}</div>
        <span>15:24:45 (UTC+3)</span>
      </div>
    </div>
  );
}
