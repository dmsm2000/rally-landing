import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate-pipe';

@Component({
  imports: [TranslatePipe, RouterLink],
  selector: 'app-hero',
  styleUrl: './hero.scss',
  templateUrl: './hero.html',
})
export class Hero {
  protected readonly glowX = signal(50);
  protected readonly glowY = signal(38);

  @HostListener('mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    const { innerWidth, innerHeight } = window;
    this.glowX.set((event.clientX / innerWidth) * 100);
    this.glowY.set((event.clientY / innerHeight) * 100);
  }
}
