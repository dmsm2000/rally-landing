import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate-pipe';
import { RevealOnScroll } from '../../core/reveal-on-scroll';

@Component({
  imports: [TranslatePipe, RevealOnScroll],
  selector: 'app-not-this',
  styleUrl: './not-this.scss',
  templateUrl: './not-this.html',
})
export class NotThis {
  protected readonly items = ['notThis.item1', 'notThis.item2', 'notThis.item3'];
  protected readonly tickerKeys = ['notThis.ticker1', 'notThis.ticker2', 'notThis.ticker3', 'notThis.ticker4', 'notThis.ticker5'];
}
