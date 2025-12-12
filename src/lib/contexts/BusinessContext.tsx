'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Business } from '@/types/business';

interface BusinessContextType {
  business: Business;
  isLoading: boolean;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

export function BusinessProvider({
  children,
  business,
}: {
  children: ReactNode;
  business: Business;
}) {
  return (
    <BusinessContext.Provider value={{ business, isLoading: false }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within BusinessProvider');
  }
  return context;
}
