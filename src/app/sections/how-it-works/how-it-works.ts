import { Component, signal } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate-pipe';
import { RevealOnScroll } from '../../core/reveal-on-scroll';

interface Question {
  icon: string;
  titleKey: string;
  bodyKey: string;
}

@Component({
  imports: [TranslatePipe, RevealOnScroll],
  selector: 'app-how-it-works',
  styleUrl: './how-it-works.scss',
  templateUrl: './how-it-works.html',
})
export class HowItWorks {
  protected readonly questions: Question[] = [
    { icon: '🙋', titleKey: 'howItWorks.q1Title', bodyKey: 'howItWorks.q1Body' },
    { icon: '📍', titleKey: 'howItWorks.q2Title', bodyKey: 'howItWorks.q2Body' },
    { icon: '🤝', titleKey: 'howItWorks.q3Title', bodyKey: 'howItWorks.q3Body' },
    { icon: '🛂', titleKey: 'howItWorks.q4Title', bodyKey: 'howItWorks.q4Body' },
  ];

  // Accordion, one open at a time — first one open by default so the interaction is discoverable.
  protected readonly openIndex = signal(0);

  protected toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? -1 : index);
  }
}
