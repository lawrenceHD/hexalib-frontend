import { Routes } from '@angular/router';

export const COMPTABILITE_ROUTES: Routes = [
  { path: '',               redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard-compta/dashboard-compta').then(m => m.DashboardComptaComponent)
  },
  {
    path: 'depenses',
    loadComponent: () =>
      import('./components/depense-list/depense-list').then(m => m.DepenseListComponent)
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./components/categorie-depense-list/categorie-depense-list').then(m => m.CategorieDepenseListComponent)
  },
  {
    path: 'rapport-ventes',
    loadComponent: () =>
      import('./components/rapport-ventes/rapport-ventes').then(m => m.RapportVentesComponent)
  },
  {
    path: 'compte-resultat',
    loadComponent: () =>
      import('./components/rapport-compte-resultat/rapport-compte-resultat').then(m => m.RapportCompteResultatComponent)
  },
  {
    path: 'tresorerie',
    loadComponent: () =>
      import('./components/rapport-tresorerie/rapport-tresorerie').then(m => m.RapportTresorerieComponent)
  },
  {
    path: 'stock-valorise',
    loadComponent: () =>
      import('./components/rapport-stock-valorise/rapport-stock-valorise').then(m => m.RapportStockValoriseComponent)
  }
];
