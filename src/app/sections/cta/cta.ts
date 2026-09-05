import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CountryData } from '../../core/data/country-data';
import { TranslatePipe } from '../../core/i18n/translate-pipe';
import { Translation } from '../../core/i18n/translation';
import { RevealOnScroll } from '../../core/reveal-on-scroll';
import { EMAIL_PATTERN, Waitlist } from '../../core/waitlist';
import { Autocomplete } from '../../shared/ui/autocomplete/autocomplete';

type FormState = 'idle' | 'submitting' | 'success' | 'invalid-email' | 'network-error';

@Component({
  imports: [TranslatePipe, RevealOnScroll, FormsModule, Autocomplete],
  selector: 'app-cta',
  styleUrl: './cta.scss',
  templateUrl: './cta.html',
})
export class Cta {
  private readonly waitlist = inject(Waitlist);
  private readonly i18n = inject(Translation);
  private readonly countryData = inject(CountryData);

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly country = signal('');
  protected readonly city = signal('');
  protected readonly state = signal<FormState>('idle');

  protected readonly countries = this.countryData.countries;
  protected readonly countryNames = computed(() => this.countries().map((c) => c.name));
  protected readonly countryFlags = computed(() => Object.fromEntries(this.countries().map((c) => [c.name, c.flag])));
  protected readonly cityOptions = signal<string[]>([]);

  protected readonly canSubmit = computed(() => this.name().trim().length > 0 && EMAIL_PATTERN.test(this.email().trim()));

  constructor() {
    this.countryData.loadCountries();
    // Re-fetches this country's city list (cached per country in the service) whenever it changes,
    // and drops any city already typed for a different country — the city field itself stays
    // disabled until a country matches, see cta.html.
    let previousCountry = '';
    effect(() => {
      const countryName = this.country();
      const match = this.countryData.countries().find((c) => c.name === countryName);

      if (countryName !== previousCountry) {
        this.city.set('');
        previousCountry = countryName;
      }

      if (!match) {
        this.cityOptions.set([]);
        return;
      }
      this.countryData.citiesFor(match.iso2).then((cities) => this.cityOptions.set(cities));
    });
  }

  protected async submit(): Promise<void> {
    if (this.state() === 'submitting' || !this.canSubmit()) {
      return;
    }

    this.state.set('submitting');
    const result = await this.waitlist.join({
      email: this.email(),
      name: this.name(),
      country: this.country(),
      city: this.city(),
      locale: this.i18n.locale(),
    });

    if (result.ok) {
      this.state.set('success');
      return;
    }

    this.state.set(result.reason === 'invalid-email' ? 'invalid-email' : 'network-error');
  }
}
