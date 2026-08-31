import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategorieDepenseRequest, CategorieDepenseResponse } from '../models/comptabilite.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class CategorieDepenseService {
  private apiUrl = `${environment.apiUrl}/comptabilite/categories-depenses`;

  constructor(private http: HttpClient) {}

  create(request: CategorieDepenseRequest): Observable<ApiResponse<CategorieDepenseResponse>> {
    return this.http.post<ApiResponse<CategorieDepenseResponse>>(this.apiUrl, request);
  }

  getAll(): Observable<ApiResponse<CategorieDepenseResponse[]>> {
    return this.http.get<ApiResponse<CategorieDepenseResponse[]>>(this.apiUrl);
  }

  getAllActives(): Observable<ApiResponse<CategorieDepenseResponse[]>> {
    return this.http.get<ApiResponse<CategorieDepenseResponse[]>>(`${this.apiUrl}/actives`);
  }

  update(id: string, request: CategorieDepenseRequest): Observable<ApiResponse<CategorieDepenseResponse>> {
    return this.http.put<ApiResponse<CategorieDepenseResponse>>(`${this.apiUrl}/${id}`, request);
  }

  toggleStatut(id: string): Observable<ApiResponse<CategorieDepenseResponse>> {
    return this.http.patch<ApiResponse<CategorieDepenseResponse>>(`${this.apiUrl}/${id}/toggle-statut`, {});
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}