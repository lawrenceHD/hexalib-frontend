import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout';
import { CategorieListComponent } from './features/categories/components/categorie-list/categorie-list';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role-guard';
import { LivreListComponent } from './features/livres/components/livre-list/livre-list';
import { ReductionListComponent } from './features/reductions/components/reduction-list/reduction-list';
import { RapportDashboard } from './features/rapports/components/rapport-dashboard/rapport-dashboard';
import { RapportSelector } from './features/rapports/components/rapport-selector/rapport-selector';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [

      // ── Dashboard (remplacé par RapportDashboard) ─────────────────────────
      { path: 'dashboard', component: RapportDashboard },

      // ── Rapports : génération et impression uniquement ────────────────────
      { path: 'rapports', component: RapportSelector },

      // ── Catalogue ─────────────────────────────────────────────────────────
      { path: 'categories', component: CategorieListComponent },
      { path: 'livres',     component: LivreListComponent },
      { path: 'reductions', component: ReductionListComponent },

      // ── Fournisseurs (admin seulement) ────────────────────────────────────
      {
        path: 'fournisseurs',
        loadComponent: () => import('./features/fournisseurs/components/fournisseur-list/fournisseur-list')
          .then(m => m.FournisseurListComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] }
      },

      // ── Commandes ─────────────────────────────────────────────────────────
      {
        path: 'commandes',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/commandes/components/commande-list/commande-list')
              .then(m => m.CommandeListComponent)
          },
          {
            path: 'nouveau',
            loadComponent: () => import('./features/commandes/components/commande-form/commande-form')
              .then(m => m.CommandeFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/commandes/components/commande-detail/commande-detail')
              .then(m => m.CommandeDetailComponent)
          },
          {
            path: ':id/modifier',
            loadComponent: () => import('./features/commandes/components/commande-form/commande-form')
              .then(m => m.CommandeFormComponent)
          }
        ]
      }
    ]
  },

  { path: '**', redirectTo: '/login' }
];