import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
//import { TokenService } from './token.service';
import { TokenService } from './token';
import {jwtDecode} from 'jwt-decode';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest 
} from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const user = this.tokenService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  isAuthenticated(): boolean {
  const token = this.tokenService.getToken();
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Temps actuel en secondes

    if (decoded.exp < currentTime) {
      console.warn('Token expiré');
      this.logout(); // Déconnexion immédiate
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token invalide ou malformé', error);
    this.logout();
    return false;
  }
}

  // Login
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/login`, 
      credentials
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.tokenService.saveToken(response.data.token);
          this.tokenService.saveUser(response.data.user);
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  // Register (Admin uniquement)
  register(data: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.apiUrl}/register`, 
      data
    );
  }

  // Récupérer l'utilisateur connecté
  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.tokenService.saveUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  // Logout
  logout(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  // Récupérer l'utilisateur actuel (synchrone)
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'ADMIN';
  }

  // Vérifier si l'utilisateur est vendeur
  isVendeur(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'VENDEUR';
  }
}