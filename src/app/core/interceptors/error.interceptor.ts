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
      let errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';

      // Gestion des erreurs critiques d'auth
      if (error.status === 401 || error.status === 403) {
        errorMessage = error.error?.message || 'Session expirée ou accès refusé.';

        // Déconnexion immédiate + redirection
        tokenService.clear();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url }  // Pour revenir où on était
        });
      } 
      else if (error.status === 400) {
        errorMessage = error.error?.message || 'Données invalides.';
        if (error.error?.data) {
          const details = Object.entries(error.error.data)
            .map(([field, msg]) => `• ${field}: ${msg}`)
            .join('\n');
          errorMessage += `\n\nDétails:\n${details}`;
        }
      } 
      else if (error.status === 404) {
        errorMessage = 'Ressource non trouvée.';
      } 
      else if (error.status === 500) {
        errorMessage = 'Erreur interne du serveur. Contactez un administrateur.';
      } 
      else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      console.error('Erreur HTTP interceptée :', {
        url: req.url,
        status: error.status,
        message: errorMessage,
        detail: error.error
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};