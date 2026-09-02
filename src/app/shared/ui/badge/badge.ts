import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="classes"><ng-content></ng-content></span>`,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() size: 'sm' | 'md' = 'sm';

  get classes(): string {
    const base = 'inline-flex items-center font-semibold rounded-full whitespace-nowrap';
    const sizes = { sm: 'px-2.5 py-1 text-xs', md: 'px-3 py-1.5 text-xs' };
    const variants: Record<BadgeVariant, string> = {
      brand: 'bg-brand-50 text-brand-700 border border-brand-100',
      success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      warning: 'bg-amber-50 text-amber-700 border border-amber-200',
      danger: 'bg-red-50 text-red-700 border border-red-200',
      neutral: 'bg-slate-100 text-slate-700',
      info: 'bg-blue-50 text-blue-700 border border-blue-200',
    };
    return [base, sizes[this.size], variants[this.variant]].join(' ');
  }
}
