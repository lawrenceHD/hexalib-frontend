import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { CategorieListComponent } from './features/categories/components/categorie-list/categorie-list';
import { authGuard} from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role-guard';
import { LivreListComponent } from './features/livres/components/livre-list/livre-list';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: CategorieListComponent },
      { path: 'livres', component: LivreListComponent },
      {
    path: 'fournisseurs',
    loadComponent: () => import('./features/fournisseurs/components/fournisseur-list/fournisseur-list').then(m => m.FournisseurListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] } // Seulement pour les admins
  },
  {
    path: 'commandes',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/commandes/components/commande-list/commande-list').then(m => m.CommandeListComponent)
      },
      {
        path: 'nouveau',
        loadComponent: () => import('./features/commandes/components/commande-form/commande-form').then(m => m.CommandeFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/commandes/components/commande-detail/commande-detail').then(m => m.CommandeDetailComponent)
      },
      {
        path: ':id/modifier',
        loadComponent: () => import('./features/commandes/components/commande-form/commande-form').then(m => m.CommandeFormComponent)
      }
    ]
  },
      
    ]
  },
  //  {
  //   path: 'livres',
  //   loadComponent: () => import('./features/livres/components/livre-list/livre-list').then(m => m.LivreListComponent),
  //   canActivate: [authGuard]
  // },
  // {
  //   path: 'fournisseurs',
  //   loadComponent: () => import('./features/fournisseurs/components/fournisseur-list/fournisseur-list').then(m => m.FournisseurListComponent),
  //   canActivate: [authGuard, roleGuard],
  //   data: { roles: ['ADMIN'] } // Seulement pour les admins
  // },
  // {
  //   path: 'commandes',
  //   canActivate: [authGuard],
  //   children: [
  //     {
  //       path: '',
  //       loadComponent: () => import('./features/commandes/components/commande-list/commande-list').then(m => m.CommandeListComponent)
  //     },
  //     {
  //       path: 'nouveau',
  //       loadComponent: () => import('./features/commandes/components/commande-form/commande-form').then(m => m.CommandeFormComponent)
  //     },
  //     {
  //       path: ':id',
  //       loadComponent: () => import('./features/commandes/components/commande-detail/commande-detail').then(m => m.CommandeDetailComponent)
  //     },
  //     {
  //       path: ':id/modifier',
  //       loadComponent: () => import('./features/commandes/components/commande-form/commande-form').then(m => m.CommandeFormComponent)
  //     }
  //   ]
  // },
  
  { path: '**', redirectTo: '/login' }
];