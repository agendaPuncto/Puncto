'use client';

import { useState } from 'react';
import { Order } from '@/types/restaurant';
import { SplitPayment } from '@/types/restaurant';

interface SplitPaymentModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSplit: (splits: SplitPayment[]) => Promise<void>;
}

type SplitMethod = 'equal' | 'by_item' | 'custom';

export function SplitPaymentModal({
  order,
  isOpen,
  onClose,
  onSplit,
}: SplitPaymentModalProps) {
  const [method, setMethod] = useState<SplitMethod>('equal');
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [customSplits, setCustomSplits] = useState<Array<{ amount: number; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const calculateEqualSplit = () => {
    return Math.round(order.total / numberOfPeople);
  };

  const handleSplit = async () => {
    try {
      setIsSubmitting(true);

      let splits: SplitPayment[] = [];

      if (method === 'equal') {
        const amountPerPerson = calculateEqualSplit();
        const remainder = order.total - amountPerPerson * numberOfPeople;
        
        splits = Array.from({ length: numberOfPeople }, (_, i) => ({
          userId: `person-${i + 1}`,
          amount: i === 0 ? amountPerPerson + remainder : amountPerPerson,
          status: 'pending' as const,
        }));
      } else if (method === 'by_item') {
        // Each person pays for their items
        // This would require tracking which person ordered which items
        // For now, we'll use equal split as fallback
        const amountPerPerson = calculateEqualSplit();
        splits = Array.from({ length: numberOfPeople }, (_, i) => ({
          userId: `person-${i + 1}`,
          amount: amountPerPerson,
          status: 'pending' as const,
        }));
      } else if (method === 'custom') {
        splits = customSplits.map((split, i) => ({
          userId: split.name || `person-${i + 1}`,
          amount: Math.round(split.amount * 100), // Convert to cents
          status: 'pending' as const,
        }));
      }

      await onSplit(splits);
      onClose();
    } catch (error) {
      console.error('Failed to split payment:', error);
      alert('Erro ao dividir pagamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Dividir Pagamento</h2>

        <div className="mb-4">
          <p className="text-sm text-neutral-600 mb-2">Total: {formatPrice(order.total)}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Método de Divisão
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="equal"
                  checked={method === 'equal'}
                  onChange={(e) => setMethod(e.target.value as SplitMethod)}
                />
                <span className="flex-1">Igual (dividir por número de pessoas)</span>
              </label>
              <label className="flex items-center gap-2 p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="by_item"
                  checked={method === 'by_item'}
                  onChange={(e) => setMethod(e.target.value as SplitMethod)}
                />
                <span className="flex-1">Por item (cada um paga seus itens)</span>
              </label>
              <label className="flex items-center gap-2 p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="custom"
                  checked={method === 'custom'}
                  onChange={(e) => setMethod(e.target.value as SplitMethod)}
                />
                <span className="flex-1">Personalizado</span>
              </label>
            </div>
          </div>

          {method === 'equal' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Número de Pessoas
              </label>
              <input
                type="number"
                min="2"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 2)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2"
              />
              <p className="text-sm text-neutral-600 mt-2">
                Cada pessoa pagará: {formatPrice(calculateEqualSplit())}
              </p>
            </div>
          )}

          {method === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Valores Personalizados
              </label>
              <div className="space-y-2">
                {customSplits.map((split, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nome"
                      value={split.name}
                      onChange={(e) => {
                        const updated = [...customSplits];
                        updated[index].name = e.target.value;
                        setCustomSplits(updated);
                      }}
                      className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Valor"
                      value={split.amount}
                      onChange={(e) => {
                        const updated = [...customSplits];
                        updated[index].amount = parseFloat(e.target.value) || 0;
                        setCustomSplits(updated);
                      }}
                      className="w-32 rounded-lg border border-neutral-300 px-3 py-2"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setCustomSplits([...customSplits, { name: '', amount: 0 }])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Adicionar Pessoa
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSplit}
            disabled={isSubmitting}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Processando...' : 'Dividir'}
          </button>
        </div>
      </div>
    </div>
  );
}
