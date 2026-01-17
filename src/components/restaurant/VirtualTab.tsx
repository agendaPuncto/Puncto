'use client';

import { Order } from '@/types/restaurant';

interface VirtualTabProps {
  order: Order;
  view: 'customer' | 'waiter' | 'kitchen';
  onUpdateItemStatus?: (itemIndex: number, status: Order['items'][0]['status']) => void;
  onUpdateOrderStatus?: (status: Order['status']) => void;
}

export function VirtualTab({
  order,
  view,
  onUpdateItemStatus,
  onUpdateOrderStatus,
}: VirtualTabProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Mesa {order.tableNumber}</h2>
          <p className="text-sm text-neutral-600">
            Pedido #{order.id.slice(0, 8)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-600">Status</p>
          <p className={`text-sm font-medium ${
            order.status === 'open' ? 'text-yellow-600' :
            order.status === 'paid' ? 'text-green-600' :
            'text-red-600'
          }`}>
            {order.status === 'open' && 'Aberto'}
            {order.status === 'paid' && 'Pago'}
            {order.status === 'canceled' && 'Cancelado'}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-3 border border-neutral-200 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{item.quantity}x</span>
                <span className="font-medium">{item.name}</span>
              </div>
              {item.notes && (
                <p className="text-sm text-neutral-500 mt-1">Nota: {item.notes}</p>
              )}
              <p className="text-sm text-neutral-600 mt-1">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </div>

            {view !== 'customer' && (
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status === 'pending' && 'Pendente'}
                  {item.status === 'preparing' && 'Preparando'}
                  {item.status === 'ready' && 'Pronto'}
                  {item.status === 'delivered' && 'Entregue'}
                </span>
                {view === 'kitchen' && item.status === 'pending' && (
                  <button
                    onClick={() => onUpdateItemStatus?.(index, 'preparing')}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Iniciar
                  </button>
                )}
                {view === 'kitchen' && item.status === 'preparing' && (
                  <button
                    onClick={() => onUpdateItemStatus?.(index, 'ready')}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Marcar Pronto
                  </button>
                )}
                {view === 'waiter' && item.status === 'ready' && (
                  <button
                    onClick={() => onUpdateItemStatus?.(index, 'delivered')}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Entregar
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Subtotal</span>
          <span className="font-medium">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Taxa</span>
          <span className="font-medium">{formatPrice(order.tax)}</span>
        </div>
        {order.tip > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Gorjeta</span>
            <span className="font-medium">{formatPrice(order.tip)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-200">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {view === 'waiter' && order.status === 'open' && (
        <div className="mt-4 space-y-2">
          <div className="flex gap-3">
            <button
              onClick={() => onUpdateOrderStatus?.('paid')}
              className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Fechar Conta
            </button>
            <button
              onClick={() => onUpdateOrderStatus?.('canceled')}
              className="flex-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Cancelar
            </button>
          </div>
          {order.splitPayments && order.splitPayments.length > 0 && (
            <div className="pt-2 border-t border-neutral-200">
              <p className="text-sm font-medium text-neutral-700 mb-2">Pagamentos Divididos:</p>
              <div className="space-y-2">
                {order.splitPayments.map((split, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">{split.userId}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatPrice(split.amount)}</span>
                      {split.paymentUrl && (
                        <a
                          href={split.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Pagar
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
