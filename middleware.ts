import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Extract subdomain (handle localhost and production domains)
  let subdomain = '';

  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Local development: use query param or header for testing
    // e.g., http://localhost:3000?subdomain=demo
    subdomain = url.searchParams.get('subdomain') || '';
  } else {
    // Production: extract from hostname
    // e.g., demo.puncto.app -> demo
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      subdomain = parts[0];
    }
  }

  // Platform admin routes
  if (subdomain === 'admin') {
    // Rewrite to /platform/* routes
    return NextResponse.rewrite(new URL(`/platform${url.pathname}`, request.url));
  }

  // Main domain (marketing site)
  if (!subdomain || subdomain === 'www' || hostname === 'puncto.app') {
    // Allow marketing routes to pass through
    return NextResponse.next();
  }

  // Business subdomain
  // Store businessSlug in header for server components to access
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-business-slug', subdomain);

  // Rewrite to /tenant/* routes with slug in header
  return NextResponse.rewrite(
    new URL(`/tenant${url.pathname}${url.search}`, request.url),
    {
      request: {
        headers: requestHeaders,
      },
    }
  );
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
