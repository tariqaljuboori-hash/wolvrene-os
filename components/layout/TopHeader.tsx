'use client';

import Image from 'next/image';
import { useStore } from '@/store/app-store';

const utilityIcons = ['⌕', '✉', '🔔', '⚙'];

export function TopHeader() {
  const { state, setLayoutMode } = useStore();
  const isPro = state.layoutMode === 'pro';

  return (
    <header className="h-20 px-4 bg-[#050607] border-b border-[rgba(212,168,83,0.22)] flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <div className="w-[330px] h-full flex items-center gap-3 rounded-xl px-3 bg-[#070b10] border border-[rgba(212,168,83,0.18)]">
        <Image src="/window.svg" alt="Wolvrene logo" width={38} height={38} className="drop-shadow-[0_0_10px_rgba(246,164,0,0.35)]" />
        <div>
          <div className="text-[42px] leading-none tracking-tight text-[#f3f4f6] font-semibold"><span className="text-[#f3f4f6]">WOLV</span><span className="text-[#d4a853]">RENE</span></div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#9aa4ae]">AI Precision Trading</div>
        </div>
      </div>

      <div className="flex-1 h-full flex items-center">
        <div className="w-full h-[64px] rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] px-4 grid grid-cols-7 text-xs">
          <div className="col-span-2 flex items-center gap-3 border-r border-[rgba(212,168,83,0.16)]">
            <span className="w-6 h-6 rounded-full bg-[#f6a400] text-[#050607] text-[10px] font-bold grid place-items-center">₿</span>
            <span className="text-[#f3f4f6] font-semibold text-xl">BTCUSDT</span>
            <span className="text-[#8b949e]">▾</span>
          </div>
          <div className="flex flex-col justify-center px-3 border-r border-[rgba(212,168,83,0.16)]">
            <span className="text-[42px] leading-none text-[#00d084] font-semibold">76,778.20</span>
            <span className="text-[#00d084]">+176.90 (+0.23%)</span>
          </div>
          {[
            ['24H High', '79,459.00'],
            ['24H Low', '76,414.50'],
            ['24H Vol', '54,535.48 BTC'],
            ['Funding', '0.0100%'],
            ['Market', 'Open'],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col justify-center px-3 border-r last:border-r-0 border-[rgba(212,168,83,0.16)]">
              <span className="uppercase text-[10px] tracking-[0.12em] text-[#8b949e]">{label}</span>
              <span className={`text-lg font-semibold ${label === 'Market' ? 'text-[#00d084]' : 'text-[#f3f4f6]'}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[460px] flex justify-end items-center gap-2">
        <button className="h-12 px-5 rounded-lg text-[18px] font-semibold text-[#f6a400] border border-[rgba(246,164,0,0.45)] bg-[linear-gradient(180deg,rgba(51,33,0,0.6),rgba(20,14,6,0.9))]">◉ HUNT MODE</button>
        {utilityIcons.map((icon) => (
          <button key={icon} className="w-12 h-12 rounded-lg border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-[#d5dae0]">{icon}</button>
        ))}
        <button className="h-12 px-3 rounded-lg border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-left leading-tight">
          <div className="text-xs text-[#f3f4f6]">WOLVRENE PRO</div>
          <div className="text-[11px] text-[#d4a853]">Elite Plan ▾</div>
        </button>
        <button onClick={() => setLayoutMode(isPro ? 'normal' : 'pro')} className="h-12 px-3 rounded-lg border border-[rgba(212,168,83,0.22)] bg-[#0b1014] text-[11px] text-[#8b949e]">{isPro ? 'Normal' : 'Pro'} Mode</button>
      </div>
    </header>
  );
}
