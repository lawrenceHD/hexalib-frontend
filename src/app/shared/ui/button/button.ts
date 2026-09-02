import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled || loading"
      [class]="classes"
    >
      <span *ngIf="loading" class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() klass = '';

  get classes(): string {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 disabled:opacity-50 disabled:pointer-events-none';
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow-md active:scale-[0.98]',
      secondary: 'bg-white text-ink border border-slate-200 hover:bg-slate-50 active:scale-[0.98]',
      ghost: 'text-ink-muted hover:bg-slate-100 hover:text-ink',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    };
    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6 text-base',
      icon: 'h-9 w-9 p-0',
    };
    return [base, variants[this.variant], sizes[this.size], this.fullWidth ? 'w-full' : '', this.klass].join(' ');
  }
}
