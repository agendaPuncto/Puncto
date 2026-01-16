'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useBusiness } from '@/lib/contexts/BusinessContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavItems = [
  { href: '/tenant/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/tenant/admin/bookings', label: 'Agendamentos', icon: '📅' },
  { href: '/tenant/admin/services', label: 'Serviços', icon: '🏥' },
  { href: '/tenant/admin/professionals', label: 'Profissionais', icon: '👥' },
  { href: '/tenant/admin/customers', label: 'Clientes', icon: '👤' },
  { href: '/tenant/admin/settings', label: 'Configurações', icon: '⚙️' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { business } = useBusiness();
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['owner', 'manager', 'professional']}>
      <div className="min-h-screen bg-neutral-50">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 border-r border-neutral-200 bg-white">
          <div className="p-4 border-b border-neutral-200">
            <h1 className="text-xl font-semibold">{business?.displayName || 'Admin'}</h1>
            <p className="text-sm text-neutral-600 mt-1">Painel Administrativo</p>
          </div>

          <nav className="p-4 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200">
            <div className="text-sm">
              <p className="font-medium">{user?.displayName || user?.email}</p>
              <Link href="/tenant" className="text-blue-600 hover:underline text-xs">
                Voltar ao site público
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 min-h-screen">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
