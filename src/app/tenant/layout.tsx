import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getCurrentBusiness } from '@/lib/tenant';
import { BusinessProvider } from '@/lib/contexts/BusinessContext';

export default async function TenantLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Fetch business based on subdomain
  const business = await getCurrentBusiness();

  if (!business) {
    // Business not found - show 404
    notFound();
  }

  // Check if business is active
  if (business.subscription.status === 'suspended' || business.subscription.status === 'cancelled') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="rounded-2xl bg-white p-8 shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-semibold text-neutral-900">Conta Suspensa</h1>
          <p className="mt-4 text-neutral-600">
            Esta conta está atualmente suspensa. Entre em contato com o suporte para mais informações.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BusinessProvider business={business}>
      {children}
    </BusinessProvider>
  );
}
