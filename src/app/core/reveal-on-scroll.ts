import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Adds `is-visible` the first time the element scrolls into view, which is what the `[data-reveal]`
 * rules in styles.css transition against. One-shot on purpose: re-animating on the way back up reads
 * as a glitch, not as polish.
 */
@Directive({
  selector: '[appRevealOnScroll]',
  host: {
    '[attr.data-reveal]': 'appRevealOnScroll() || "rise"',
    '[style.--reveal-delay]': 'revealDelay()',
  },
})
export class RevealOnScroll implements OnInit, OnDestroy {
  readonly appRevealOnScroll = input<'rise' | 'left' | 'right' | 'scale' | ''>('');
  readonly revealDelay = input('0s');

  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const element = this.host.nativeElement as HTMLElement;

    if (typeof IntersectionObserver === 'undefined') {
      element.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.classList.add('is-visible');
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
