import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate-pipe';
import { RevealOnScroll } from '../../core/reveal-on-scroll';

@Component({
  imports: [TranslatePipe, RevealOnScroll],
  selector: 'app-adventure',
  styleUrl: './adventure.scss',
  templateUrl: './adventure.html',
})
export class Adventure {
  protected readonly stamps = ['🇵🇹', '🇪🇸', '🇫🇷', '🇮🇹', '🇧🇷', '🇺🇸', '🇦🇴', '🇦🇺'];
}
