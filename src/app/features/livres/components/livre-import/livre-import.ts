import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';

// ── Interfaces ────────────────────────────────────────────────────────

interface ImportJobStarted {
  jobId: string;
  totalLignes: number;
  totalBatches: number;
  batchSize: number;
}

interface LigneErreur {
  numeroLigne: number;
  titre: string;
  raison: string;
}

interface ImportRapportFinal {
  totalLignesLues: number;
  livresAjoutes: number;
  livresIgnores: number;
  erreurs: LigneErreur[];
}

interface ImportBatchResult {
  jobId: string;
  batchNumero: number;
  totalBatches: number;
  traites: number;
  total: number;
  pourcentage: number;
  termine: boolean;
  rapport?: ImportRapportFinal;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

type EtatImport = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

// ── Composant ─────────────────────────────────────────────────────────

@Component({
  selector: 'app-livre-import',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="w-full">

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- ÉTAT : idle — Zone de dépôt                        -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div *ngIf="etat === 'idle'">

      <div class="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                  transition-all"
                  style="margin:5px;padding:5px"
           [class.border-blue-500]="dragActif"
           [class.bg-blue-50]="dragActif"
           [class.border-blue-300]="!dragActif"
           (click)="fileInput.click()"
           (dragover)="$event.preventDefault()"
           (dragenter)="dragActif = true"
           (dragleave)="dragActif = false"
           (drop)="surDrop($event)">

        <svg class="w-14 h-14 mx-auto text-blue-400 mb-4" fill="none"
             stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
        <p class="text-base font-semibold text-gray-700 mb-1">
          Glissez votre fichier Excel ici
        </p>
        <p class="text-sm text-gray-400 mb-4">ou cliquez pour sélectionner</p>
        <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700
                     text-xs font-medium rounded-full">.xlsx uniquement</span>

        <input #fileInput type="file" accept=".xlsx,.xls" class="hidden"
               (change)="surSelectionFichier($event)"/>
      </div>

      <!-- Règles métier -->
      <div class="mt-4 bg-gray-50 rounded-lg p-4 text-xs text-gray-500 space-y-1.5" style="margin:5px;padding:5px">
        <p class="font-medium text-gray-600 mb-2">Règles appliquées lors de l'import :</p>
        <p>• <span class="font-medium text-green-600">Prix 3 000</span>
           → 30,00 XAF (la valeur est divisée par 100)</p>
        <p>• <span class="font-medium text-orange-500">Prix 0</span>
           → livre non à vendre, statut <strong>Inactif</strong></p>
        <p>• <span class="font-medium text-gray-500">Prix "xx"</span>
           → prix inconnu, à compléter plus tard</p>
        <p>• Les catégories inexistantes sont créées automatiquement</p>
        <p>• Les doublons (même titre + auteur + catégorie) sont ignorés</p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- ÉTAT : uploading / processing — Progression        -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div *ngIf="etat === 'uploading' || etat === 'processing'"
    style="margin:5px;padding:5px"
         class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

      <div class="flex items-center gap-3 mb-6">
        <svg class="animate-spin w-6 h-6 text-blue-500 shrink-0"
             fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10"
            stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <div>
          <p class="font-semibold text-gray-800">
            {{ etat === 'uploading' ? 'Lecture du fichier…' : 'Import en cours…' }}
          </p>
          <p class="text-xs text-gray-400">Ne fermez pas cette fenêtre</p>
        </div>
      </div>

      <!-- Barre -->
      <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-3" style="margin:5px;padding:5px">
        <div class="h-3 rounded-full transition-all duration-300 ease-out"
             [style.width.%]="pourcentage"
             [class.bg-blue-500]="pourcentage < 100"
             [class.bg-green-500]="pourcentage >= 100">
        </div>
      </div>

      <div class="flex justify-between items-center text-sm mb-2" style="margin:5px;padding:5px">
        <span class="text-gray-500">{{ traites }} / {{ total }} livres</span>
        <span class="font-bold text-blue-600 text-lg">{{ pourcentage }}%</span>
      </div>

      <p class="text-xs text-gray-400 text-center">
        Lot {{ batchActuel }} / {{ totalBatches }}
        &nbsp;·&nbsp;{{ batchSize }} livres par lot
      </p>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- ÉTAT : done — Rapport final                        -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div *ngIf="etat === 'done' && rapport" class="space-y-4" style="margin:5px;padding:5px">

      <!-- Bandeau succès -->
      <div class="flex items-center gap-3 bg-green-50 border border-green-200
                  rounded-xl px-5 py-4"
                  style="margin:5px;padding:5px">
        <svg class="w-7 h-7 text-green-500 shrink-0" fill="none"
             stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <p class="font-semibold text-green-800">Import terminé avec succès</p>
          <p class="text-xs text-green-600">
            {{ rapport.totalLignesLues }} lignes traitées au total
          </p>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-3 gap-3" style="margin:5px;padding:5px">
        <div class="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <p class="text-2xl font-bold text-blue-600">{{ rapport.livresAjoutes }}</p>
          <p class="text-xs text-gray-500 mt-1">Livres ajoutés</p>
        </div>
        <div class="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <p class="text-2xl font-bold text-orange-500">{{ rapport.livresIgnores }}</p>
          <p class="text-xs text-gray-500 mt-1">Doublons ignorés</p>
        </div>
        <div class="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <p class="text-2xl font-bold text-gray-500">{{ rapport.totalLignesLues }}</p>
          <p class="text-xs text-gray-500 mt-1">Lignes lues</p>
        </div>
      </div>

      <!-- Tableau erreurs -->
      <div *ngIf="rapport.erreurs?.length"
      style="margin:5px;padding:5px"
           class="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-4 h-4 text-orange-500" fill="none"
               stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0
                 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <p class="text-sm font-medium text-orange-800">
            {{ rapport.erreurs.length }} ligne(s) ignorée(s)
          </p>
        </div>
        <div class="overflow-auto max-h-44 rounded border border-orange-100">
          <table class="w-full text-xs">
            <thead class="bg-orange-100 text-orange-700 sticky top-0">
              <tr>
                <th class="text-left px-3 py-2 w-16">Ligne</th>
                <th class="text-left px-3 py-2">Titre</th>
                <th class="text-left px-3 py-2">Raison</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of rapport.erreurs"
                  class="border-t border-orange-100 hover:bg-orange-50">
                <td class="px-3 py-1.5 font-mono text-orange-600">{{ e.numeroLigne }}</td>
                <td class="px-3 py-1.5 text-gray-700 max-w-xs truncate">{{ e.titre }}</td>
                <td class="px-3 py-1.5 text-gray-500">{{ e.raison }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bouton reset -->
      <button (click)="reinitialiser()"
      style="margin:5px;padding:5px"
      
        class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium
               rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        Importer un autre fichier
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- ÉTAT : error                                        -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div *ngIf="etat === 'error'"
    style="margin:5px;padding:5px"
         class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <svg class="w-10 h-10 mx-auto text-red-400 mb-3" fill="none"
           stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="text-red-700 font-semibold mb-1">Erreur lors de l'import</p>
      <p class="text-red-500 text-sm mb-4">{{ messageErreur }}</p>
      <button (click)="reinitialiser()"
        class="px-5 py-2 bg-red-600 text-white rounded-lg
               hover:bg-red-700 transition-all text-sm font-medium">
        Réessayer
      </button>
    </div>

  </div>
  `
})
export class LivreImportComponent {

  etat: EtatImport = 'idle';
  dragActif        = false;

  pourcentage  = 0;
  traites      = 0;
  total        = 0;
  batchActuel  = 0;
  totalBatches = 0;
  batchSize    = 50;

  rapport?: ImportRapportFinal;
  messageErreur = '';

  private readonly apiUrl = `${environment.apiUrl}/livres/import`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  // ── Événements fichier ───────────────────────────────────────────

  surSelectionFichier(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.demarrerImport(input.files[0]);
  }

  surDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActif = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.demarrerImport(file);
  }

  // ── Import ───────────────────────────────────────────────────────

  private async demarrerImport(file: File): Promise<void> {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      this.toastr.error('Utilisez un fichier .xlsx', 'Format invalide');
      return;
    }

    this.etat        = 'uploading';
    this.pourcentage = 0;
    this.traites     = 0;

    try {
      // ÉTAPE 1 — Upload + parsing
      const formData = new FormData();
      formData.append('file', file);

      const uploadResp = await this.http
        .post<ApiResponse<ImportJobStarted>>(`${this.apiUrl}/upload`, formData)
        .toPromise();

      if (!uploadResp?.success || !uploadResp.data) {
        throw new Error(uploadResp?.message ?? 'Erreur lors du parsing');
      }

      const job         = uploadResp.data;
      this.total        = job.totalLignes;
      this.totalBatches = job.totalBatches;
      this.batchSize    = job.batchSize;
      this.etat         = 'processing';

      // ÉTAPE 2 — Batches séquentiels
      for (let n = 1; n <= job.totalBatches; n++) {
        this.batchActuel = n;

        const batchResp = await this.http
          .post<ApiResponse<ImportBatchResult>>(
            `${this.apiUrl}/${job.jobId}/batch/${n}`, {})
          .toPromise();

        if (!batchResp?.success || !batchResp.data) {
          throw new Error(batchResp?.message ?? `Erreur au lot ${n}`);
        }

        const result     = batchResp.data;
        this.traites     = result.traites;
        this.pourcentage = result.pourcentage;

        if (result.termine) {
          this.rapport = result.rapport;
          this.etat    = 'done';
          this.toastr.success(
            `${result.rapport?.livresAjoutes ?? 0} livres importés`,
            'Import terminé'
          );
          return;
        }

        await this.pause(30);
      }

    } catch (err: any) {
      this.etat          = 'error';
      this.messageErreur = err?.error?.error?.message
        ?? err?.error?.message
        ?? err?.message
        ?? 'Une erreur inattendue est survenue';
      this.toastr.error(this.messageErreur, "Erreur d'import");
    }
  }

  // ── Reset ────────────────────────────────────────────────────────

  reinitialiser(): void {
    this.etat          = 'idle';
    this.pourcentage   = 0;
    this.traites       = 0;
    this.total         = 0;
    this.batchActuel   = 0;
    this.totalBatches  = 0;
    this.batchSize     = 50;
    this.rapport       = undefined;
    this.messageErreur = '';
    this.dragActif     = false;
  }

  private pause(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
  }
}