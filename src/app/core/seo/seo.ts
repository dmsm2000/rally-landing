import { DOCUMENT, Service, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LOCALES, LOCALE_HTML_LANG, LOCALE_OG, Locale, localeUrl } from '../i18n/locale';
import { Translation } from '../i18n/translation';

/**
 * The hreflang target for visitors whose language matches none of ours. English is the widest net,
 * so it gets the job rather than the Portuguese root.
 */
const X_DEFAULT_LOCALE: Locale = 'en';

/**
 * Writes every per-locale head tag: title, description, canonical, hreflang and the social cards.
 *
 * Called from the route resolver rather than from an effect, so it runs before the page component
 * is created and the prerendered HTML is guaranteed to carry the finished head — an effect would
 * only flush later, and what a crawler reads is exactly the file on disk.
 */
@Service()
export class Seo {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly i18n = inject(Translation);

  apply(locale: Locale): void {
    const title = this.i18n.t('seo.title');
    const description = this.i18n.t('seo.description');
    const url = localeUrl(locale);

    this.title.setTitle(title);
    this.document.documentElement.lang = LOCALE_HTML_LANG[locale];

    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image:alt', content: this.i18n.t('seo.ogImageAlt') });
    this.meta.updateTag({ property: 'og:locale', content: LOCALE_OG[locale] });

    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Multi-valued and order-sensitive, so rewrite the set instead of trying to update in place.
    for (const stale of this.meta.getTags("property='og:locale:alternate'")) {
      this.meta.removeTagElement(stale);
    }
    for (const alternate of LOCALES.filter((candidate) => candidate !== locale)) {
      this.meta.addTag({ property: 'og:locale:alternate', content: LOCALE_OG[alternate] });
    }

    this.setCanonicalAndAlternates(url);
  }

  /**
   * `Meta` only manages `<meta>`, so the link tags are handled by hand. They are cleared first
   * because client-side language switching runs this again on a head that already has them.
   */
  private setCanonicalAndAlternates(canonical: string): void {
    const head = this.document.head;
    for (const stale of Array.from(
      head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]'),
    )) {
      stale.remove();
    }

    head.appendChild(this.link({ rel: 'canonical', href: canonical }));

    // Every version must list every version, itself included, or Google discards the whole cluster.
    for (const alternate of LOCALES) {
      head.appendChild(
        this.link({ rel: 'alternate', hreflang: alternate, href: localeUrl(alternate) }),
      );
    }
    head.appendChild(
      this.link({ rel: 'alternate', hreflang: 'x-default', href: localeUrl(X_DEFAULT_LOCALE) }),
    );
  }

  private link(attributes: Record<string, string>): HTMLLinkElement {
    const element = this.document.createElement('link');
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
    return element;
  }
}
