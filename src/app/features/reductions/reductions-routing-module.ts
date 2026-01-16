import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReductionListComponent } from './components/reduction-list/reduction-list';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ReductionListComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReductionsRoutingModule { }