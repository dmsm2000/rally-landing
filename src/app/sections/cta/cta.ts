import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../core/i18n/translate-pipe';
import { Translation } from '../../core/i18n/translation';
import { RevealOnScroll } from '../../core/reveal-on-scroll';
import { EMAIL_PATTERN, Waitlist } from '../../core/waitlist';

type FormState = 'idle' | 'submitting' | 'success' | 'invalid-email' | 'network-error';

@Component({
  imports: [TranslatePipe, RevealOnScroll, FormsModule],
  selector: 'app-cta',
  styleUrl: './cta.scss',
  templateUrl: './cta.html',
})
export class Cta {
  private readonly waitlist = inject(Waitlist);
  private readonly i18n = inject(Translation);

  protected readonly email = signal('');
  protected readonly state = signal<FormState>('idle');

  protected readonly canSubmit = computed(() => EMAIL_PATTERN.test(this.email().trim()));

  protected async submit(): Promise<void> {
    if (this.state() === 'submitting' || !this.canSubmit()) {
      return;
    }

    this.state.set('submitting');
    const result = await this.waitlist.join({ email: this.email(), locale: this.i18n.locale() });

    if (result.ok) {
      this.state.set('success');
      return;
    }

    this.state.set(result.reason === 'invalid-email' ? 'invalid-email' : 'network-error');
  }
}
