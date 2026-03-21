// src/app/features/livres/services/livre.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Livre, LivreRequest, PageResponse } from '../models/livre.model';
import { ImportResultResponse } from '../models/livre.model';

@Injectable({
  providedIn: 'root'
})
export class LivreService {
  private apiUrl = `${environment.apiUrl}/livres`;

  constructor(private http: HttpClient) { }

  // Créer un livre
  createLivre(data: LivreRequest): Observable<ApiResponse<Livre>> {
    return this.http.post<ApiResponse<Livre>>(this.apiUrl, data);
  }

  // Récupérer tous les livres avec pagination et filtres
  getAllLivres(
    page: number = 0, 
    size: number = 20, 
    search?: string,
    categorieId?: string,
    statut?: string,
    langue?: string
  ): Observable<ApiResponse<PageResponse<Livre>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    if (categorieId) {
      params = params.set('categorieId', categorieId);
    }
    if (statut) {
      params = params.set('statut', statut);
    }
    if (langue) {
      params = params.set('langue', langue);
    }

    return this.http.get<ApiResponse<PageResponse<Livre>>>(this.apiUrl, { params });
  }

  // Livres en stock critique
  getLivresStockCritique(): Observable<ApiResponse<Livre[]>> {
    return this.http.get<ApiResponse<Livre[]>>(`${this.apiUrl}/stock-critique`);
  }

  // Livres en rupture
  getLivresEnRupture(): Observable<ApiResponse<Livre[]>> {
    return this.http.get<ApiResponse<Livre[]>>(`${this.apiUrl}/rupture`);
  }

  // Liste des langues disponibles
  getAllLangues(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/langues`);
  }

  // Récupérer un livre par ID
  getLivreById(id: string): Observable<ApiResponse<Livre>> {
    return this.http.get<ApiResponse<Livre>>(`${this.apiUrl}/${id}`);
  }

  // Modifier un livre
  updateLivre(id: string, data: LivreRequest): Observable<ApiResponse<Livre>> {
    return this.http.put<ApiResponse<Livre>>(`${this.apiUrl}/${id}`, data);
  }

  // Supprimer un livre
  deleteLivre(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Activer/Désactiver un livre
  toggleStatut(id: string): Observable<ApiResponse<Livre>> {
    return this.http.patch<ApiResponse<Livre>>(`${this.apiUrl}/${id}/toggle-statut`, {});
  }

  // Ajuster le stock
  ajusterStock(id: string, quantite: number, motif?: string): Observable<ApiResponse<Livre>> {
    let params = new HttpParams().set('quantite', quantite.toString());
    if (motif) {
      params = params.set('motif', motif);
    }
    return this.http.patch<ApiResponse<Livre>>(`${this.apiUrl}/${id}/ajuster-stock`, {}, { params });
  }

  // ── Importer des livres depuis Excel ──
importLivres(file: File, categorieId: string): Observable<ApiResponse<ImportResultResponse>> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('categorieId', categorieId);
  return this.http.post<ApiResponse<ImportResultResponse>>(`${this.apiUrl}/import`, formData);
}
 
// ── Exporter l'inventaire en Excel ──
exportLivres(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
}
}