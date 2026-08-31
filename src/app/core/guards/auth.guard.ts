// src/app/core/guards/auth.guard.ts

import { inject }        from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService }   from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirection simple SANS returnUrl — c'est le returnUrl qui crée la boucle
  router.navigate(['/login']);
  return false;
};