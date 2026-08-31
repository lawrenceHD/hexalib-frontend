// src/app/core/services/auth.ts

import { Injectable }  from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Router }      from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError }  from 'rxjs/operators';
import { environment }      from '../../../environments/environment';
import { User }             from '../models/user.model';
import { ApiResponse, LoginRequest, LoginResponse, RefreshTokenRequest } from '../models/auth.model';

const ACCESS_TOKEN_KEY  = 'hexalib_access_token';
const REFRESH_TOKEN_KEY = 'hexalib_refresh_token';
const USER_KEY          = 'hexalib_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  private isRefreshing = false;

  constructor(
    private http:   HttpClient,
    private router: Router
  ) {}

  // ── Getters ───────────────────────────────────────────────────────────────

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Vérifie que les DEUX conditions sont réunies : token ET user en mémoire.
   * Si l'une manque, on nettoie pour éviter un état incohérent.
   */
  isAuthenticated(): boolean {
    const token = this.accessToken;
    const user  = this.currentUserValue;

    if (token && user) return true;

    // État incohérent → nettoyer silencieusement
    if (token || user) {
      this.clearSession();
    }
    return false;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'ADMIN';
  }

  isVendeur(): boolean {
    return this.currentUserValue?.role === 'VENDEUR';
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    // Nettoyer l'ancienne session avant toute nouvelle connexion
    this.clearSession();

    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/login`, credentials
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.storeSession(response.data);
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  logout(): void {
    const token = this.accessToken;

    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        error: () => {}
      });
    }

    this.clearSession();
    this.router.navigate(['/login']);
  }

  // ── Refresh Token ─────────────────────────────────────────────────────────

  refreshAccessToken(): Observable<ApiResponse<LoginResponse>> {
    const refreshToken = this.refreshToken;

    if (!refreshToken) {
      this.clearSession();
      this.router.navigate(['/login']);
      return throwError(() => new Error('No refresh token'));
    }

    const payload: RefreshTokenRequest = { refreshToken };

    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/refresh-token`, payload
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.storeSession(response.data);
        }
      }),
      catchError(err => {
        this.clearSession();
        this.router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  // ── Session storage ───────────────────────────────────────────────────────

  private storeSession(data: LoginResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY,  data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    this.currentUserSubject.next(data.user);
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  get isRefreshingToken(): boolean  { return this.isRefreshing; }
  set isRefreshingToken(v: boolean) { this.isRefreshing = v; }
}