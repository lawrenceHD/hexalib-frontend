// src/app/features/utilisateurs/services/user.service.ts

import { Injectable }    from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable }    from 'rxjs';
import { environment }   from '../../../../environments/environment';
import {
  User, UserPage, UserStats,
  CreateUserPayload, UpdateUserPayload
} from '../../../core/models/user.model';
import { ApiResponse }   from '../../../core/models/auth.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(params: {
    page?:    number;
    size?:    number;
    search?:  string;
    role?:    string;
    statut?:  string;
  }): Observable<ApiResponse<UserPage>> {
    let p = new HttpParams()
      .set('page',  String(params.page  ?? 0))
      .set('size',  String(params.size  ?? 10));

    if (params.search) p = p.set('search', params.search);
    if (params.role)   p = p.set('role',   params.role);
    if (params.statut) p = p.set('statut', params.statut);

    return this.http.get<ApiResponse<UserPage>>(this.api, { params: p });
  }

  getUser(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.api}/${id}`);
  }

  createUser(payload: CreateUserPayload): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.api, payload);
  }

  updateUser(id: string, payload: UpdateUserPayload): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.api}/${id}`, payload);
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${id}`);
  }

  toggleStatut(id: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.api}/${id}/toggle-statut`, {});
  }

  resetPassword(id: string): Observable<ApiResponse<{ temporaryPassword: string }>> {
    return this.http.post<ApiResponse<{ temporaryPassword: string }>>(
      `${this.api}/${id}/reset-password`, {}
    );
  }

  getUserStats(id: string): Observable<ApiResponse<UserStats>> {
    return this.http.get<ApiResponse<UserStats>>(`${this.api}/${id}/stats`);
  }

  updateProfil(payload: { nomComplet: string; email: string }): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.api}/profil`, payload);
  }

  changePassword(payload: {
    ancienMotDePasse:  string;
    nouveauMotDePasse: string;
  }): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.api}/change-password`, payload);
  }
}