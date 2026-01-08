import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor() { }

  // Sauvegarder le token
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Supprimer le token
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Sauvegarder l'utilisateur
  saveUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Récupérer l'utilisateur
  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Supprimer l'utilisateur
  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Nettoyer tout
  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}