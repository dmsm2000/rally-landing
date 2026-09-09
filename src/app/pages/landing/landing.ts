import { Component } from '@angular/core';
import { Hero } from '../../sections/hero/hero';
import { HowItWorks } from '../../sections/how-it-works/how-it-works';
import { Features } from '../../sections/features/features';
import { NotThis } from '../../sections/not-this/not-this';
import { Adventure } from '../../sections/adventure/adventure';
import { Cta } from '../../sections/cta/cta';

/** The page itself. Routed once per locale (`/`, `/en`, `/es`) so each language is its own URL. */
@Component({
  imports: [Hero, HowItWorks, Features, NotThis, Adventure, Cta],
  selector: 'app-landing',
  templateUrl: './landing.html',
})
export class Landing {}
