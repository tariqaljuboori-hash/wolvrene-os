'use client';

import { useStore } from '@/store/app-store';
import { Card } from '@/components/ui';

export function OrdersPanel() {
  const { orders, market } = useStore();

  return (
    <Card variant="default" padding="none" className="h-full overflow-auto">
      <div className="p-3 border-b border-[#27272a]"><h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">Positions / Orders</h3></div>
      {orders.length ? orders.map((order) => <div key={order.id} className="p-3 text-sm text-[#c8ced6]">{order.symbol}</div>) : <div className="p-4 text-[#8b949e] text-sm">No active orders. {market.symbolDisplay} is selected for execution planning.</div>}
    </Card>
  );
}
