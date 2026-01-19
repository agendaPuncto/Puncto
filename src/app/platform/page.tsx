import { redirect } from 'next/navigation';

/**
 * Platform Admin Root
 * Redirects to dashboard
 */
export default function PlatformPage() {
  redirect('/platform/dashboard');
}
