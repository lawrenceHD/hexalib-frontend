import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="classes"><ng-content></ng-content></div>`,
})
export class CardComponent {
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() hover = false;
  @Input() klass = '';

  get classes(): string {
    const base = 'bg-surface rounded-2xl border border-slate-200 shadow-card';
    const pads: Record<string, string> = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };
    return [base, pads[this.padding], this.hover ? 'hover:shadow-card-hover hover:border-slate-300 transition-shadow cursor-pointer' : '', this.klass].join(' ');
  }
}
