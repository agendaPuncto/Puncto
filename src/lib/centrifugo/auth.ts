import { auth } from '@/lib/firebase';
import { signInWithCustomToken, getIdToken } from 'firebase/auth';

/**
 * Generate Centrifugo JWT token via API
 * This should be called server-side or via API route
 */
export async function getCentrifugoToken(): Promise<string> {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User must be authenticated to get Centrifugo token');
  }

  // Get Firebase ID token
  const idToken = await getIdToken(user);

  // Call API route to generate Centrifugo token
  const response = await fetch('/api/centrifugo/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get Centrifugo token');
  }

  const data = await response.json();
  return data.token;
}

/**
 * Generate channel name for organization/bookings
 */
export function getBookingChannel(orgId: string): string {
  return `org:${orgId}:bookings`;
}

/**
 * Generate channel name for organization/orders (restaurant)
 */
export function getOrderChannel(orgId: string): string {
  return `org:${orgId}:orders`;
}

/**
 * Generate channel name for specific booking
 */
export function getBookingChannelForId(orgId: string, bookingId: string): string {
  return `org:${orgId}:booking:${bookingId}`;
}
