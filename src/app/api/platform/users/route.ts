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
 * GET /api/platform/users
 * List all users across all businesses
 */
export async function GET(request: NextRequest) {
  const admin = await verifyPlatformAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const role = searchParams.get('role'); // owner, manager, professional
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    let query = db.collection('users').limit(limit).offset(skip);

    // Note: Firestore doesn't support complex queries across collections
    // This is a simplified implementation
    // In production, you might want to denormalize data or use a different approach

    const snapshot = await query.get();

    let users = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const userData: any = {
          id: doc.id,
          email: data.email,
          name: data.name,
          displayName: data.displayName,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        };

        // Get user's token to check claims
        try {
          const userRecord = await auth.getUser(doc.id);
          const customClaims = userRecord.customClaims || {};
          
          userData.platformAdmin = customClaims.platformAdmin === true;
          userData.businessRoles = customClaims.businessRoles || {};

          // Get businesses user belongs to
          const businessRoles = customClaims.businessRoles || {};
          userData.businesses = Object.keys(businessRoles).map((bid) => ({
            id: bid,
            role: businessRoles[bid],
          }));
        } catch (error) {
          console.error('Error getting user claims:', error);
        }

        return userData;
      })
    );

    // Apply filters (client-side)
    if (businessId) {
      users = users.filter((u) => 
        u.businessRoles?.[businessId] || u.businesses?.some((b: any) => b.id === businessId)
      );
    }

    if (role) {
      users = users.filter((u) =>
        Object.values(u.businessRoles || {}).includes(role)
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter((u) =>
        u.email?.toLowerCase().includes(searchLower) ||
        u.name?.toLowerCase().includes(searchLower) ||
        u.displayName?.toLowerCase().includes(searchLower)
      );
    }

    // Get total count
    const totalSnapshot = await db.collection('users').count().get();
    const total = totalSnapshot.data().count;

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('[Platform API] Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error.message },
      { status: 500 }
    );
  }
}
