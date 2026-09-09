import { ApplicationRef, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from './core/i18n/translate-pipe';
import { Translation } from './core/i18n/translation';
import { TwemojiRendererService } from './core/services/twemoji-renderer.service';
import { InstagramLink } from './shared/instagram-link/instagram-link';
import { LanguageSwitcher } from './shared/language-switcher/language-switcher';
import { Footer } from './shared/footer/footer';

@Component({
  imports: [TranslatePipe, RouterLink, RouterOutlet, InstagramLink, LanguageSwitcher, Footer],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly i18n = inject(Translation);
  private readonly twemoji = inject(TwemojiRendererService);
  private readonly appRef = inject(ApplicationRef);

  constructor() {
    // `document.documentElement.lang` is set by Seo alongside the rest of the head, per route.
    //
    // Twemoji replaces emoji text nodes with <img> elements, and hydration claims the prerendered
    // DOM node by node. `afterNextRender` is not late enough: it fires once this shell has rendered,
    // while everything inside the router outlet is only claimed after the router settles — rewriting
    // those nodes in between is exactly the NG0500 "expected a text node but found <img>" crash.
    // Waiting for full app stability covers both.
    this.appRef.whenStable().then(() => this.twemoji.start());
  }
}
