// src/app/core/interceptors/auth.interceptor.ts

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth';

const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  const publicUrls = ['/api/auth/login', '/api/auth/refresh-token', '/api/auth/register'];
  if (publicUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  const token = authService.accessToken;
  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      // 401 → tenter un refresh token
      if (error.status === 401 && !req.url.includes('/api/auth/logout')) {
        return handle401(req, next, authService);
      }

      // 403 → permission insuffisante, on NE redirige PAS vers /login
      // On laisse le composant gérer l'erreur lui-même
      if (error.status === 403) {
        return throwError(() => ({
          status:  403,
          message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'
        }));
      }

      return throwError(() => formatError(error));
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}

function handle401(
  req:         HttpRequest<unknown>,
  next:        HttpHandlerFn,
  authService: AuthService
): Observable<any> {
  if (authService.isRefreshingToken) {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addToken(req, token!)))
    );
  }

  authService.isRefreshingToken = true;
  refreshTokenSubject.next(null);

  return authService.refreshAccessToken().pipe(
    switchMap(response => {
      authService.isRefreshingToken = false;
      const newToken = response.data.accessToken;
      refreshTokenSubject.next(newToken);
      return next(addToken(req, newToken));
    }),
    catchError(err => {
      authService.isRefreshingToken = false;
      // Refresh échoué → déconnexion propre
      authService.clearSession();
      return throwError(() => err);
    })
  );
}

function formatError(error: HttpErrorResponse): { status: number; message: string; detail?: any } {
  if (error.error?.message) {
    return { status: error.status, message: error.error.message, detail: error.error };
  }
  if (error.status === 0) {
    return { status: 0, message: 'Impossible de joindre le serveur.', detail: error };
  }
  return { status: error.status, message: error.message, detail: error };
}