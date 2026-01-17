'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useBusiness } from '@/lib/contexts/BusinessContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LocaleSwitcher } from '@/components/admin/LocaleSwitcher';
import { useTranslations } from 'next-intl';

interface AdminLayoutProps {
  children: ReactNode;
}

// Navigation items will be translated in component
const adminNavKeys = [
  { href: '/tenant/admin/dashboard', key: 'dashboard', icon: '📊' },
  { href: '/tenant/admin/bookings', key: 'bookings', icon: '📅' },
  { href: '/tenant/admin/services', key: 'services', icon: '🏥' },
  { href: '/tenant/admin/professionals', key: 'professionals', icon: '👥' },
  { href: '/tenant/admin/customers', key: 'customers', icon: '👤' },
  { href: '/tenant/admin/payments', key: 'payments', icon: '💳' },
  { href: '/tenant/admin/financial', key: 'financial', icon: '💰' },
  { href: '/tenant/admin/menu', key: 'menu', icon: '🍽️' },
  { href: '/tenant/admin/orders', key: 'orders', icon: '📋' },
  { href: '/tenant/admin/tables', key: 'tables', icon: '🪑' },
  { href: '/tenant/admin/inventory', key: 'inventory', icon: '📦' },
  { href: '/tenant/admin/purchases', key: 'purchases', icon: '🛒' },
  { href: '/tenant/admin/time-clock', key: 'timeClock', icon: '⏰' },
  { href: '/tenant/admin/loyalty', key: 'loyalty', icon: '🎁' },
  { href: '/tenant/admin/campaigns', key: 'campaigns', icon: '📢' },
  { href: '/tenant/admin/franchise', key: 'franchise', icon: '🏢' },
  { href: '/tenant/admin/settings', key: 'settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { business } = useBusiness();
  const { user } = useAuth();
  const t = useTranslations('nav');

  return (
    <ProtectedRoute allowedRoles={['owner', 'manager', 'professional']}>
      <div className="min-h-screen bg-neutral-50">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 border-r border-neutral-200 bg-white">
          <div className="p-4 border-b border-neutral-200">
            <h1 className="text-xl font-semibold">{business?.displayName || 'Admin'}</h1>
            <p className="text-sm text-neutral-600 mt-1">{t('adminPanel')}</p>
          </div>

          <nav className="p-4 space-y-1">
            {adminNavKeys.map((item) => {
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
                  <span>{t(item.key)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200">
            <div className="text-sm">
              <p className="font-medium">{user?.displayName || user?.email}</p>
              <div className="flex items-center justify-between mt-2">
                <Link href="/tenant" className="text-blue-600 hover:underline text-xs">
                  {t('backToPublic')}
                </Link>
                <LocaleSwitcher />
              </div>
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
