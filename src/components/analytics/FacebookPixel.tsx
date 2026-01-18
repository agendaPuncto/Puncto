'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// Track page views
function usePixelPageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!FB_PIXEL_ID) return;

    // Track page view
    window.fbq?.('track', 'PageView');
  }, [pathname, searchParams]);
}

function PixelPageTracker() {
  usePixelPageTracking();
  return null;
}

export default function FacebookPixel() {
  if (!FB_PIXEL_ID) {
    return null;
  }

  return (
    <>
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <PixelPageTracker />
      </Suspense>
    </>
  );
}

// Custom event tracking functions
export function trackFBEvent(event: string, params?: Record<string, unknown>) {
  if (!FB_PIXEL_ID || typeof window === 'undefined') return;

  window.fbq?.('track', event, params);
}

export function trackFBCustomEvent(event: string, params?: Record<string, unknown>) {
  if (!FB_PIXEL_ID || typeof window === 'undefined') return;

  window.fbq?.('trackCustom', event, params);
}

// Standard Facebook Pixel events
export function trackFBLead(value?: number) {
  trackFBEvent('Lead', {
    value: value,
    currency: 'BRL',
  });
}

export function trackFBCompleteRegistration(value?: number) {
  trackFBEvent('CompleteRegistration', {
    value: value,
    currency: 'BRL',
  });
}

export function trackFBInitiateCheckout(value?: number, contentIds?: string[]) {
  trackFBEvent('InitiateCheckout', {
    value: value,
    currency: 'BRL',
    content_ids: contentIds,
  });
}

export function trackFBPurchase(value: number, contentIds?: string[]) {
  trackFBEvent('Purchase', {
    value: value,
    currency: 'BRL',
    content_ids: contentIds,
  });
}

export function trackFBViewContent(contentName: string, contentId?: string) {
  trackFBEvent('ViewContent', {
    content_name: contentName,
    content_ids: contentId ? [contentId] : undefined,
  });
}

export function trackFBContact() {
  trackFBEvent('Contact');
}

export function trackFBSchedule() {
  trackFBEvent('Schedule');
}

// Declare fbq on window
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}
