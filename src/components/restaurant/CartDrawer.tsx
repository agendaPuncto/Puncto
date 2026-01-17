'use client';

import { CartItem } from '@/lib/hooks/useCart';

interface CartDrawerProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  subtotal: number;
}

export function CartDrawer({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  subtotal,
}: CartDrawerProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const tax = Math.round(subtotal * 0.1); // 10% tax (example)
  const total = subtotal + tax;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-xl font-semibold">Carrinho</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center text-neutral-500 py-12">
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 border border-neutral-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                      <p className="text-sm text-neutral-600 mt-1">
                        {Object.entries(item.selectedVariations).map(
                          ([name, value]) => `${name}: ${value}`
                        ).join(', ')}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-neutral-500 mt-1">Nota: {item.notes}</p>
                    )}
                    <p className="text-sm font-medium text-neutral-900 mt-2">
                      {formatPrice(item.unitPrice)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-8 h-8 hover:bg-neutral-100 rounded flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 hover:bg-neutral-100 rounded flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Taxa</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-200">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-white font-medium hover:bg-neutral-800 mt-4"
            >
              Fazer Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
}
