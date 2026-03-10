import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {
  getCustomClaimsFromRequest,
  isPlatformAdmin,
  hasBusinessAccess,
} from '@/lib/auth/middleware-utils';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Early redirect for admin subdomain on localhost (fixes query param detection issues)
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const rawUrl = request.url;
  const hasAdminSubdomain = rawUrl.includes('subdomain=admin') || rawUrl.includes('subdomain%3Dadmin');
  if (isLocalhost && hasAdminSubdomain && url.pathname === '/' && !request.cookies.has('__session') && !request.cookies.has('firebase-auth-token') && !request.cookies.has('firebaseIdToken')) {
    return NextResponse.redirect(new URL('/auth/platform/login?subdomain=admin&returnUrl=/platform/dashboard', request.url));
  }

  // Extract subdomain (handle localhost and production domains)
  let subdomain = '';

  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Local development: use query param for testing, then cookie fallback
    // e.g., http://localhost:3000?subdomain=admin or http://localhost:3000/tenant?subdomain=x-ratao
    subdomain = url.searchParams.get('subdomain') ?? '';
    if (!subdomain && request.url.includes('subdomain=admin')) subdomain = 'admin';
    if (!subdomain && request.url.includes('subdomain%3Dadmin')) subdomain = 'admin';
    if (!subdomain) subdomain = request.cookies.get('x-business-slug')?.value ?? '';
    console.log('[Middleware] localhost subdomain:', subdomain || '(empty)', 'pathname:', url.pathname);
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
                        request.cookies.has('firebase-auth-token') ||
                        request.cookies.has('firebaseIdToken');

  // Get custom claims from JWT token (if authenticated)
  const customClaims = hasAuthCookie ? await getCustomClaimsFromRequest(request) : null;

  // Auth routes - redirect if already logged in
  if (url.pathname.startsWith('/auth/')) {
    // Allow auth routes to proceed (they handle their own redirects)
    return NextResponse.next();
  }

  // Platform admin routes - STRICT USER TYPE ENFORCEMENT
  if (subdomain === 'admin') {
    // Require authentication for platform routes
    if (!hasAuthCookie && !url.pathname.startsWith('/auth/')) {
      const loginUrl = new URL('/auth/platform/login', request.url);
      loginUrl.searchParams.set('returnUrl', url.pathname || '/platform/dashboard');
      loginUrl.searchParams.set('subdomain', 'admin');
      return NextResponse.redirect(loginUrl);
    }

    // CRITICAL: Verify user is platform admin
    if (hasAuthCookie && !url.pathname.startsWith('/auth/')) {
      if (!customClaims || !isPlatformAdmin(customClaims)) {
        // User is authenticated but NOT a platform admin
        console.warn('[Middleware] Unauthorized platform admin access attempt:', {
          userType: customClaims?.userType,
          platformAdmin: customClaims?.platformAdmin,
        });

        // Redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized?reason=platform_admin_required', request.url));
      }
    }

    // Rewrite to /platform/* routes
    return NextResponse.rewrite(new URL(`/platform${url.pathname}`, request.url));
  }

  // Main domain (marketing site) - no business subdomain
  if (!subdomain || subdomain === 'www' || hostname === 'puncto.com.br') {
    if (url.pathname.startsWith('/tenant')) {
      console.log('[Middleware] tenant path but no subdomain - main domain block, subdomain:', subdomain || '(empty)');
    }
    // Redirect blog routes - commented out until we have blog content
    if (url.pathname === '/blog' || url.pathname.startsWith('/blog/')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow marketing routes to pass through
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

  // Business subdomain
  // On localhost: custom headers from middleware often don't reach Server Components.
  // Redirect to set cookie so getBusinessSlug() can read it on the next request.
  if (isLocalhost && url.searchParams.has('subdomain') && (url.pathname === '/' || url.pathname.startsWith('/tenant'))) {
    const target = url.pathname === '/' ? '/tenant' : url.pathname;
    const res = NextResponse.redirect(new URL(target, request.url));
    res.cookies.set('x-business-slug', subdomain, { path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 });
    return res;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-business-slug', subdomain);
  // Pass original URL so tenant can parse subdomain if custom header isn't forwarded (Next.js rewrite quirk)
  requestHeaders.set('x-middleware-request-url', request.url);
  console.log('[Middleware] business subdomain:', subdomain, 'pathname:', url.pathname);

  // Protected admin routes within tenant subdomain - STRICT USER TYPE ENFORCEMENT
  if (url.pathname.startsWith('/tenant/admin') || url.pathname.startsWith('/admin')) {
    if (!hasAuthCookie) {
      return NextResponse.redirect(
        new URL(`/auth/business/login?subdomain=${subdomain}&returnUrl=${encodeURIComponent(url.pathname + url.search)}`, request.url)
      );
    }

    // CRITICAL: Verify user is business_user with access to this business
    if (hasAuthCookie && customClaims) {
      const hasAccess = hasBusinessAccess(customClaims, subdomain);

      if (!hasAccess) {
        console.warn('[Middleware] Unauthorized business admin access attempt:', {
          userType: customClaims.userType,
          businessId: subdomain,
          businessRoles: customClaims.businessRoles,
        });

        // Customer users trying to access business admin -> redirect to unauthorized
        if (customClaims.userType === 'customer') {
          return NextResponse.redirect(new URL('/unauthorized?reason=business_admin_required', request.url));
        }

        // Platform admin has access (already checked in hasBusinessAccess)
        // Business user without role in this business -> redirect to their own business
        if (customClaims.userType === 'business_user' && customClaims.primaryBusinessId) {
          return NextResponse.redirect(
            new URL(`?subdomain=${customClaims.primaryBusinessId}`, request.url)
          );
        }

        // Fallback: redirect to business login
        return NextResponse.redirect(new URL('/auth/business/login', request.url));
      }
    }
  }

  // Protected customer account routes
  if (url.pathname.startsWith('/tenant/my-bookings') ||
      url.pathname.startsWith('/tenant/profile') ||
      url.pathname.startsWith('/my-bookings') ||
      url.pathname.startsWith('/profile')) {
    if (!hasAuthCookie) {
      return NextResponse.redirect(
        new URL(`/auth/customer/login?returnUrl=${encodeURIComponent(url.pathname + url.search)}`, request.url)
      );
    }
  }

  // Set locale header for i18n (will be read by next-intl in server components)
  requestHeaders.set('x-locale', 'pt-BR'); // Default, will be overridden by business settings

  // API routes must not be rewritten - they live at /api/*, not /tenant/api/*
  if (url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // If path already starts with /tenant, use next() to pass through with headers
  // Otherwise, rewrite to /tenant/* routes
  if (url.pathname.startsWith('/tenant')) {
    console.log('[Middleware] passing through /tenant with x-business-slug:', subdomain);
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    // Set on response - Next.js copies response headers to the request that server components read
    response.headers.set('x-business-slug', subdomain);
    // Fallback: pass URL so tenant can parse subdomain if header isn't available
    response.headers.set('x-middleware-request-url', request.url);
    response.cookies.set('x-business-slug', subdomain, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
    });
    return response;
  }

  // Rewrite non-tenant paths to /tenant/* routes with slug in header
  const response = NextResponse.rewrite(
    new URL(`/tenant${url.pathname}${url.search}`, request.url),
    {
      request: {
        headers: requestHeaders,
      },
    }
  );
  response.headers.set('x-business-slug', subdomain);
  response.headers.set('x-middleware-request-url', request.url);
  response.cookies.set('x-business-slug', subdomain, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
  });
  return response;
}

export const config = {
  // Run middleware for all routes - omit matcher to ensure /tenant/* is always processed
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg)$).*)',
  ],
};
