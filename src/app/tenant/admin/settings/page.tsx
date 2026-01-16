'use client';

import { useBusiness } from '@/lib/contexts/BusinessContext';

export default function AdminSettingsPage() {
  const { business } = useBusiness();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Configurações</h1>
        <p className="text-neutral-600 mt-2">Gerencie as configurações do seu negócio</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Informações da Empresa</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Nome</label>
              <input
                type="text"
                value={business.displayName}
                readOnly
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-neutral-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                value={business.email}
                readOnly
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-neutral-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Telefone</label>
              <input
                type="tel"
                value={business.phone}
                readOnly
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-neutral-50"
              />
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-4">
            Para alterar informações, entre em contato com o suporte.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Assinatura</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Plano</span>
              <span className="text-sm font-medium capitalize">{business.subscription.tier}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Status</span>
              <span className="text-sm font-medium capitalize">{business.subscription.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
