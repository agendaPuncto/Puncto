'use client';

import { useState } from 'react';
import { Product } from '@/types/restaurant';
import Image from 'next/image';

interface ProductSelectorProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, notes?: string, variations?: Record<string, string>) => void;
}

export function ProductSelector({ product, onAddToCart }: ProductSelectorProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const calculatePrice = () => {
    let total = product.price;
    if (product.variations) {
      product.variations.forEach((variation) => {
        const selected = selectedVariations[variation.name];
        if (selected) {
          const option = variation.options.find((opt) => opt.name === selected);
          if (option) {
            total += option.price;
          }
        }
      });
    }
    return total * quantity;
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, notes || undefined, Object.keys(selectedVariations).length > 0 ? selectedVariations : undefined);
    setIsModalOpen(false);
    setQuantity(1);
    setNotes('');
    setSelectedVariations({});
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg border border-neutral-200 bg-white overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      >
        {product.imageUrl && (
          <div className="relative h-48 w-full bg-neutral-100">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-neutral-900">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
          <p className="text-lg font-bold text-neutral-900 mt-2">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
              {product.description && (
                <p className="text-neutral-600 mb-4">{product.description}</p>
              )}

              {product.variations && product.variations.length > 0 && (
                <div className="space-y-4 mb-4">
                  {product.variations.map((variation) => (
                    <div key={variation.name}>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {variation.name}
                      </label>
                      <div className="space-y-2">
                        {variation.options.map((option) => (
                          <label
                            key={option.name}
                            className="flex items-center gap-2 p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={variation.name}
                              value={option.name}
                              checked={selectedVariations[variation.name] === option.name}
                              onChange={(e) =>
                                setSelectedVariations({
                                  ...selectedVariations,
                                  [variation.name]: e.target.value,
                                })
                              }
                              className="text-neutral-900"
                            />
                            <span className="flex-1">{option.name}</span>
                            {option.price > 0 && (
                              <span className="text-sm font-medium">
                                +{formatPrice(option.price)}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  placeholder="Ex: sem cebola, bem passado..."
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-neutral-700">Quantidade</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 pt-4 border-t border-neutral-200">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">{formatPrice(calculatePrice())}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
