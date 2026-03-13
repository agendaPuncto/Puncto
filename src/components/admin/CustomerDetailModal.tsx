'use client';

import { useState, useMemo, useEffect } from 'react';
import { Customer } from '@/types/booking';
import { useBookings } from '@/lib/queries/bookings';
import { useUpdateCustomer } from '@/lib/queries/customers';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function normalizePhone(phone: string | undefined): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

interface CustomerDetailModalProps {
  customer: Customer;
  businessId: string;
  onClose: () => void;
}

export function CustomerDetailModal({ customer, businessId, onClose }: CustomerDetailModalProps) {
  const { data: allBookings = [] } = useBookings(businessId);
  const updateCustomer = useUpdateCustomer(businessId);
  const [activeTab, setActiveTab] = useState<'info' | 'records'>('info');
  const [formData, setFormData] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    email: customer.email || '',
    notes: customer.notes || '',
  });

  useEffect(() => {
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      email: customer.email || '',
      notes: customer.notes || '',
    });
  }, [customer.id, customer.firstName, customer.lastName, customer.phone, customer.email, customer.notes]);
  const [error, setError] = useState<string | null>(null);

  const customerPhoneNorm = normalizePhone(customer.phone);
  const customerBookings = useMemo(() => {
    return allBookings
      .filter((b) => {
        const bookingPhone = normalizePhone(b.customerData?.phone);
        const bookingEmail = (b.customerData?.email || '').toLowerCase().trim();
        const custEmail = (customer.email || '').toLowerCase().trim();
        return (
          (bookingPhone && bookingPhone === customerPhoneNorm) ||
          (custEmail && bookingEmail === custEmail)
        );
      })
      .sort((a, b) => {
        const aDate = a.scheduledDateTime instanceof Date ? a.scheduledDateTime : new Date(a.scheduledDateTime as any);
        const bDate = b.scheduledDateTime instanceof Date ? b.scheduledDateTime : new Date(b.scheduledDateTime as any);
        return bDate.getTime() - aDate.getTime();
      });
  }, [allBookings, customerPhoneNorm, customer.email]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
      setError('Nome e telefone são obrigatórios');
      return;
    }
    try {
      await updateCustomer.mutateAsync({
        customerId: customer.id,
        updates: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          notes: formData.notes.trim() || undefined,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar');
    }
  };

  const money = (cents: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-neutral-900">
            {customer.firstName} {customer.lastName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-neutral-200">
          <div className="flex gap-1 px-6">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
                activeTab === 'info'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Dados
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('records')}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
                activeTab === 'records'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Histórico ({customerBookings.length})
            </button>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-6">
          {activeTab === 'info' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Sobrenome *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Telefone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span>Agendamentos: {customer.totalBookings}</span>
                <span>Total gasto: {money(customer.totalSpent || 0)}</span>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={updateCustomer.isPending}
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {updateCustomer.isPending ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={onClose} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                  Fechar
                </button>
              </div>
            </form>
          )}

          {activeTab === 'records' && (
            <div className="space-y-3">
              {customerBookings.length === 0 ? (
                <p className="text-neutral-500 text-sm">Nenhum agendamento encontrado para este cliente.</p>
              ) : (
                <div className="space-y-2">
                  {customerBookings.map((booking) => {
                    const dt = booking.scheduledDateTime instanceof Date ? booking.scheduledDateTime : new Date(booking.scheduledDateTime as any);
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-neutral-900">{booking.serviceName}</p>
                          <p className="text-sm text-neutral-500">
                            {format(dt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            {booking.professionalName && ` · ${booking.professionalName}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status === 'completed' && 'Concluído'}
                            {booking.status === 'confirmed' && 'Confirmado'}
                            {booking.status === 'pending' && 'Pendente'}
                            {booking.status === 'cancelled' && 'Cancelado'}
                            {booking.status === 'no_show' && 'Não compareceu'}
                          </span>
                          <p className="mt-1 text-sm font-medium">{money(booking.price || 0)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
