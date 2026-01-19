import { NextRequest, NextResponse } from 'next/server';
import { createPlatformAdmin } from '@/lib/auth/create-user';

/**
 * API Route: Create Platform Admin
 * POST /api/auth/create-platform-admin
 *
 * SECURITY: This endpoint should be protected or disabled in production!
 * Only use during initial setup or with proper authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName, role, secretKey } = body;

    // CRITICAL: Validate secret key for platform admin creation
    // In production, use a strong secret key from environment variables
    const PLATFORM_ADMIN_SECRET = process.env.PLATFORM_ADMIN_CREATE_SECRET;

    if (!PLATFORM_ADMIN_SECRET) {
      return NextResponse.json(
        {
          error: 'Platform admin creation is disabled. Set PLATFORM_ADMIN_CREATE_SECRET in environment variables.',
        },
        { status: 503 }
      );
    }

    if (secretKey !== PLATFORM_ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret key' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, displayName' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: Array<'super_admin' | 'support' | 'analyst'> = ['super_admin', 'support', 'analyst'];
    const adminRole = role && validRoles.includes(role) ? role : 'analyst';

    // Create platform admin user
    const result = await createPlatformAdmin({
      email,
      password,
      displayName,
      role: adminRole,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Platform admin created successfully',
        userId: result.userId,
        user: {
          email: result.user.email,
          displayName: result.user.displayName,
          type: result.user.type,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API] Error creating platform admin:', error);

    // Check for duplicate email
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create platform admin' },
      { status: 500 }
    );
  }
}
