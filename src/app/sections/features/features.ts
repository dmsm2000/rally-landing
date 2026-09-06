import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate-pipe';
import { RevealOnScroll } from '../../core/reveal-on-scroll';

interface Feature {
  icon: string;
  titleKey: string;
  bodyKey: string;
  accent: 'lime' | 'clay' | 'cobalt';
}

@Component({
  imports: [TranslatePipe, RevealOnScroll],
  selector: 'app-features',
  styleUrl: './features.scss',
  templateUrl: './features.html',
})
export class Features {
  protected readonly features: Feature[] = [
    { icon: '📰', titleKey: 'features.feedTitle', bodyKey: 'features.feedBody', accent: 'lime' },
    { icon: '📍', titleKey: 'features.courtsTitle', bodyKey: 'features.courtsBody', accent: 'clay' },
    { icon: '🎾', titleKey: 'features.matchesTitle', bodyKey: 'features.matchesBody', accent: 'cobalt' },
    { icon: '🛂', titleKey: 'features.passportTitle', bodyKey: 'features.passportBody', accent: 'lime' },
    { icon: '💬', titleKey: 'features.messagesTitle', bodyKey: 'features.messagesBody', accent: 'clay' },
    { icon: '🌍', titleKey: 'features.tripsTitle', bodyKey: 'features.tripsBody', accent: 'cobalt' },
  ];
}
