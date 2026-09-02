import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true }],
  template: `
    <div [class]="wrapperCls">
      <label *ngIf="label" class="block text-sm font-medium text-ink mb-1.5">{{ label }} <span *ngIf="required" class="text-red-500">*</span></label>
      <div class="relative">
        <span *ngIf="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
          <app-icon [name]="icon" [size]="18"></app-icon>
        </span>
        <input
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [class]="inputCls"
        />
      </div>
      <p *ngIf="hint" class="mt-1 text-xs text-ink-subtle">{{ hint }}</p>
      <p *ngIf="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: string = 'text';
  @Input() icon = '';
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() klass = '';

  value: string = '';
  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: string): void { this.value = v ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }

  onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.value = v;
    this.onChange(v);
  }

  get wrapperCls(): string { return this.klass; }
  get inputCls(): string {
    const base = 'block w-full rounded-xl border bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition';
    const pad = this.icon ? 'pl-10 pr-3 py-2.5' : 'px-3 py-2.5';
    const err = this.error ? 'border-red-300' : 'border-slate-200';
    return [base, pad, err].join(' ');
  }
}
