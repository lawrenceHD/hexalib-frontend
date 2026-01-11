// src/app/features/commandes/services/commande.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CommandeFournisseur, CommandeFournisseurRequest, PageResponse } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = `${environment.apiUrl}/commandes`;

  constructor(private http: HttpClient) { }

  // Créer une commande
  createCommande(data: CommandeFournisseurRequest): Observable<ApiResponse<CommandeFournisseur>> {
    return this.http.post<ApiResponse<CommandeFournisseur>>(this.apiUrl, data);
  }

  // Récupérer toutes les commandes avec pagination et filtres
  getAllCommandes(
    page: number = 0,
    size: number = 20,
    search?: string,
    fournisseurId?: string,
    statut?: string,
    dateDebut?: string,
    dateFin?: string
  ): Observable<ApiResponse<PageResponse<CommandeFournisseur>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (fournisseurId) {
      params = params.set('fournisseurId', fournisseurId);
    }
    if (statut) {
      params = params.set('statut', statut);
    }
    if (dateDebut) {
      params = params.set('dateDebut', dateDebut);
    }
    if (dateFin) {
      params = params.set('dateFin', dateFin);
    }

    return this.http.get<ApiResponse<PageResponse<CommandeFournisseur>>>(this.apiUrl, { params });
  }

  // Récupérer une commande par ID
  getCommandeById(id: string): Observable<ApiResponse<CommandeFournisseur>> {
    return this.http.get<ApiResponse<CommandeFournisseur>>(`${this.apiUrl}/${id}`);
  }

  // Modifier une commande
  updateCommande(id: string, data: CommandeFournisseurRequest): Observable<ApiResponse<CommandeFournisseur>> {
    return this.http.put<ApiResponse<CommandeFournisseur>>(`${this.apiUrl}/${id}`, data);
  }

  // Supprimer une commande
  deleteCommande(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Recevoir une commande
  recevoirCommande(id: string, dateReception: string): Observable<ApiResponse<CommandeFournisseur>> {
    return this.http.post<ApiResponse<CommandeFournisseur>>(
      `${this.apiUrl}/${id}/recevoir?dateReception=${dateReception}`,
      {}
    );
  }

  // Annuler une commande
  annulerCommande(id: string, motif?: string): Observable<ApiResponse<CommandeFournisseur>> {
    let params = new HttpParams();
    if (motif) {
      params = params.set('motif', motif);
    }
    return this.http.post<ApiResponse<CommandeFournisseur>>(
      `${this.apiUrl}/${id}/annuler`,
      {},
      { params }
    );
  }

  // Télécharger le PDF
  downloadPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }

  // Obtenir l'URL de prévisualisation du PDF
  getPdfPreviewUrl(id: string): string {
    return `${this.apiUrl}/${id}/pdf/preview`;
  }
}