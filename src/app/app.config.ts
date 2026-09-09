import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(),
    provideRouter(
      routes,
      // The nav and hero links are in-page anchors, and the router owns navigation now, so it has to
      // do the scrolling. Position restoration stays off on purpose: switching language is a real
      // navigation, and throwing the reader back to the top of the page for it would be hostile.
      withInMemoryScrolling({ anchorScrolling: 'enabled' }),
    ),
  ],
};
