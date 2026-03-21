// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent }         from './features/auth/login/login';
import { MainLayoutComponent }    from './shared/layouts/main-layout/main-layout';
import { CategorieListComponent } from './features/categories/components/categorie-list/categorie-list';
import { LivreListComponent }     from './features/livres/components/livre-list/livre-list';
import { ReductionListComponent } from './features/reductions/components/reduction-list/reduction-list';
import { RapportSelector }        from './features/rapports/components/rapport-selector/rapport-selector';
import { authGuard }              from './core/guards/auth.guard';
import { roleGuard }              from './core/guards/role-guard';

export const routes: Routes = [

  // ── Public (DOIT être avant le bloc path:'') ──────────────────────────────
  { path: 'login', component: LoginComponent },

  // ── Authentifié ───────────────────────────────────────────────────────────
  {
    path:        '',
    component:   MainLayoutComponent,
    canActivate: [authGuard],
    children: [

      // Redirection racine → dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path:          'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },

      // ── Catalogue (admin + vendeur) ────────────────────────────────────────
      { path: 'livres',     component: LivreListComponent },
      { path: 'categories', component: CategorieListComponent },
      { path: 'reductions', component: ReductionListComponent },

      // ── Ventes (admin + vendeur) ───────────────────────────────────────────
     {
  path: 'ventes',
  loadChildren: () =>
    import('./features/ventes/ventes-routing-module')
      .then(m => m.VentesRoutingModule),
  canActivate: [authGuard]
},

      // ── Rapports (admin uniquement) ───────────────────────────────────────
      {
        path:        'rapports',
        component:   RapportSelector,
        canActivate: [roleGuard],
        data:        { roles: ['ADMIN'] }
      },

      // ── Stock / Mouvements (admin uniquement) ─────────────────────────────
      {
        path:          'stock',
        canActivate:   [roleGuard],
        data:          { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/stock/components/mouvement-list/mouvement-list')
            .then(m => m.MouvementListComponent)
      },

      // ── Fournisseurs (admin uniquement) ───────────────────────────────────
      {
        path:          'fournisseurs',
        canActivate:   [roleGuard],
        data:          { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/fournisseurs/components/fournisseur-list/fournisseur-list')
            .then(m => m.FournisseurListComponent)
      },

      // ── Commandes fournisseurs (admin uniquement) ─────────────────────────
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

      // ── Utilisateurs (admin uniquement) ───────────────────────────────────
      {
        path:          'utilisateurs',
        canActivate:   [roleGuard],
        data:          { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/utilisateurs/components/liste-utilisateurs/liste-utilisateurs')
            .then(m => m.ListeUtilisateursComponent)
      },

      // ── Réservations (admin + vendeur) ────────────────────────────────────
      // {
      //   path:          'reservations',
      //   loadComponent: () =>
      //     import('./features/reservations/components/liste-reservations/liste-reservations')
      //       .then(m => m.ListeReservationsComponent)
      // },

    ]
  },

  // Catch-all global → login (PAS de redirection vers dashboard pour éviter la boucle)
  // { path: '**', redirectTo: 'login' }

];