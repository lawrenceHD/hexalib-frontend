// src/app/core/guards/role-guard.ts

import { inject }      from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService   = inject(AuthService);
  const router        = inject(Router);
  const allowedRoles: string[] = route.data?.['roles'] ?? [];
  const userRole = authService.currentUserValue?.role;

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};