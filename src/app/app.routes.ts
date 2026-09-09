import { Routes } from '@angular/router';
import { LOCALES, LOCALE_PATHS } from './core/i18n/locale';
import { localeResolver } from './core/i18n/locale-resolver';
import { Landing } from './pages/landing/landing';

/**
 * One route per language. The prefixed locales come first because the default one sits at `''`,
 * and it needs `pathMatch: 'full'` so it does not swallow `/en` and `/es` on its way past.
 */
export const routes: Routes = [
  ...LOCALES.filter((locale) => LOCALE_PATHS[locale] !== '').map((locale) => ({
    path: LOCALE_PATHS[locale],
    component: Landing,
    data: { locale },
    resolve: { locale: localeResolver },
  })),
  {
    path: '',
    pathMatch: 'full' as const,
    component: Landing,
    data: { locale: LOCALES.find((locale) => LOCALE_PATHS[locale] === '') },
    resolve: { locale: localeResolver },
  },
  { path: '**', redirectTo: '' },
];
