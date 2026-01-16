import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { ReductionService } from '../../services/reduction';
import { CategorieService } from '../../../categories/services/categorie';
import { LivreService } from '../../../livres/services/livre';

import { 
  Reduction, 
  ReductionRequest, 
  TypeReduction, 
  CibleReduction 
} from '../../models/reduction.model';

@Component({
  selector: 'app-reduction-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reduction-list.html',
  styleUrls: ['./reduction-list.css']
})
export class ReductionListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Liste des réductions
  reductions: Reduction[] = [];
  loading = false;

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Filtres
  searchTerm = '';
  selectedStatut = ''; // '', 'actives', 'expirees'

  // Modal
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  modalLoading = false;

  // Enums pour le template
  TypeReduction = TypeReduction;
  CibleReduction = CibleReduction;

  // Form data
  formData: ReductionRequest = this.getEmptyFormData();
  editingReductionId: string | null = null;

  // Listes pour les selects
  categories: any[] = [];
  livres: any[] = [];

  constructor(
    private reductionService: ReductionService,
    private categorieService: CategorieService,
    private livreService: LivreService
  ) {}

  ngOnInit(): void {
    this.loadReductions();
    this.loadCategories();
    this.loadLivres();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // Chargement des données
  // ────────────────────────────────────────────────────────────────────────────────

  loadReductions(): void {
    this.loading = true;

    let request$;
    if (this.searchTerm) {
      request$ = this.reductionService.search(this.searchTerm, this.currentPage, this.pageSize);
    } else if (this.selectedStatut === 'actives') {
      request$ = this.reductionService.getActives(this.currentPage, this.pageSize);
    } else {
      request$ = this.reductionService.getAll(this.currentPage, this.pageSize);
    }

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.reductions = response.data.content || [];
          this.totalElements = response.data.totalElements || 0;
          this.totalPages = response.data.totalPages || 0;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur chargement réductions:', err);
          this.loading = false;
        }
      });
  }

  loadCategories(): void {
    this.categorieService.getAllCategories(0, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.categories = response.data.content || [];
        },
        error: (err) => console.error('Erreur chargement catégories:', err)
      });
  }

  loadLivres(): void {
    this.livreService.getAllLivres(0, 100, '', '', 'ACTIF', '')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.livres = response.data.content || [];
        },
        error: (err) => console.error('Erreur chargement livres:', err)
      });
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // Filtres & Pagination
  // ────────────────────────────────────────────────────────────────────────────────

  onSearch(): void {
    this.currentPage = 0;
    this.loadReductions();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.searchTerm = ''; // Reset recherche quand on change le filtre statut
    this.loadReductions();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatut = '';
    this.currentPage = 0;
    this.loadReductions();
  }

  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadReductions();
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // Modal
  // ────────────────────────────────────────────────────────────────────────────────

  openCreateModal(): void {
    this.modalMode = 'create';
    this.formData = this.getEmptyFormData();
    this.editingReductionId = null;
    this.showModal = true;
  }

  openEditModal(reduction: Reduction): void {
    this.modalMode = 'edit';
    this.editingReductionId = reduction.id;
    this.formData = {
      intitule: reduction.intitule,
      description: reduction.description || '',
      type: reduction.type,
      valeur: reduction.valeur,
      cible: reduction.cible,
      cibleId: reduction.cibleId,
      dateDebut: reduction.dateDebut,
      dateFin: reduction.dateFin,
      actif: reduction.actif
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    setTimeout(() => {
      this.formData = this.getEmptyFormData();
      this.editingReductionId = null;
    }, 300);
  }

  onSubmit(): void {
    if (!this.formData.intitule || !this.formData.valeur) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.formData.cible !== CibleReduction.GLOBALE && !this.formData.cibleId) {
      alert('Veuillez sélectionner une cible spécifique');
      return;
    }

    this.modalLoading = true;

    const request$ = this.modalMode === 'create'
      ? this.reductionService.create(this.formData)
      : this.reductionService.update(this.editingReductionId!, this.formData);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeModal();
          this.loadReductions();
          this.modalLoading = false;
        },
        error: (err) => {
          console.error('Erreur enregistrement réduction:', err);
          alert('Erreur lors de l\'enregistrement');
          this.modalLoading = false;
        }
      });
  }

  toggleStatut(reduction: Reduction): void {
    if (!confirm(`Voulez-vous vraiment ${reduction.actif ? 'désactiver' : 'activer'} cette réduction ?`)) {
      return;
    }

    this.reductionService.toggleActif(reduction.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadReductions(),
        error: (err) => {
          console.error('Erreur toggle statut:', err);
          alert('Erreur lors de la modification du statut');
        }
      });
  }

  deleteReduction(reduction: Reduction): void {
    if (!confirm(`Voulez-vous vraiment supprimer la réduction "${reduction.intitule}" ?`)) {
      return;
    }

    this.reductionService.delete(reduction.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadReductions(),
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('Erreur lors de la suppression');
        }
      });
  }

  onCibleChange(): void {
    if (this.formData.cible === CibleReduction.GLOBALE) {
      this.formData.cibleId = undefined;
    }
  }

  private getEmptyFormData(): ReductionRequest {
    return {
      intitule: '',
      description: '',
      type: TypeReduction.POURCENTAGE,
      valeur: 0,
      cible: CibleReduction.GLOBALE,
      cibleId: undefined,
      dateDebut: '',
      dateFin: '',
      actif: true
    };
  }

  formatValeur(reduction: Reduction): string {
    return reduction.type === TypeReduction.POURCENTAGE
      ? `${reduction.valeur}%`
      : `${reduction.valeur} XAF`;
  }

  getTypeLabel(type: TypeReduction): string {
    return type === TypeReduction.POURCENTAGE ? 'Pourcentage' : 'Montant Fixe';
  }

  getCibleLabel(cible: CibleReduction): string {
    const labels: Record<CibleReduction, string> = {
      [CibleReduction.GLOBALE]: 'Globale',
      [CibleReduction.LIVRE]: 'Livre spécifique',
      [CibleReduction.CATEGORIE]: 'Catégorie'
    };
    return labels[cible];
  }
}