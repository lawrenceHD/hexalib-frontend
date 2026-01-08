import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Categorie, CategorieRequest, PageResponse } from '../../../core/models/categorie.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  // Créer une catégorie
  createCategorie(data: CategorieRequest): Observable<ApiResponse<Categorie>> {
    return this.http.post<ApiResponse<Categorie>>(this.apiUrl, data);
  }

  // Récupérer toutes les catégories avec pagination
  getAllCategories(page: number = 0, size: number = 20, search?: string): Observable<ApiResponse<PageResponse<Categorie>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<PageResponse<Categorie>>>(this.apiUrl, { params });
  }

  // Récupérer toutes les catégories actives (sans pagination)
  getAllCategoriesActives(): Observable<ApiResponse<Categorie[]>> {
    return this.http.get<ApiResponse<Categorie[]>>(`${this.apiUrl}/actives`);
  }

  // Récupérer une catégorie par ID
  getCategorieById(id: string): Observable<ApiResponse<Categorie>> {
    return this.http.get<ApiResponse<Categorie>>(`${this.apiUrl}/${id}`);
  }

  // Modifier une catégorie
  updateCategorie(id: string, data: CategorieRequest): Observable<ApiResponse<Categorie>> {
    return this.http.put<ApiResponse<Categorie>>(`${this.apiUrl}/${id}`, data);
  }

  // Supprimer une catégorie
  deleteCategorie(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Activer/Désactiver une catégorie
  toggleStatut(id: string): Observable<ApiResponse<Categorie>> {
    return this.http.patch<ApiResponse<Categorie>>(`${this.apiUrl}/${id}/toggle-statut`, {});
  }
}