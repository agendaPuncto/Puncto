import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { getBusinessSlug } from '@/lib/tenant';
import { db } from '@/lib/firebaseAdmin';

export default getRequestConfig(async () => {
  // Try to get locale from business settings
  let locale = 'pt-BR'; // default

  try {
    const businessSlug = getBusinessSlug();
    if (businessSlug) {
      const businessSnapshot = await db
        .collection('businesses')
        .where('slug', '==', businessSlug)
        .limit(1)
        .get();

      if (!businessSnapshot.empty) {
        const business = businessSnapshot.docs[0].data();
        if (business?.settings?.locale) {
          locale = business.settings.locale;
        }
      }
    }

    // Fallback to Accept-Language header if no business locale
    if (locale === 'pt-BR') {
      const headersList = headers();
      const acceptLanguage = headersList.get('accept-language');
      if (acceptLanguage) {
        // Simple language detection
        if (acceptLanguage.includes('en')) locale = 'en-US';
        else if (acceptLanguage.includes('es')) locale = 'es-ES';
      }
    }
  } catch (error) {
    console.error('Error detecting locale:', error);
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
