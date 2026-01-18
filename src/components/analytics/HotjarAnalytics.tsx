'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
const HOTJAR_VERSION = process.env.NEXT_PUBLIC_HOTJAR_VERSION || '6';

declare global {
  interface Window {
    hj?: (...args: unknown[]) => void;
    _hjSettings?: {
      hjid: number;
      hjsv: number;
    };
  }
}

export default function HotjarAnalytics() {
  if (!HOTJAR_ID) {
    return null;
  }

  return (
    <Script id="hotjar-analytics" strategy="afterInteractive">
      {`
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${HOTJAR_ID},hjsv:${HOTJAR_VERSION}};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `}
    </Script>
  );
}

// Microsoft Clarity alternative (free, owned by Microsoft)
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export function ClarityAnalytics() {
  if (!CLARITY_ID) {
    return null;
  }

  return (
    <Script id="clarity-analytics" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `}
    </Script>
  );
}

// Hotjar event tracking functions
export function trackHotjarEvent(eventName: string) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('event', eventName);
  }
}

export function identifyHotjarUser(userId: string, attributes?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('identify', userId, attributes);
  }
}

export function triggerHotjarSurvey(surveyId: string) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('trigger', surveyId);
  }
}

// Hotjar state tagging for filtering recordings
export function tagHotjarRecording(tags: string[]) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('stateChange', tags.join(','));
  }
}

// Form analytics - track form interactions
export function trackFormStart(formName: string) {
  trackHotjarEvent(`form_start_${formName}`);
}

export function trackFormComplete(formName: string) {
  trackHotjarEvent(`form_complete_${formName}`);
}

export function trackFormError(formName: string, errorField: string) {
  trackHotjarEvent(`form_error_${formName}_${errorField}`);
}

// Page-specific tracking
export function trackPageSection(sectionName: string) {
  tagHotjarRecording([sectionName]);
}

// User behavior tracking
export function trackFeatureUsage(featureName: string) {
  trackHotjarEvent(`feature_used_${featureName}`);
}

export function trackButtonClick(buttonName: string) {
  trackHotjarEvent(`button_click_${buttonName}`);
}
