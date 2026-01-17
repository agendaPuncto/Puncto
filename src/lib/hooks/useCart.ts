import { useState, useCallback } from 'react';
import { Product, ProductVariation } from '@/types/restaurant';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  notes?: string;
  selectedVariations?: Record<string, string>; // variation name -> selected option
  unitPrice: number; // Price including variations
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, quantity: number = 1, notes?: string, variations?: Record<string, string>) => {
    setItems((prev) => {
      // Calculate unit price with variations
      let unitPrice = product.price;
      if (variations && product.variations) {
        product.variations.forEach((variation) => {
          const selectedOption = variation.options.find(
            (opt) => opt.name === variations[variation.name]
          );
          if (selectedOption) {
            unitPrice += selectedOption.price;
          }
        });
      }

      // Check if item already exists with same variations and notes
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          JSON.stringify(item.selectedVariations) === JSON.stringify(variations) &&
          item.notes === notes
      );

      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        // Add new item
        return [
          ...prev,
          {
            productId: product.id,
            product,
            quantity,
            notes,
            selectedVariations: variations,
            unitPrice,
          },
        ];
      }
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    setItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
  };
}
