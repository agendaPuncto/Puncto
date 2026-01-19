import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';

/**
 * Verify platform admin access
 */
async function verifyPlatformAdmin(request: NextRequest): Promise<{ uid: string } | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(token);
      if (decodedToken.platformAdmin === true) {
        return { uid: decodedToken.uid };
      }
    } else {
      const cookies = request.cookies.getAll();
      const sessionCookie = cookies.find(c => c.name === '__session' || c.name === 'firebase-auth-token');
      if (sessionCookie) {
        const decoded = await auth.verifySessionCookie(sessionCookie.value, true);
        if (decoded.platformAdmin === true) {
          return { uid: decoded.uid };
        }
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * GET /api/platform/stats
 * Get platform-wide statistics
 */
export async function GET(request: NextRequest) {
  const admin = await verifyPlatformAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get total businesses
    const businessesCount = await db.collection('businesses').where('deletedAt', '==', null).count().get();
    const totalBusinesses = businessesCount.data().count;

    // Get active businesses
    const activeBusinessesCount = await db.collection('businesses')
      .where('deletedAt', '==', null)
      .where('subscription.status', '==', 'active')
      .count()
      .get();
    const activeBusinesses = activeBusinessesCount.data().count;

    // Get total users
    const usersCount = await db.collection('users').count().get();
    const totalUsers = usersCount.data().count;

    // Get businesses by tier
    const tierCounts: Record<string, number> = {
      free: 0,
      basic: 0,
      pro: 0,
      enterprise: 0,
    };

    const businessesSnapshot = await db.collection('businesses')
      .where('deletedAt', '==', null)
      .get();

    businessesSnapshot.docs.forEach((doc) => {
      const tier = doc.data().subscription?.tier || 'free';
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });

    // Get businesses by industry
    const industryCounts: Record<string, number> = {};
    businessesSnapshot.docs.forEach((doc) => {
      const industry = doc.data().industry || 'general';
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    });

    // Get recent signups (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBusinessesSnapshot = await db.collection('businesses')
      .where('deletedAt', '==', null)
      .where('createdAt', '>=', thirtyDaysAgo)
      .get();
    const recentSignups = recentBusinessesSnapshot.size;

    return NextResponse.json({
      stats: {
        totalBusinesses,
        activeBusinesses,
        totalUsers,
        recentSignups,
        tierDistribution: tierCounts,
        industryDistribution: industryCounts,
      },
    });
  } catch (error: any) {
    console.error('[Platform API] Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', message: error.message },
      { status: 500 }
    );
  }
}
