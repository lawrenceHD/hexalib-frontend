// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';   // ← Ajoute cette importation si elle n'est pas là

import { LoginComponent }         from './features/auth/login/login';
import { MainLayoutComponent }    from './shared/layouts/main-layout/main-layout';
import { CategorieListComponent } from './features/categories/components/categorie-list/categorie-list';
import { LivreListComponent }     from './features/livres/components/livre-list/livre-list';
import { ReductionListComponent } from './features/reductions/components/reduction-list/reduction-list';
import { RapportSelector }        from './features/rapports/components/rapport-selector/rapport-selector';
import { authGuard }              from './core/guards/auth.guard';
import { roleGuard }              from './core/guards/role-guard';

export const routes: Routes = [

  // ── Public 
  { path: 'login', component: LoginComponent },

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

      { path: 'livres',     component: LivreListComponent },
      { path: 'categories', component: CategorieListComponent },
      { path: 'reductions', component: ReductionListComponent },

      {
        path: 'ventes',
        loadChildren: () =>
          import('./features/ventes/ventes-routing-module')
            .then(m => m.VentesRoutingModule),
        canActivate: [authGuard]
      },

      {
        path: 'comptabilite',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/comptabilite/comptabilite-routing-module')
            .then(m => m.ComptabiliteRoutingModule)
      },

      {
        path:        'rapports',
        component:   RapportSelector,
        canActivate: [roleGuard],
        data:        { roles: ['ADMIN'] }
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