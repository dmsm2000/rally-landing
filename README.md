# 🎾 RALLY — Landing Page

The public marketing page for RALLY, the social tennis app in the sibling `rally/` project. Dark-mode
only (no toggle — this is a marketing page, not the app shell), animated, and available in
Portuguese (default), English and Spanish.

Single page, no backend: the primary call to action is a `mailto:` link, since there are no real
users yet and no waitlist backend to wire it to.

## Structure

```text
src/app/
  core/
    i18n/            Translation service + pipe + pt/en/es dictionaries (pt is the source of truth)
    reveal-on-scroll.ts   IntersectionObserver directive driving the scroll-in animations
  sections/          One component per page section (hero, how-it-works, features, not-this, adventure, cta)
  shared/            Language switcher, footer
```

Design tokens (`src/styles.css`) mirror the main app's dark palette (`ink`/`bone`/`lime`/`clay`/`cobalt`)
so the two feel like one brand — see `../rally/PRODUCT.md`'s "Brand Identity" section for the RALLY
naming rule (always caps, feminine gender in Portuguese) this page follows.

## Development

```bash
npm install
npm start   # http://localhost:4200
npm run build
```
