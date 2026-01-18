'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + searchParams.toString();
    
    // Track page view
    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);
}

function PageTracker() {
  usePageTracking();
  return null;
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageTracker />
      </Suspense>
    </>
  );
}

// Custom event tracking functions
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

export function trackConversion(conversionId: string, value?: number) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  window.gtag?.('event', 'conversion', {
    send_to: conversionId,
    value: value,
    currency: 'BRL',
  });
}

export function trackSignup(method: string) {
  trackEvent('sign_up', 'engagement', method);
}

export function trackLogin(method: string) {
  trackEvent('login', 'engagement', method);
}

export function trackDemoRequest() {
  trackEvent('demo_request', 'lead', 'demo_form');
}

export function trackContactForm() {
  trackEvent('contact_form', 'lead', 'contact_page');
}

export function trackNewsletterSignup() {
  trackEvent('newsletter_signup', 'lead', 'footer');
}

export function trackPricingView(plan: string) {
  trackEvent('view_item', 'ecommerce', plan);
}

export function trackBeginTrial(plan: string) {
  trackEvent('begin_checkout', 'ecommerce', plan);
}

// Declare gtag on window
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
