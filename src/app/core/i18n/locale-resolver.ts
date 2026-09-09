import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { DEFAULT_LOCALE, Locale } from './locale';
import { Translation } from './translation';
import { Seo } from '../seo/seo';

/**
 * Applies the route's locale before its component is created, so nothing ever renders in the wrong
 * language — neither the prerendered HTML nor the browser after a client-side language switch.
 */
export const localeResolver: ResolveFn<Locale> = (route) => {
  const locale = (route.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE;
  inject(Translation).setLocale(locale);
  inject(Seo).apply(locale);
  return locale;
};
