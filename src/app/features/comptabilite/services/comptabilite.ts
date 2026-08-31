import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  DashboardComptaDTO,
  RapportVentesDTO,
  RapportCompteResultatDTO,
  RapportTresorerieDTO,
  RapportStockValoriseDTO,
  TypeRapportVentes
} from '../models/comptabilite.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ComptabiliteService {
  private apiUrl = `${environment.apiUrl}/comptabilite`;

  constructor(private http: HttpClient) {}

  // ── Dashboard ──────────────────────────────────────────

  getDashboard(debut?: string, fin?: string): Observable<ApiResponse<DashboardComptaDTO>> {
    let params = new HttpParams();
    if (debut) params = params.set('debut', debut);
    if (fin)   params = params.set('fin', fin);
    return this.http.get<ApiResponse<DashboardComptaDTO>>(`${this.apiUrl}/dashboard`, { params });
  }

  // ── Rapports Ventes ────────────────────────────────────

  getRapportVentes(
    debut: string,
    fin: string,
    typeRapport: TypeRapportVentes = 'COMBINE'
  ): Observable<ApiResponse<RapportVentesDTO>> {
    const params = new HttpParams()
      .set('debut', debut)
      .set('fin', fin)
      .set('typeRapport', typeRapport);
    return this.http.get<ApiResponse<RapportVentesDTO>>(
      `${this.apiUrl}/rapports/ventes`, { params });
  }

  // ── Rapports Financiers ────────────────────────────────

  getCompteResultat(debut: string, fin: string): Observable<ApiResponse<RapportCompteResultatDTO>> {
    const params = new HttpParams().set('debut', debut).set('fin', fin);
    return this.http.get<ApiResponse<RapportCompteResultatDTO>>(
      `${this.apiUrl}/rapports/compte-resultat`, { params });
  }

  getTresorerie(debut: string, fin: string): Observable<ApiResponse<RapportTresorerieDTO>> {
    const params = new HttpParams().set('debut', debut).set('fin', fin);
    return this.http.get<ApiResponse<RapportTresorerieDTO>>(
      `${this.apiUrl}/rapports/tresorerie`, { params });
  }

  getStockValorise(): Observable<ApiResponse<RapportStockValoriseDTO>> {
    return this.http.get<ApiResponse<RapportStockValoriseDTO>>(
      `${this.apiUrl}/rapports/stock-valorise`);
  }
}