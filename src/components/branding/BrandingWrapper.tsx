'use client';

import { BrandingProvider, PunctoBranding } from './BrandingProvider';
import { Branding } from '@/types/business';

export function BrandingWrapper({ children, branding }: { children: React.ReactNode; branding?: Branding }) {
  return (
    <BrandingProvider>
      {children}
      <PunctoBranding branding={branding} />
    </BrandingProvider>
  );
}
