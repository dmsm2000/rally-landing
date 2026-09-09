export type Locale = 'pt' | 'en' | 'es';

export const LOCALES: readonly Locale[] = ['pt', 'en', 'es'];

/** Portuguese is the site root (`/`), so it is what an unprefixed URL resolves to. */
export const DEFAULT_LOCALE: Locale = 'pt';

export const LOCALE_LABELS: Record<Locale, string> = {
  pt: 'PT',
  en: 'EN',
  es: 'ES',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  pt: '🇵🇹',
  en: '🇬🇧',
  es: '🇪🇸',
};

/**
 * URL path segment per locale. The default locale owns the bare root instead of a `/pt/` prefix:
 * one canonical home page, and no redirect between `/` and `/pt/` for a crawler to chew on.
 */
export const LOCALE_PATHS: Record<Locale, string> = {
  pt: '',
  en: 'en',
  es: 'es',
};

/**
 * `lang` attribute per locale — narrower than the hreflang codes on purpose. The copy is European
 * Portuguese, which is what a screen reader needs to know, while hreflang stays at plain `pt` so
 * Google also serves this page to Brazilian searchers.
 */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  pt: 'pt-PT',
  en: 'en',
  es: 'es',
};

/** Open Graph wants the underscored territory form, and rejects the bare two-letter codes. */
export const LOCALE_OG: Record<Locale, string> = {
  pt: 'pt_PT',
  en: 'en_GB',
  es: 'es_ES',
};

export const SITE_ORIGIN = 'https://rallytns.com';

/** Absolute, trailing-slash URL for a locale — the exact form used in canonical, hreflang and the sitemap. */
export function localeUrl(locale: Locale): string {
  const path = LOCALE_PATHS[locale];
  return path ? `${SITE_ORIGIN}/${path}/` : `${SITE_ORIGIN}/`;
}

/** Router path for a locale, for `routerLink`. */
export function localeRouterPath(locale: Locale): string {
  return `/${LOCALE_PATHS[locale]}`;
}

/**
 * The locale a URL points at, from its first path segment. Used to seed the active locale
 * synchronously at bootstrap, so the server and the browser start from the same one and hydration
 * has nothing to reconcile.
 */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];
  const match = LOCALES.find((locale) => LOCALE_PATHS[locale] === segment);
  return match ?? DEFAULT_LOCALE;
}
