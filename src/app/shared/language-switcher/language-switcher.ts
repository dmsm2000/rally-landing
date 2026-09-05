import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate-pipe';
import { LOCALE_FLAGS, LOCALE_LABELS, Locale } from '../../core/i18n/locale';
import { Translation } from '../../core/i18n/translation';

@Component({
  imports: [TranslatePipe],
  selector: 'app-language-switcher',
  styleUrl: './language-switcher.scss',
  templateUrl: './language-switcher.html',
})
export class LanguageSwitcher {
  protected readonly i18n = inject(Translation);
  protected readonly labels = LOCALE_LABELS;
  protected readonly flags = LOCALE_FLAGS;

  protected select(locale: Locale): void {
    this.i18n.setLocale(locale);
  }
}
