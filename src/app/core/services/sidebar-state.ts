import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  public collapsed$ = this.collapsedSubject.asObservable();

  toggle(): void {
    this.collapsedSubject.next(!this.collapsedSubject.value);
  }

  get isCollapsed(): boolean {
    return this.collapsedSubject.value;
  }
}