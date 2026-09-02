import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [name]="name" [size]="size" [strokeWidth]="strokeWidth" [class]="klass"></lucide-icon>`,
})
export class IconComponent {
  @Input() name: string = 'info';
  @Input() size: number = 20;
  @Input() strokeWidth: number = 2;
  @Input() klass: string = '';
}
