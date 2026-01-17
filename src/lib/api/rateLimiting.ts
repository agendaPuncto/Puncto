import { NextRequest, NextResponse } from 'next/server';
import { RateLimit, ApiKey } from '@/types/api';

// In-memory rate limit store (in production, use Redis)
const rateLimitStore = new Map<string, RateLimit>();

// Rate limits per tier
const RATE_LIMITS = {
  basic: { requests: 1000, windowMs: 60 * 60 * 1000 }, // 1000/hour
  pro: { requests: 10000, windowMs: 60 * 60 * 1000 }, // 10000/hour
  enterprise: { requests: 100000, windowMs: 60 * 60 * 1000 }, // 100000/hour
};

/**
 * Get rate limit config for API key tier
 */
function getRateLimitConfig(tier: string) {
  return RATE_LIMITS[tier as keyof typeof RATE_LIMITS] || RATE_LIMITS.basic;
}

/**
 * Check rate limit for API key
 */
export function checkRateLimit(apiKeyId: string, tier: string): {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
} {
  const config = getRateLimitConfig(tier);
  const now = new Date();
  const key = `ratelimit:${apiKeyId}`;

  let rateLimit = rateLimitStore.get(key);

  // Check if window expired or doesn't exist
  if (!rateLimit || now >= new Date(rateLimit.windowStart.getTime() + config.windowMs)) {
    // Start new window
    rateLimit = {
      apiKeyId,
      requests: 0,
      windowStart: now,
    };
    rateLimitStore.set(key, rateLimit);
  }

  // Check if limit exceeded
  if (rateLimit.requests >= config.requests) {
    const resetAt = new Date(rateLimit.windowStart.getTime() + config.windowMs);
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  // Increment request count
  rateLimit.requests++;
  rateLimitStore.set(key, rateLimit);

  const resetAt = new Date(rateLimit.windowStart.getTime() + config.windowMs);

  return {
    allowed: true,
    remaining: config.requests - rateLimit.requests,
    resetAt,
  };
}

/**
 * Rate limiting middleware for API routes
 */
export function withRateLimit(
  handler: (request: NextRequest, context: { apiKey: ApiKey; businessId: string }) => Promise<Response>
) {
  return async (request: NextRequest, context: { apiKey: ApiKey; businessId: string }) => {
    // Get tier from business subscription (you'd fetch this from database)
    // For now, default to basic
    const tier = 'basic';

    const rateLimit = checkRateLimit(context.apiKey.id, tier);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          resetAt: rateLimit.resetAt.toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS[tier as keyof typeof RATE_LIMITS].requests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toISOString(),
          },
        }
      );
    }

    // Call handler
    const response = await handler(request, context);

    // Add rate limit headers to response
    const headers = new Headers(response.headers);
    headers.set('X-RateLimit-Limit', RATE_LIMITS[tier as keyof typeof RATE_LIMITS].requests.toString());
    headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    headers.set('X-RateLimit-Reset', rateLimit.resetAt.toISOString());

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
