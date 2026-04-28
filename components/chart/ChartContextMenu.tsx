'use client';

type Props = {
  open: boolean;
  x: number;
  y: number;
  latestPrice?: string;
  symbol: string;
  onClose: () => void;
  onOpenSettings: () => void;
  onReset: () => void;
};

export function ChartContextMenu({
  open,
  x,
  y,
  latestPrice,
  symbol,
  onClose,
  onOpenSettings,
  onReset,
}: Props) {
  if (!open) return null;

  const items = [
    'Reset chart view',
    `Copy price ${latestPrice ?? '--'}`,
    'Paste',
    `Add alert on ${symbol}`,
    `Sell 1 ${symbol} limit`,
    `Buy 1 ${symbol} stop`,
    'Table view',
    'Object tree',
    'Chart template',
    'Remove drawings',
    'Remove indicators',
  ];

  return (
    <div
      className="fixed z-[200] w-[320px] rounded-lg bg-[#202020] border border-[#3a3a3a] shadow-[0_20px_60px_rgba(0,0,0,0.65)] text-[#e6e6e6] text-sm overflow-hidden"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item) => (
        <button
          key={item}
          className="w-full h-10 px-4 text-left hover:bg-[#2d2d2d] border-b border-[#333]"
          onClick={() => {
            if (item === 'Reset chart view') onReset();
            onClose();
          }}
        >
          {item}
        </button>
      ))}

      <button
        className="w-full h-11 px-4 text-left hover:bg-[#2d2d2d]"
        onClick={() => {
          onClose();
          onOpenSettings();
        }}
      >
        Settings...
      </button>
    </div>
  );
}