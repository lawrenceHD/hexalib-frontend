// src/app/app.routes.ts

import { Routes } from '@angular/router';

import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout';
import { authGuard }           from './core/guards/auth.guard';
import { roleGuard }           from './core/guards/role.guard';

export const routes: Routes = [

  // ── Public 
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.LoginComponent)
  },

  // ── Authentifié 
  {
    path:        '',
    component:   MainLayoutComponent,
    canActivate: [authGuard],
    children: [

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path:          'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },

      {
        path:          'livres',
        loadComponent: () =>
          import('./features/livres/components/livre-list/livre-list')
            .then(m => m.LivreListComponent)
      },
      {
        path:          'categories',
        loadComponent: () =>
          import('./features/categories/components/categorie-list/categorie-list')
            .then(m => m.CategorieListComponent)
      },
      {
        path:          'reductions',
        loadComponent: () =>
          import('./features/reductions/components/reduction-list/reduction-list')
            .then(m => m.ReductionListComponent)
      },

      {
        path: 'ventes',
        loadChildren: () =>
          import('./features/ventes/ventes.routes')
            .then(m => m.VENTES_ROUTES)
      },

      {
        path:        'comptabilite',
        canActivate: [roleGuard],
        data:        { roles: ['ADMIN'] },
        loadChildren: () =>
          import('./features/comptabilite/comptabilite.routes')
            .then(m => m.COMPTABILITE_ROUTES)
      },

      {
        path:          'rapports',
        canActivate:   [roleGuard],
        data:          { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/rapports/components/rapport-selector/rapport-selector')
            .then(m => m.RapportSelector)
      },

      {
        path:          'stock',
        canActivate:   [roleGuard],
        data:          { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/stock/components/mouvement-list/mouvement-list')
            .then(m => m.MouvementListComponent)
      },

      {
        path:          'fournisseurs',
        canActivate:   [roleGuard],
        data:          { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/fournisseurs/components/fournisseur-list/fournisseur-list')
            .then(m => m.FournisseurListComponent)
      },

      {
        path:        'commandes',
        canActivate: [roleGuard],
        data:        { roles: ['ADMIN'] },
        children: [
          {
            path:          '',
            loadComponent: () =>
              import('./features/commandes/components/commande-list/commande-list')
                .then(m => m.CommandeListComponent)
          },
          {
            path:          'nouveau',
            loadComponent: () =>
              import('./features/commandes/components/commande-form/commande-form')
                .then(m => m.CommandeFormComponent)
          },
          {
            path:          ':id',
            loadComponent: () =>
              import('./features/commandes/components/commande-detail/commande-detail')
                .then(m => m.CommandeDetailComponent)
          },
          {
            path:          ':id/modifier',
            loadComponent: () =>
              import('./features/commandes/components/commande-form/commande-form')
                .then(m => m.CommandeFormComponent)
          }
        ]
      },

      {
        path:          'utilisateurs',
        canActivate:   [roleGuard],
        data:          { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/utilisateurs/components/liste-utilisateurs/liste-utilisateurs')
            .then(m => m.ListeUtilisateursComponent)
      },
    ]
  },

  // Catch-all → login (optionnel, mais utile)
  { path: '**', redirectTo: 'login' }
];