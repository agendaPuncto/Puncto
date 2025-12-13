import { notFound } from 'next/navigation';
import { db } from '@/lib/firebaseAdmin';
import { Business } from '@/types/business';
import { BusinessProvider } from '@/lib/contexts/BusinessContext';
import BookingPage from './tenant/page';

async function getDemoBusiness(): Promise<Business | null> {
  try {
    const businessDoc = await db.collection('businesses').doc('demo').get();

    if (!businessDoc.exists) {
      return null;
    }

    const data = businessDoc.data();
    if (!data) return null;

    // Convert Firestore Timestamps to serializable dates
    return {
      id: businessDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      deletedAt: data.deletedAt?.toDate() || undefined,
      subscription: {
        ...data.subscription,
        currentPeriodStart: data.subscription?.currentPeriodStart?.toDate() || new Date(),
        currentPeriodEnd: data.subscription?.currentPeriodEnd?.toDate() || new Date(),
        trialEndsAt: data.subscription?.trialEndsAt?.toDate() || undefined,
      },
    } as Business;
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

export default async function Home() {
  const business = await getDemoBusiness();

  if (!business) {
    notFound();
  }

  return (
    <BusinessProvider business={business}>
      <BookingPage />
    </BusinessProvider>
  );
}
