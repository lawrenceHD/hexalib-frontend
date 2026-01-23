import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  MouvementStockRequest,
  MouvementStockResponse,
  TypeMouvement
} from '../models/mouvement-stock.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class MouvementStockService {
  private apiUrl = `${environment.apiUrl}/mouvements`;

  constructor(private http: HttpClient) {}

  /**
   * Créer un mouvement de stock manuel (Admin uniquement)
   */
  create(request: MouvementStockRequest): Observable<ApiResponse<MouvementStockResponse>> {
    return this.http.post<ApiResponse<MouvementStockResponse>>(this.apiUrl, request);
  }

  /**
   * Récupérer tous les mouvements (paginés)
   */
  getAll(page = 0, size = 20): Observable<ApiResponse<PageResponse<MouvementStockResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<MouvementStockResponse>>>(this.apiUrl, { params });
  }

  /**
   * Récupérer les mouvements d'un livre
   */
  getByLivre(livreId: string, page = 0, size = 20): Observable<ApiResponse<PageResponse<MouvementStockResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<MouvementStockResponse>>>(`${this.apiUrl}/livre/${livreId}`, { params });
  }

  /**
   * Récupérer l'historique complet d'un livre
   */
  getHistoriqueLivre(livreId: string): Observable<ApiResponse<MouvementStockResponse[]>> {
    return this.http.get<ApiResponse<MouvementStockResponse[]>>(`${this.apiUrl}/livre/${livreId}/historique`);
  }

  /**
   * Récupérer les mouvements par type
   */
  getByType(type: TypeMouvement, page = 0, size = 20): Observable<ApiResponse<PageResponse<MouvementStockResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<MouvementStockResponse>>>(`${this.apiUrl}/type/${type}`, { params });
  }

  /**
   * Recherche avec filtres
   */
  search(
    livreId?: string,
    type?: TypeMouvement,
    userId?: string,
    debut?: string,
    fin?: string,
    page = 0,
    size = 20
  ): Observable<ApiResponse<PageResponse<MouvementStockResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (livreId) params = params.set('livreId', livreId);
    if (type) params = params.set('type', type);
    if (userId) params = params.set('userId', userId);
    if (debut) params = params.set('debut', debut);
    if (fin) params = params.set('fin', fin);

    return this.http.get<ApiResponse<PageResponse<MouvementStockResponse>>>(`${this.apiUrl}/search`, { params });
  }
}