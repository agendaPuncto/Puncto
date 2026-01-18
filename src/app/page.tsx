// This file exists as a fallback for the root route when using the marketing route group.
// The (marketing) route group's page.tsx handles the actual landing page content.
// This redirect ensures proper routing in edge cases.

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RootPage() {
  // Check if this is a subdomain request
  const headersList = headers();
  const subdomain = headersList.get('x-business-slug');
  
  // If there's a subdomain header, this request should go to tenant
  // The middleware should handle this, but as a fallback:
  if (subdomain) {
    redirect('/tenant');
  }
  
  // For the main domain, the (marketing)/page.tsx will be served
  // This file acts as a fallback - Next.js route groups handle this automatically
  // If we reach here, redirect to ensure we don't show a blank page
  return null;
}
