'use client';

import Image from 'next/image';

export function AICommandPanel() {
  return (
    <section className="rounded-xl bg-[#0b1014] border border-[rgba(212,168,83,0.22)] p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[#f3f4f6] text-xl">WOLVRENE AI COMMAND</h3>
        <span className="px-2 py-1 text-xs rounded bg-[#1b2028] text-[#f6a400] border border-[rgba(212,168,83,0.25)]">BETA</span>
      </div>
      <div className="mt-3 grid grid-cols-[120px_1fr] gap-3">
        <div className="h-[120px] rounded-full border-4 border-[#f6a400] bg-[#0a1117] grid place-items-center shadow-[0_0_18px_rgba(246,164,0,0.28)]">
          <Image src="/window.svg" alt="Wolvrene logo" width={64} height={64} className="opacity-95" />
        </div>
        <div className="rounded-lg border border-[rgba(212,168,83,0.18)] bg-[#10151b] p-3 text-sm">
          <div>Trend <span className="text-[#00d084] font-semibold">BULLISH</span></div>
          <div className="mt-1">Confidence <span className="text-[#f3f4f6] text-3xl">68%</span></div>
          <ul className="mt-2 list-disc pl-5 text-[#c8ced6] space-y-1">
            <li>Market structure aligned</li>
            <li>Liquidity sweep detected</li>
            <li>High probability setup</li>
            <li>Next key level: 78,800</li>
          </ul>
        </div>
      </div>
      <button className="w-full mt-3 h-10 rounded border border-[rgba(212,168,83,0.28)] bg-[#10151b] text-[#f3f4f6]">Open Full Analysis</button>
    </section>
  );
}
