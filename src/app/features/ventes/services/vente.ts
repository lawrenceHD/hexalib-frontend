import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  VenteRequest,
  VenteResponse,
  VendeurStatsResponse,
  GlobalStatsResponse
} from '../models/vente.model';

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
export class VenteService {
  private apiUrl = `${environment.apiUrl}/ventes`;

  constructor(private http: HttpClient) {}

  /**
   * Créer une nouvelle vente
   */
  create(request: VenteRequest): Observable<ApiResponse<VenteResponse>> {
    return this.http.post<ApiResponse<VenteResponse>>(this.apiUrl, request);
  }

  /**
   * Récupérer toutes les ventes (paginées)
   */
  getAll(page = 0, size = 20): Observable<ApiResponse<PageResponse<VenteResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<VenteResponse>>>(this.apiUrl, { params });
  }

  /**
   * Récupérer une vente par ID
   */
  getById(id: string): Observable<ApiResponse<VenteResponse>> {
    return this.http.get<ApiResponse<VenteResponse>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Rechercher des ventes
   */
  search(query: string, page = 0, size = 20): Observable<ApiResponse<PageResponse<VenteResponse>>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<VenteResponse>>>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Récupérer les ventes du vendeur connecté
   */
  getMesVentes(page = 0, size = 20): Observable<ApiResponse<PageResponse<VenteResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<VenteResponse>>>(`${this.apiUrl}/mes-ventes`, { params });
  }

  /**
   * Annuler une vente (Admin uniquement)
   */
  annuler(id: string, motif: string): Observable<ApiResponse<VenteResponse>> {
    const params = new HttpParams().set('motif', motif);
    return this.http.post<ApiResponse<VenteResponse>>(`${this.apiUrl}/${id}/annuler`, null, { params });
  }

  /**
   * Télécharger la facture PDF
   */
  getFacturePDF(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/facture`, {
      responseType: 'blob'
    });
  }

  /**
   * Statistiques vendeur
   */
  getStatsVendeur(vendeurId: string): Observable<ApiResponse<VendeurStatsResponse>> {
    return this.http.get<ApiResponse<VendeurStatsResponse>>(`${this.apiUrl}/stats/vendeur/${vendeurId}`);
  }

  /**
   * Statistiques du jour
   */
  getStatsJour(date?: string): Observable<ApiResponse<GlobalStatsResponse>> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<ApiResponse<GlobalStatsResponse>>(`${this.apiUrl}/stats/jour`, { params });
  }
}