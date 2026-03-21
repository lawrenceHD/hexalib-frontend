import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../services/token';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router       = inject(Router);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';

      if (error.status === 401) {
        // 401 = token expiré/invalide → déconnexion + redirection SANS returnUrl
        errorMessage = error.error?.message || 'Session expirée. Veuillez vous reconnecter.';
        tokenService.clear();
        router.navigate(['/login']);
      }
      else if (error.status === 403) {
        // 403 = authentifié mais pas les droits → NE PAS déconnecter, NE PAS rediriger
        // On laisse le composant gérer l'erreur (afficher un message, etc.)
        errorMessage = error.error?.message || 'Accès refusé. Permissions insuffisantes.';
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
        url:     req.url,
        status:  error.status,
        message: errorMessage,
        detail:  error.error
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};