import { Component, effect, inject } from '@angular/core';
import { TranslatePipe } from './core/i18n/translate-pipe';
import { Translation } from './core/i18n/translation';
import { TwemojiRendererService } from './core/services/twemoji-renderer.service';
import { InstagramLink } from './shared/instagram-link/instagram-link';
import { LanguageSwitcher } from './shared/language-switcher/language-switcher';
import { Footer } from './shared/footer/footer';
import { Hero } from './sections/hero/hero';
import { HowItWorks } from './sections/how-it-works/how-it-works';
import { Features } from './sections/features/features';
import { NotThis } from './sections/not-this/not-this';
import { Adventure } from './sections/adventure/adventure';
import { Cta } from './sections/cta/cta';

@Component({
  imports: [TranslatePipe, InstagramLink, LanguageSwitcher, Footer, Hero, HowItWorks, Features, NotThis, Adventure, Cta],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly i18n = inject(Translation);
  private readonly twemoji = inject(TwemojiRendererService);

  constructor() {
    effect(() => {
      document.documentElement.lang = this.i18n.locale();
    });
    this.twemoji.start();
  }
}
