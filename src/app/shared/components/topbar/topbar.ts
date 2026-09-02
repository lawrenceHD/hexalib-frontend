import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from '../../ui/icon/icon';

interface Crumb { label: string; url: string; }

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard', livres: 'Livres', categories: 'Catégories', ventes: 'Ventes',
  'point-vente': 'Point de vente', liste: 'Liste', reductions: 'Réductions', stock: 'Stock',
  fournisseurs: 'Fournisseurs', commandes: 'Commandes', rapports: 'Rapports',
  comptabilite: 'Comptabilité', utilisateurs: 'Utilisateurs'
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="h-14 bg-white border-b border-slate-200 flex items-center gap-4 px-4 sm:px-6">
      <nav class="hidden sm:flex items-center gap-1.5 text-sm min-w-0 flex-1">
        <a routerLink="/dashboard" class="text-slate-400 hover:text-slate-700 flex items-center gap-1"><app-icon name="dashboard" [size]="14"></app-icon> Accueil</a>
        <span *ngFor="let c of crumbs" class="flex items-center gap-1.5">
          <app-icon name="chevron-right" [size]="14" klass="text-slate-300"></app-icon>
          <a *ngIf="c.url" [routerLink]="c.url" class="text-slate-500 hover:text-slate-900 truncate">{{ c.label }}</a>
          <span *ngIf="!c.url" class="text-slate-900 font-medium truncate">{{ c.label }}</span>
        </span>
      </nav>

      <div class="flex-1 sm:hidden truncate text-sm font-medium text-slate-900">{{ crumbs[crumbs.length-1]?.label || 'Hexalib' }}</div>

      <!-- Global search placeholder (cmd+k) -->
      <div class="hidden md:flex items-center gap-2 ml-auto">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><app-icon name="search" [size]="16"></app-icon></span>
          <input placeholder="Rechercher… (⌘K)" readonly
            class="pl-9 pr-16 py-2 w-[280px] bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none cursor-pointer hover:bg-white focus:bg-white"
            (click)="openCommand = true" />
          <span class="absolute inset-y-0 right-0 pr-2 flex items-center"><span class="hidden lg:inline-flex text-xs bg-white border border-slate-200 px-1.5 py-1 rounded-md text-slate-500">⌘ K</span></span>
        </div>
      </div>

      <!-- Command palette mock -->
      <div *ngIf="openCommand" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="openCommand=false"></div>
        <div class="absolute top-[20%] left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white rounded-2xl shadow-modal border border-slate-200 overflow-hidden animate-slide-up">
          <div class="flex items-center gap-3 px-4 py-3 border-b">
            <app-icon name="search" [size]="18" klass="text-slate-400"></app-icon>
            <input autofocus placeholder="Tapez une commande, un livre, un client…" class="flex-1 outline-none text-sm" />
            <button (click)="openCommand=false" class="h-8 w-8 grid place-items-center rounded-lg hover:bg-slate-100"><app-icon name="x" [size]="16"></app-icon></button>
          </div>
          <div class="p-2 text-sm">
            <p class="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Raccourcis</p>
            <a (click)="openCommand=false" routerLink="/ventes/point-vente" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50"><app-icon name="shopping-cart" [size]="16"></app-icon> Nouveau point de vente</a>
            <a (click)="openCommand=false" routerLink="/livres" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50"><app-icon name="book-open" [size]="16"></app-icon> Aller au catalogue</a>
            <a (click)="openCommand=false" routerLink="/ventes" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50"><app-icon name="bar-chart-3" [size]="16"></app-icon> Voir les ventes</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TopbarComponent implements OnInit {
  crumbs: Crumb[] = [];
  openCommand = false;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.build(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => this.build(e.urlAfterRedirects));
    // cmd+k
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); this.openCommand = !this.openCommand; }
        if (e.key === 'Escape') this.openCommand = false;
      });
    }
  }
  private build(url: string): void {
    const parts = url.split('?')[0].split('#')[0].split('/').filter(Boolean);
    let acc = '';
    this.crumbs = parts.map(p => {
      acc += '/' + p;
      const isId = /^[0-9a-fA-F-]{8,}$/.test(p) || /^\d+$/.test(p);
      return { label: isId ? 'Détail' : (LABELS[p] || p.charAt(0).toUpperCase() + p.slice(1)), url: isId ? '' : acc };
    });
    if (this.crumbs.length && this.crumbs[0].label === 'Dashboard') this.crumbs = this.crumbs.slice(1);
  }
}
