import { Injectable } from '@angular/core';
import twemoji from '@twemoji/api';

// Pinned to the installed @twemoji/api version so the CDN artwork can't drift/break unexpectedly.
const SVG_BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/';

/**
 * Renders every emoji character in the DOM as a Twemoji SVG `<img>` — same look on iOS/Android/desktop,
 * instead of each device's own (inconsistent) emoji font. Started once from the root `App` component.
 *
 * Templates must never put an emoji in the same text node as an `{{ interpolation }}`: `twemoji.parse()`
 * swaps that whole text node out for `<img>`, leaving Angular updating a node that is no longer in the
 * document (the text then silently freezes on the first locale rendered). Give the emoji its own
 * `<span>`, or use `urlFor()` when the emoji itself has to change reactively.
 */
@Injectable({ providedIn: 'root' })
export class TwemojiRendererService {
  private observer?: MutationObserver;
  private renderScheduled = false;

  start(): void {
    if (this.observer) {
      return;
    }
    this.render();
    // Angular re-renders content constantly (language switch, scroll reveals) — keep re-parsing new
    // text as it appears. twemoji.parse() is idempotent, so re-running it on already-converted
    // content (including the <img> tags it just inserted) is a cheap no-op.
    this.observer = new MutationObserver(() => this.scheduleRender());
    this.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  /** Returns a stable Twemoji SVG URL for UI that must update its emoji reactively. */
  urlFor(emoji: string): string {
    // Twemoji names its assets without the variation selector (❤️ is 2764.svg, not 2764-fe0f.svg), so
    // strip it the way twemoji.parse() does internally — otherwise those emoji 404.
    return `${SVG_BASE}svg/${twemoji.convert.toCodePoint(emoji.replace(/\uFE0F/g, ''))}.svg`;
  }

  private scheduleRender(): void {
    if (this.renderScheduled) {
      return;
    }
    this.renderScheduled = true;
    queueMicrotask(() => {
      this.renderScheduled = false;
      this.render();
    });
  }

  private render(): void {
    twemoji.parse(document.body, { base: SVG_BASE, folder: 'svg', ext: '.svg' });
  }
}
