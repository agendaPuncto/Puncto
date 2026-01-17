'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Table, Product, MenuCategory } from '@/types/restaurant';
import { useCart } from '@/lib/hooks/useCart';
import { ProductSelector } from '@/components/restaurant/ProductSelector';
import { CartDrawer } from '@/components/restaurant/CartDrawer';
import { MenuCategoryFilter } from '@/components/restaurant/MenuCategoryFilter';

export default function TableOrderingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableId = params.tableId as string;
  const subdomain = searchParams.get('subdomain');

  const [table, setTable] = useState<Table | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

  useEffect(() => {
    loadData();
  }, [tableId, subdomain]);

  const loadData = async () => {
    if (!subdomain) return;

    try {
      setIsLoading(true);

      // Get business by slug (simplified - in production, use proper API)
      // For now, we'll need to get businessId from the table document
      const tableRes = await fetch(`/api/tables/${tableId}?businessId=${subdomain}`);
      if (tableRes.ok) {
        const tableData = await tableRes.json();
        setTable(tableData);
        
        // Extract businessId from table data or use subdomain lookup
        // This is a simplified approach - in production, implement proper business lookup
        const tempBusinessId = tableData.businessId || subdomain;
        setBusinessId(tempBusinessId);

        // Load products
        const productsRes = await fetch(`/api/menu?businessId=${tempBusinessId}`);
        const productsData = await productsRes.json();
        setProducts((productsData.products || []).filter((p: Product) => p.available));

        // Load categories
        const categoriesRes = await fetch(`/api/menu/categories?businessId=${tempBusinessId}`);
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!businessId || !tableId || items.length === 0) return;

    try {
      setIsSubmitting(true);

      const orderItems = items.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
      }));

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          tableId,
          items: orderItems,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create order');
      }

      const order = await res.json();
      clearCart();
      setIsCartOpen(false);
      
      // Redirect to order view
      router.push(`/tenant/table/${tableId}/order/${order.id}?subdomain=${subdomain}`);
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Erro ao fazer pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">Mesa {table?.number}</h1>
          <p className="text-neutral-600 mt-2">Escolha seus itens</p>
        </div>

        {categories.length > 0 && (
          <MenuCategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductSelector
              key={product.id}
              product={product}
              onAddToCart={addItem}
            />
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full p-8 text-center text-neutral-500">
              Nenhum produto disponível.
            </div>
          )}
        </div>
      </div>

      {/* Floating cart button */}
      {itemCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-neutral-900 text-white rounded-full p-4 shadow-lg hover:bg-neutral-800 flex items-center gap-2"
        >
          <span className="text-xl">🛒</span>
          <span className="font-medium">{itemCount}</span>
        </button>
      )}

      <CartDrawer
        items={items}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        subtotal={subtotal}
      />
    </div>
  );
}
