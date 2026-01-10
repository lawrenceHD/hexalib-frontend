// src/app/features/fournisseurs/services/fournisseur.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Fournisseur, FournisseurRequest, PageResponse } from '../models/fournisseur.model';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiUrl = `${environment.apiUrl}/fournisseurs`;

  constructor(private http: HttpClient) { }

  // Créer un fournisseur
  createFournisseur(data: FournisseurRequest): Observable<ApiResponse<Fournisseur>> {
    return this.http.post<ApiResponse<Fournisseur>>(this.apiUrl, data);
  }

  // Récupérer tous les fournisseurs avec pagination et filtres
  getAllFournisseurs(
    page: number = 0, 
    size: number = 20, 
    search?: string,
    statut?: string
  ): Observable<ApiResponse<PageResponse<Fournisseur>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    if (statut) {
      params = params.set('statut', statut);
    }

    return this.http.get<ApiResponse<PageResponse<Fournisseur>>>(this.apiUrl, { params });
  }

  // Fournisseurs actifs (sans pagination)
  getAllFournisseursActifs(): Observable<ApiResponse<Fournisseur[]>> {
    return this.http.get<ApiResponse<Fournisseur[]>>(`${this.apiUrl}/actifs`);
  }

  // Récupérer un fournisseur par ID
  getFournisseurById(id: string): Observable<ApiResponse<Fournisseur>> {
    return this.http.get<ApiResponse<Fournisseur>>(`${this.apiUrl}/${id}`);
  }

  // Modifier un fournisseur
  updateFournisseur(id: string, data: FournisseurRequest): Observable<ApiResponse<Fournisseur>> {
    return this.http.put<ApiResponse<Fournisseur>>(`${this.apiUrl}/${id}`, data);
  }

  // Supprimer un fournisseur
  deleteFournisseur(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Activer/Désactiver un fournisseur
  toggleStatut(id: string): Observable<ApiResponse<Fournisseur>> {
    return this.http.patch<ApiResponse<Fournisseur>>(`${this.apiUrl}/${id}/toggle-statut`, {});
  }
}