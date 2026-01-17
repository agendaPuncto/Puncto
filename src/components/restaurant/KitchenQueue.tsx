'use client';

import { Order } from '@/types/restaurant';
import { VirtualTab } from './VirtualTab';

interface KitchenQueueProps {
  orders: Order[];
  onUpdateItemStatus: (orderId: string, itemIndex: number, status: Order['items'][0]['status']) => void;
}

export function KitchenQueue({ orders, onUpdateItemStatus }: KitchenQueueProps) {
  // Filter orders with pending/preparing items
  const activeOrders = orders.filter((order) =>
    order.items.some(
      (item) => item.status === 'pending' || item.status === 'preparing'
    )
  );

  // Sort by creation time (oldest first)
  const sortedOrders = [...activeOrders].sort(
    (a, b) =>
      new Date(a.createdAt as Date).getTime() -
      new Date(b.createdAt as Date).getTime()
  );

  if (sortedOrders.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p className="text-lg">Nenhum pedido na fila</p>
        <p className="text-sm mt-2">Aguardando novos pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedOrders.map((order) => (
        <VirtualTab
          key={order.id}
          order={order}
          view="kitchen"
          onUpdateItemStatus={(itemIndex, status) =>
            onUpdateItemStatus(order.id, itemIndex, status)
          }
        />
      ))}
    </div>
  );
}
