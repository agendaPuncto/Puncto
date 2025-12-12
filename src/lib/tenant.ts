import { headers } from 'next/headers';
import { db } from './firebaseAdmin';
import { Business } from '@/types/business';

/**
 * Get the current business based on subdomain
 * Server-side only - uses headers set by middleware
 */
export async function getCurrentBusiness(): Promise<Business | null> {
  const businessSlug = getBusinessSlug();

  if (!businessSlug) {
    return null;
  }

  try {
    // Query business by slug
    const businessSnapshot = await db
      .collection('businesses')
      .where('slug', '==', businessSlug)
      .limit(1)
      .get();

    if (businessSnapshot.empty) {
      return null;
    }

    const doc = businessSnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Business;
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

/**
 * Get the business slug from middleware header
 * Server-side only
 */
export function getBusinessSlug(): string | null {
  try {
    const headersList = headers();
    return headersList.get('x-business-slug') || null;
  } catch (error) {
    // Headers not available (probably client-side or not in request context)
    return null;
  }
}

/**
 * Check if current context is a tenant subdomain
 */
export function isTenantContext(): boolean {
  return getBusinessSlug() !== null;
}

/**
 * Check if current context is platform admin
 */
export function isPlatformAdmin(): boolean {
  const slug = getBusinessSlug();
  return slug === 'admin';
}
