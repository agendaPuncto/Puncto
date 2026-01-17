'use client';

import { useState, useEffect } from 'react';
import { useBusiness } from '@/lib/contexts/BusinessContext';
import { useRouter, useParams } from 'next/navigation';
import { Product, MenuCategory } from '@/types/restaurant';
import { useForm } from 'react-hook-form';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  allergens: string[];
  available: boolean;
  preparationTime: number;
  displayOrder: number;
}

export default function ProductEditPage() {
  const { business } = useBusiness();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  const isNew = productId === 'new';

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: 0,
      imageUrl: '',
      allergens: [],
      available: true,
      preparationTime: 0,
      displayOrder: 0,
    },
  });

  useEffect(() => {
    loadData();
  }, [business?.id, productId]);

  const loadData = async () => {
    if (!business?.id) return;

    try {
      // Load categories
      const categoriesRes = await fetch(`/api/menu/categories?businessId=${business.id}`);
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.categories || []);

      if (!isNew) {
        // Load product
        const productRes = await fetch(
          `/api/menu/${productId}?businessId=${business.id}`
        );
        const productData = await productRes.json();
        setProduct(productData);

        // Set form values
        setValue('name', productData.name || '');
        setValue('description', productData.description || '');
        setValue('category', productData.category || '');
        setValue('price', productData.price || 0);
        setValue('imageUrl', productData.imageUrl || '');
        setValue('allergens', productData.allergens || []);
        setValue('available', productData.available !== undefined ? productData.available : true);
        setValue('preparationTime', productData.preparationTime || 0);
        setValue('displayOrder', productData.displayOrder || 0);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!business?.id) return;

    try {
      setIsSaving(true);

      const productData = {
        ...data,
        price: Math.round(data.price * 100), // Convert to cents
      };

      if (isNew) {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: business.id,
            product: productData,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to create product');
        }

        const newProduct = await res.json();
        router.push(`/tenant/admin/menu/${newProduct.id}`);
      } else {
        const res = await fetch(`/api/menu/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: business.id,
            updates: productData,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to update product');
        }

        router.push('/tenant/admin/menu');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-neutral-600 hover:text-neutral-900 mb-4"
        >
          ← Voltar
        </button>
        <h1 className="text-3xl font-bold text-neutral-900">
          {isNew ? 'Novo Produto' : 'Editar Produto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nome do Produto *
              </label>
              <input
                {...register('name', { required: 'Nome é obrigatório' })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                placeholder="Ex: Hambúrguer Artesanal"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Descrição
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                placeholder="Descrição do produto..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Categoria *
                </label>
                <select
                  {...register('category', { required: 'Categoria é obrigatória' })}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                >
                  <option value="">Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Preço (R$) *
                </label>
                <input
                  {...register('price', {
                    required: 'Preço é obrigatório',
                    min: { value: 0, message: 'Preço deve ser positivo' },
                  })}
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                URL da Imagem
              </label>
              <input
                {...register('imageUrl')}
                type="url"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Tempo de Preparo (min)
                </label>
                <input
                  {...register('preparationTime', { min: 0 })}
                  type="number"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Ordem de Exibição
                </label>
                <input
                  {...register('displayOrder', { min: 0 })}
                  type="number"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  {...register('available')}
                  type="checkbox"
                  className="rounded border-neutral-300"
                />
                <span className="text-sm font-medium text-neutral-700">
                  Produto disponível
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
