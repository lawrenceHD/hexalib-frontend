import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Reduction, ReductionRequest } from '../models/reduction.model';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class ReductionService {
  private apiUrl = `${environment.apiUrl}/reductions`;

  constructor(private http: HttpClient) {}

  create(request: ReductionRequest): Observable<ApiResponse<Reduction>> {
    return this.http.post<ApiResponse<Reduction>>(this.apiUrl, request);
  }

  getAll(page = 0, size = 20): Observable<ApiResponse<PageResponse<Reduction>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<Reduction>>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<Reduction>> {
    return this.http.get<ApiResponse<Reduction>>(`${this.apiUrl}/${id}`);
  }

  search(intitule: string, page = 0, size = 20): Observable<ApiResponse<PageResponse<Reduction>>> {
    const params = new HttpParams()
      .set('intitule', intitule)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<Reduction>>>(`${this.apiUrl}/search`, { params });
  }

  getActives(page = 0, size = 20): Observable<ApiResponse<PageResponse<Reduction>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<Reduction>>>(`${this.apiUrl}/actives`, { params });
  }

  getValides(): Observable<ApiResponse<Reduction[]>> {
    return this.http.get<ApiResponse<Reduction[]>>(`${this.apiUrl}/valides`);
  }

  update(id: string, request: ReductionRequest): Observable<ApiResponse<Reduction>> {
    return this.http.put<ApiResponse<Reduction>>(`${this.apiUrl}/${id}`, request);
  }

  toggleActif(id: string): Observable<ApiResponse<Reduction>> {
    return this.http.patch<ApiResponse<Reduction>>(`${this.apiUrl}/${id}/toggle`, {});
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getBestForLivre(livreId: string): Observable<ApiResponse<Reduction | null>> {
    const params = new HttpParams().set('livreId', livreId);
    return this.http.get<ApiResponse<Reduction | null>>(`${this.apiUrl}/livre/${livreId}/meilleure`, { params });
  }
}