import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../services/token';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue';

      if (error.status === 0) {
        // Erreur réseau
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      } else if (error.status === 401) {
        // Non autorisé
        errorMessage = error.error?.message || 'Email ou mot de passe incorrect';
        
        // Si ce n'est pas la route de login, déconnecter
        if (!req.url.includes('/auth/login')) {
          tokenService.clear();
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        // Interdit
        errorMessage = error.error?.message || 'Accès refusé';
      } else if (error.status === 404) {
        // Non trouvé
        errorMessage = error.error?.message || 'Ressource non trouvée';
      } else if (error.status === 500) {
        // Erreur serveur
        errorMessage = error.error?.message || 'Erreur interne du serveur';
      } else if (error.error?.message) {
        // Message du backend
        errorMessage = error.error.message;
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        error: error.error
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};