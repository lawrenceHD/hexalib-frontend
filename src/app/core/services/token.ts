import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  // ⚠️ Ces clés DOIVENT correspondre exactement à celles utilisées dans AuthService
  private readonly TOKEN_KEY   = 'hexalib_access_token';
  private readonly REFRESH_KEY = 'hexalib_refresh_token';
  private readonly USER_KEY    = 'hexalib_user';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  saveRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_KEY, token);
  }

  getUser(): any {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  saveUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}