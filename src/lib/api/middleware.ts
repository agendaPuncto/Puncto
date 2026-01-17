import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest } from './authentication';
import { withRateLimit } from './rateLimiting';
import { ApiKey } from '@/types/api';

/**
 * API middleware that authenticates and applies rate limiting
 */
export function withApiAuth(
  handler: (request: NextRequest, context: { apiKey: ApiKey; businessId: string }) => Promise<Response>
) {
  return async (request: NextRequest) => {
    // Authenticate
    const authResult = await authenticateApiRequest(request);

    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      );
    }

    const { apiKey, businessId } = authResult;

    // Apply rate limiting
    return withRateLimit(handler)(request, { apiKey, businessId });
  };
}
