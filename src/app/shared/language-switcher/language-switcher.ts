import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate-pipe';
import { LOCALE_FLAGS, LOCALE_LABELS, Locale, localeRouterPath } from '../../core/i18n/locale';
import { Translation } from '../../core/i18n/translation';
import { TwemojiRendererService } from '../../core/services/twemoji-renderer.service';

/**
 * Each language is a URL now, so the switcher is a set of real links rather than a state toggle:
 * a crawler can follow them, and the address bar always matches the language on screen.
 */
@Component({
  imports: [TranslatePipe, RouterLink],
  selector: 'app-language-switcher',
  styleUrl: './language-switcher.scss',
  templateUrl: './language-switcher.html',
})
export class LanguageSwitcher {
  protected readonly i18n = inject(Translation);
  protected readonly twemoji = inject(TwemojiRendererService);
  protected readonly labels = LOCALE_LABELS;
  protected readonly flags = LOCALE_FLAGS;
  protected readonly open = signal(false);

  private readonly host = inject(ElementRef<HTMLElement>);

  protected pathFor(locale: Locale): string {
    return localeRouterPath(locale);
  }

  protected toggle(): void {
    this.open.set(!this.open());
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
