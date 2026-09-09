import { DOCUMENT, Service, computed, inject, signal } from '@angular/core';
import { DEFAULT_LOCALE, LOCALES, Locale, localeFromPath } from './locale';
import { en } from './translations/en';
import { es } from './translations/es';
import { pt } from './translations/pt';

const DICTIONARIES: Record<Locale, Record<string, unknown>> = { pt, en, es };

/**
 * Runtime translation lookup by dotted key path, e.g. "hero.title".
 *
 * The active locale is owned by the URL (`/`, `/en/`, `/es/`), not by localStorage or the browser's
 * language: each locale has to be a real, crawlable page for hreflang to mean anything, and a
 * remembered preference silently contradicting the URL is exactly what breaks that. Seeding it from
 * the path at construction — rather than waiting for the router — also means the prerendered HTML
 * and the first browser render agree, so hydration has nothing to patch up.
 */
@Service()
export class Translation {
  private readonly document = inject(DOCUMENT);
  private readonly _locale = signal<Locale>(localeFromPath(this.document.location?.pathname ?? '/'));

  readonly locale = this._locale.asReadonly();
  readonly locales = LOCALES;

  private readonly dictionary = computed(() => DICTIONARIES[this._locale()]);

  setLocale(locale: Locale): void {
    this._locale.set(locale);
  }

  t(key: string, params?: Record<string, string | number>): string {
    const value = this.lookup(this.dictionary(), key) ?? this.lookup(DICTIONARIES[DEFAULT_LOCALE], key);
    const text = typeof value === 'string' ? value : key;
    return params ? this.interpolate(text, params) : text;
  }

  private lookup(dictionary: Record<string, unknown>, key: string): string | undefined {
    const value = key
      .split('.')
      .reduce<unknown>((node, segment) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[segment] : undefined), dictionary);
    return typeof value === 'string' ? value : undefined;
  }

  private interpolate(text: string, params: Record<string, string | number>): string {
    return text.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
  }
}
