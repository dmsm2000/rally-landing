import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate-pipe';

@Component({
  imports: [TranslatePipe],
  selector: 'app-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
}
