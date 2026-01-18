import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Extract subdomain (handle localhost and production domains)
  let subdomain = '';

  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Local development: use query param or header for testing
    // e.g., http://localhost:3000?subdomain=demo
    subdomain = url.searchParams.get('subdomain') || '';
    console.log('[Middleware] Detected localhost, subdomain from query:', subdomain);
  } else {
    // Production: extract from hostname
    // e.g., demo.puncto.com.br -> demo
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      subdomain = parts[0];
    }
  }

  // Check if user is authenticated (has Firebase auth cookie)
  // Firebase sets __session cookie for authenticated users
  const hasAuthCookie = request.cookies.has('__session') ||
                        request.cookies.has('firebase-auth-token');

  // Auth routes - redirect if already logged in
  if (url.pathname.startsWith('/auth/')) {
    if (hasAuthCookie && (url.pathname === '/auth/login' || url.pathname === '/auth/signup')) {
      const returnUrl = url.searchParams.get('returnUrl') || '/';
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }
    return NextResponse.next();
  }

  // Platform admin routes
  if (subdomain === 'admin') {
    // Require authentication for platform routes
    if (!hasAuthCookie && !url.pathname.startsWith('/auth/')) {
      return NextResponse.redirect(
        new URL(`/auth/login?returnUrl=${encodeURIComponent(url.pathname)}`, request.url)
      );
    }
    // Rewrite to /platform/* routes
    return NextResponse.rewrite(new URL(`/platform${url.pathname}`, request.url));
  }

  // Main domain (marketing site)
  if (!subdomain || subdomain === 'www' || hostname === 'puncto.com.br') {
    // Allow marketing routes to pass through
    // Marketing pages are in (marketing) route group
    console.log('[Middleware] No subdomain or www/main domain, passing through to marketing site');
    return NextResponse.next();
  }

  // Handle demo subdomain for testing the booking page
  if (subdomain === 'demo') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-business-slug', 'demo');
    
    return NextResponse.rewrite(
      new URL(`/tenant${url.pathname}${url.search}`, request.url),
      {
        request: {
          headers: requestHeaders,
        },
      }
    );
  }

  console.log('[Middleware] Business subdomain detected:', subdomain, '- rewriting to /tenant');

  // Business subdomain
  // Store businessSlug in header for server components to access
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-business-slug', subdomain);

  // Protected admin routes within tenant subdomain
  if (url.pathname.startsWith('/tenant/admin') || url.pathname.startsWith('/admin')) {
    if (!hasAuthCookie) {
      return NextResponse.redirect(
        new URL(`/auth/login?returnUrl=${encodeURIComponent(url.pathname + url.search)}`, request.url)
      );
    }
  }

  // Protected customer account routes
  if (url.pathname.startsWith('/tenant/my-bookings') ||
      url.pathname.startsWith('/tenant/profile') ||
      url.pathname.startsWith('/my-bookings') ||
      url.pathname.startsWith('/profile')) {
    if (!hasAuthCookie) {
      return NextResponse.redirect(
        new URL(`/auth/login?returnUrl=${encodeURIComponent(url.pathname + url.search)}`, request.url)
      );
    }
  }

  // Rewrite to /tenant/* routes with slug in header
  const response = NextResponse.rewrite(
    new URL(`/tenant${url.pathname}${url.search}`, request.url),
    {
      request: {
        headers: requestHeaders,
      },
    }
  );

  // Set locale header for i18n (will be read by next-intl in server components)
  // Locale will be determined from business settings in tenant layout
  response.headers.set('x-locale', 'pt-BR'); // Default, will be overridden by business settings

  return response;
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
