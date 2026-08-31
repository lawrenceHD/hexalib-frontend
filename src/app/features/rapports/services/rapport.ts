import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  DashboardAdminDTO,
  DashboardVendeurDTO,
  RapportJournalierDTO,
  RapportPeriodiqueDTO
} from '../models/rapport.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class RapportService {

  private readonly baseUrl = `${environment.apiUrl}/rapports`;

  constructor(private http: HttpClient) {}

  // ── DASHBOARDS ──────────────────────────────────────────────────────────────

  getDashboardAdmin(): Observable<DashboardAdminDTO> {
    return this.http
      .get<ApiResponse<DashboardAdminDTO>>(`${this.baseUrl}/dashboard/admin`)
      .pipe(map(r => r.data));
  }

  getDashboardVendeur(): Observable<DashboardVendeurDTO> {
    return this.http
      .get<ApiResponse<DashboardVendeurDTO>>(`${this.baseUrl}/dashboard/vendeur`)
      .pipe(map(r => r.data));
  }

  // ── RAPPORT JOURNALIER ───────────────────────────────────────────────────────

  getRapportJournalier(date?: string): Observable<RapportJournalierDTO> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http
      .get<ApiResponse<RapportJournalierDTO>>(`${this.baseUrl}/cloture-journaliere`, { params })
      .pipe(map(r => r.data));
  }

  downloadRapportJournalierPDF(date?: string): Observable<Blob> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http.get(`${this.baseUrl}/cloture-journaliere/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  // ── RAPPORTS PÉRIODIQUES ────────────────────────────────────────────────────

  getRapportHebdomadaire(dateFin?: string): Observable<RapportPeriodiqueDTO> {
    let params = new HttpParams();
    if (dateFin) params = params.set('dateFin', dateFin);
    return this.http
      .get<ApiResponse<RapportPeriodiqueDTO>>(`${this.baseUrl}/hebdomadaire`, { params })
      .pipe(map(r => r.data));
  }

  downloadRapportHebdomadairePDF(dateFin?: string): Observable<Blob> {
    let params = new HttpParams();
    if (dateFin) params = params.set('dateFin', dateFin);
    return this.http.get(`${this.baseUrl}/hebdomadaire/pdf`, { params, responseType: 'blob' });
  }

  getRapportMensuel(date?: string): Observable<RapportPeriodiqueDTO> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http
      .get<ApiResponse<RapportPeriodiqueDTO>>(`${this.baseUrl}/mensuel`, { params })
      .pipe(map(r => r.data));
  }

  downloadRapportMensuelPDF(date?: string): Observable<Blob> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http.get(`${this.baseUrl}/mensuel/pdf`, { params, responseType: 'blob' });
  }

  getRapportAnnuel(annee?: number): Observable<RapportPeriodiqueDTO> {
    let params = new HttpParams();
    if (annee) params = params.set('annee', annee.toString());
    return this.http
      .get<ApiResponse<RapportPeriodiqueDTO>>(`${this.baseUrl}/annuel`, { params })
      .pipe(map(r => r.data));
  }

  downloadRapportAnnuelPDF(annee?: number): Observable<Blob> {
    let params = new HttpParams();
    if (annee) params = params.set('annee', annee.toString());
    return this.http.get(`${this.baseUrl}/annuel/pdf`, { params, responseType: 'blob' });
  }

  getRapportPersonnalise(dateDebut: string, dateFin: string): Observable<RapportPeriodiqueDTO> {
    const params = new HttpParams().set('dateDebut', dateDebut).set('dateFin', dateFin);
    return this.http
      .get<ApiResponse<RapportPeriodiqueDTO>>(`${this.baseUrl}/personnalise`, { params })
      .pipe(map(r => r.data));
  }

  downloadRapportPersonnalisePDF(dateDebut: string, dateFin: string): Observable<Blob> {
    const params = new HttpParams().set('dateDebut', dateDebut).set('dateFin', dateFin);
    return this.http.get(`${this.baseUrl}/personnalise/pdf`, { params, responseType: 'blob' });
  }

  // ── UTILITAIRE ───────────────────────────────────────────────────────────────

  triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}