import { Routes } from '@angular/router';

export const VENTES_ROUTES: Routes = [
  { path: '', redirectTo: 'liste', pathMatch: 'full' },
  {
    path: 'point-vente',
    loadComponent: () =>
      import('./components/point-vente/point-vente').then(m => m.PointVenteComponent)
  },
  {
    path: 'liste',
    loadComponent: () =>
      import('./components/vente-list/vente-list').then(m => m.VenteListComponent)
  }
];
