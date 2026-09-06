import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate-pipe';
import { LOCALE_FLAGS, LOCALE_LABELS, Locale } from '../../core/i18n/locale';
import { Translation } from '../../core/i18n/translation';
import { TwemojiRendererService } from '../../core/services/twemoji-renderer.service';

@Component({
  imports: [TranslatePipe],
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

  protected toggle(): void {
    this.open.set(!this.open());
  }

  protected select(locale: Locale): void {
    this.i18n.setLocale(locale);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
