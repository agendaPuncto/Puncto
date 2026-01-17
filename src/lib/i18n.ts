import { getTranslations } from 'next-intl/server';

/**
 * Server-side translation helper
 * Usage in server components:
 * const t = await getTranslations('common');
 * t('save') // => "Salvar" or "Save" depending on locale
 */
export async function getServerTranslations(namespace?: string) {
  return await getTranslations(namespace);
}

/**
 * Client-side translation hook
 * Usage in client components:
 * const t = useTranslations('common');
 * t('save') // => "Salvar" or "Save" depending on locale
 */
export { useTranslations } from 'next-intl';
