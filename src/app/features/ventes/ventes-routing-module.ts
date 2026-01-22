import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PointVenteComponent } from './components/point-vente/point-vente';
import { VenteListComponent } from './components/vente-list/vente-list';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'point-vente',
    pathMatch: 'full'
  },
  {
    path: 'point-vente',
    component: PointVenteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'liste',
    component: VenteListComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentesRoutingModule { }