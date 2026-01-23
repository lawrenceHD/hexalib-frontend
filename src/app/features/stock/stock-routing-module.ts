import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MouvementListComponent } from './components/mouvement-list/mouvement-list';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MouvementListComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }