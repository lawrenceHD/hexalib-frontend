import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { CategorieListComponent } from './features/categories/components/categorie-list/categorie-list';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: CategorieListComponent }
    ]
  },
   {
    path: 'livres',
    loadComponent: () => import('./features/livres/components/livre-list/livre-list').then(m => m.LivreListComponent),
    canActivate: [authGuard]
  },
  
  { path: '**', redirectTo: '/login' }
];