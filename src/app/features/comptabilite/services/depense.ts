import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DepenseRequest, DepenseResponse, PageResponse } from '../models/comptabilite.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class DepenseService {
  private apiUrl = `${environment.apiUrl}/comptabilite/depenses`;

  constructor(private http: HttpClient) {}

  create(request: DepenseRequest): Observable<ApiResponse<DepenseResponse>> {
    return this.http.post<ApiResponse<DepenseResponse>>(this.apiUrl, request);
  }

  getAll(
    page = 0, size = 20,
    categorieId?: string,
    debut?: string,
    fin?: string
  ): Observable<ApiResponse<PageResponse<DepenseResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (categorieId) params = params.set('categorieId', categorieId);
    if (debut)       params = params.set('debut', debut);
    if (fin)         params = params.set('fin', fin);
    return this.http.get<ApiResponse<PageResponse<DepenseResponse>>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<DepenseResponse>> {
    return this.http.get<ApiResponse<DepenseResponse>>(`${this.apiUrl}/${id}`);
  }

  update(id: string, request: DepenseRequest): Observable<ApiResponse<DepenseResponse>> {
    return this.http.put<ApiResponse<DepenseResponse>>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}