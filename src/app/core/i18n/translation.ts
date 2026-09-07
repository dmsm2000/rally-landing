import { Service, computed, signal } from '@angular/core';
import { DEFAULT_LOCALE, LOCALES, Locale } from './locale';
import { en } from './translations/en';
import { es } from './translations/es';
import { pt } from './translations/pt';

const STORAGE_KEY = 'rally-landing.locale';

const DICTIONARIES: Record<Locale, Record<string, unknown>> = { pt, en, es };

/** Runtime translation lookup by dotted key path, e.g. "hero.title". Persists the chosen locale in localStorage. */
@Service()
export class Translation {
  private readonly _locale = signal<Locale>(this.readStoredLocale());

  readonly locale = this._locale.asReadonly();
  readonly locales = LOCALES;

  private readonly dictionary = computed(() => DICTIONARIES[this._locale()]);

  setLocale(locale: Locale): void {
    this._locale.set(locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // localStorage may be unavailable (private mode) — locale still works for the session.
    }
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

  private readStoredLocale(): Locale {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (LOCALES as readonly string[]).includes(stored)) {
        return stored as Locale;
      }
    } catch {
      // ignore and fall back to detection
    }
    return this.detectBrowserLocale();
  }

  /** No stored preference yet: match the visitor's own browser language before falling back to the default. */
  private detectBrowserLocale(): Locale {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const language of languages) {
      const prefix = language.toLowerCase().split('-')[0];
      if ((LOCALES as readonly string[]).includes(prefix)) {
        return prefix as Locale;
      }
    }
    return DEFAULT_LOCALE;
  }
}
