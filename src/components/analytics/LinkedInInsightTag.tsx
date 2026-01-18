'use client';

import Script from 'next/script';

const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

declare global {
  interface Window {
    _linkedin_data_partner_ids?: string[];
    lintrk?: (action: string, data?: Record<string, unknown>) => void;
  }
}

export default function LinkedInInsightTag() {
  if (!LINKEDIN_PARTNER_ID) {
    return null;
  }

  return (
    <>
      <Script id="linkedin-insight-init" strategy="afterInteractive">
        {`
          _linkedin_data_partner_ids = _linkedin_data_partner_ids || [];
          _linkedin_data_partner_ids.push("${LINKEDIN_PARTNER_ID}");
        `}
      </Script>
      <Script id="linkedin-insight-tag" strategy="afterInteractive">
        {`
          (function(l) {
            if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);
          })(window.lintrk);
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`}
        />
      </noscript>
    </>
  );
}

// LinkedIn conversion tracking functions
export function trackLinkedInConversion(conversionId: string) {
  if (typeof window !== 'undefined' && window.lintrk) {
    window.lintrk('track', { conversion_id: conversionId });
  }
}

// Common conversion events
export function trackLinkedInSignup() {
  trackLinkedInConversion('signup');
}

export function trackLinkedInDemoRequest() {
  trackLinkedInConversion('demo_request');
}

export function trackLinkedInTrialStart() {
  trackLinkedInConversion('trial_start');
}

export function trackLinkedInPurchase(value?: number) {
  if (typeof window !== 'undefined' && window.lintrk) {
    window.lintrk('track', { 
      conversion_id: 'purchase',
      value: value,
      currency: 'BRL'
    });
  }
}
