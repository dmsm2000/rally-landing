import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate-pipe';

@Component({
  imports: [TranslatePipe],
  selector: 'app-instagram-link',
  styleUrl: './instagram-link.scss',
  templateUrl: './instagram-link.html',
})
export class InstagramLink {
  /** The footer has room for the handle; in the header the glyph alone keeps the bar tight. */
  readonly showHandle = input(false);

  protected readonly url = 'https://www.instagram.com/rally.tns/';
  protected readonly handle = '@rally.tns';
}
