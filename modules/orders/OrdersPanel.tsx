// filepath: modules/orders/OrdersPanel.tsx
'use client';

import { useStore } from '@/store/app-store';
import { Card, Badge, Button } from '@/components/ui';

export function OrdersPanel() {
  const { orders } = useStore();

  return (
    <Card variant="default" padding="none" className="h-full">
      <div className="p-3 border-b border-[#27272a] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#fafafa] uppercase tracking-wider">Orders</h3>
        <Button variant="primary" size="sm">+ New Order</Button>
      </div>
      <div className="divide-y divide-[#27272a]">
        {orders.map((order) => (
          <div key={order.id} className="p-4 hover:bg-[#18181b] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#fafafa] font-semibold">{order.symbol}</span>
                <Badge variant={order.side === 'buy' ? 'success' : 'error'}>
                  {order.side.toUpperCase()}
                </Badge>
                <Badge variant="default">{order.type.toUpperCase()}</Badge>
              </div>
              <Badge 
                variant={order.status === 'filled' ? 'success' : order.status === 'pending' ? 'warning' : 'error'}
              >
                {order.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-[#71717a]">Qty: </span>
                <span className="text-[#fafafa]">{order.quantity}</span>
                {order.price && (
                  <>
                    <span className="text-[#71717a] ml-2">@ </span>
                    <span className="text-[#fafafa]">${order.price.toLocaleString()}</span>
                  </>
                )}
              </div>
              <span className="text-[#71717a]">
                {order.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}