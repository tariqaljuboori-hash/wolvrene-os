'use client';

import { useStore } from '@/store/app-store';
import { Card } from '@/components/ui';

export function OrdersPanel() {
  const { order } = useStore();
  return <Card variant="default" padding="none" className="h-full overflow-auto"><div className="p-3 border-b border-[#27272a]"><h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">Orders</h3></div><div className="p-3 space-y-2 text-sm">{order.orders.length ? order.orders.map((o)=><div key={o.id} className="grid grid-cols-6 gap-2"><span>{o.symbol}</span><span>{o.side}</span><span>{o.type}</span><span>{o.quantity}</span><span>{o.price.toFixed(2)}</span><span>{o.status}</span></div>) : <span className="text-[#8b949e]">No orders yet.</span>}</div></Card>;
}
