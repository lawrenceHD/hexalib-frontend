// ════════════════════════════════════════════════════
// comptabilite-routing-module.ts
// ════════════════════════════════════════════════════
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComptaComponent } from './components/dashboard-compta/dashboard-compta';
import { DepenseListComponent } from './components/depense-list/depense-list';
import { CategorieDepenseListComponent } from './components/categorie-depense-list/categorie-depense-list';
import { RapportVentesComponent } from './components/rapport-ventes/rapport-ventes';
import { RapportCompteResultatComponent } from './components/rapport-compte-resultat/rapport-compte-resultat';
import { RapportTresorerieComponent } from './components/rapport-tresorerie/rapport-tresorerie';
import { RapportStockValoriseComponent } from './components/rapport-stock-valorise/rapport-stock-valorise';
import { authGuard } from '../../core/guards/auth.guard';
 
const routes: Routes = [
  { path: '',                  redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',         component: DashboardComptaComponent,       canActivate: [authGuard] },
  { path: 'depenses',          component: DepenseListComponent,            canActivate: [authGuard] },
  { path: 'categories',        component: CategorieDepenseListComponent,   canActivate: [authGuard] },
  { path: 'rapport-ventes',    component: RapportVentesComponent,          canActivate: [authGuard] },
  { path: 'compte-resultat',   component: RapportCompteResultatComponent,  canActivate: [authGuard] },
  { path: 'tresorerie',        component: RapportTresorerieComponent,      canActivate: [authGuard] },
  { path: 'stock-valorise',    component: RapportStockValoriseComponent,   canActivate: [authGuard] },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptabiliteRoutingModule {}