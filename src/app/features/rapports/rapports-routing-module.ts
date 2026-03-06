import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RapportDashboard }  from './components/rapport-dashboard/rapport-dashboard';
import { RapportSelector }   from './components/rapport-selector/rapport-selector';

export const RAPPORTS_ROUTES: Routes = [
  { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: RapportDashboard },
  { path: 'generer',   component: RapportSelector }
];

@NgModule({
  imports: [RouterModule.forChild(RAPPORTS_ROUTES)],
  exports: [RouterModule]
})
export class RapportsRoutingModule {}