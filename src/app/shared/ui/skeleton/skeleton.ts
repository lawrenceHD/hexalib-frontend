import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="classes" [style.width]="width" [style.height]="height"></div>`,
})
export class SkeletonComponent {
  @Input() width = '100%';
  @Input() height = '16px';
  @Input() rounded: 'md' | 'xl' | 'full' = 'md';
  @Input() klass = '';

  get classes(): string {
    const r = { md: 'rounded-md', xl: 'rounded-xl', full: 'rounded-full' }[this.rounded];
    return ['skeleton', r, this.klass].join(' ');
  }
}
