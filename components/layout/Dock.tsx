// filepath: components/layout/Dock.tsx
'use client';

export function Dock() {
  const items = [
    'WOLVRENE NEWS',
    'AI Engine v2.3.1 Deployed',
    'New Strategy Pack Available',
    'Backtesting Engine Improved',
    'Follow us on Discord',
    'System Status: All Systems Operational',
  ];

  return (
    <footer className="h-9 bg-[#0b1014] border-t border-[rgba(212,168,83,0.22)] px-3 flex items-center gap-3 overflow-hidden text-[11px]">
      {items.map((item, idx) => (
        <div key={item} className={`whitespace-nowrap ${idx === 0 ? 'text-[#d4a853] font-semibold' : 'text-[#9ca3af]'}`}>
          {idx > 0 && <span className="text-[#4b5563] mr-3">•</span>}
          {item}
        </div>
      ))}
    </footer>
  );
}
