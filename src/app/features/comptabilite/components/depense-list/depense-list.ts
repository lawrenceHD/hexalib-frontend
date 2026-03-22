// ════════════════════════════════════════════════════
// depense-list.component.ts
// ════════════════════════════════════════════════════
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepenseService } from '../../services/depense';
import { CategorieDepenseService } from '../../services/categorie-depense';
import { DepenseResponse, DepenseRequest, CategorieDepenseResponse } from '../../models/comptabilite.model';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-depense-list',
  standalone: true,
 imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './depense-list.html'
})
export class DepenseListComponent implements OnInit {
  depenses: DepenseResponse[] = [];
  categories: CategorieDepenseResponse[] = [];
  loading = false;

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Filtres
  selectedCategorieId = '';
  debut = '';
  fin   = '';

  // Modal
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedDepense: DepenseResponse | null = null;
  modalLoading = false;

  formData: DepenseRequest = this.emptyForm();

  constructor(
    private depenseService: DepenseService,
    private categorieService: CategorieDepenseService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDepenses();
    this.loadCategories();
  }

  loadDepenses(): void {
    this.loading = true;
    this.depenseService.getAll(
      this.currentPage, this.pageSize,
      this.selectedCategorieId || undefined,
      this.debut || undefined,
      this.fin   || undefined
    ).subscribe({
      next: (res) => {
        this.depenses      = res.data.content;
        this.totalElements = res.data.totalElements;
        this.totalPages    = res.data.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.message || 'Erreur chargement', 'Erreur');
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categorieService.getAllActives().subscribe({
      next: (res) => { this.categories = res.data; }
    });
  }

  onFilterChange(): void { this.currentPage = 0; this.loadDepenses(); }
  onPageChange(p: number): void { this.currentPage = p; this.loadDepenses(); }
  resetFilters(): void { this.selectedCategorieId = ''; this.debut = ''; this.fin = ''; this.onFilterChange(); }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.formData = this.emptyForm();
    this.showModal = true;
  }

  openEditModal(d: DepenseResponse): void {
    this.modalMode = 'edit';
    this.selectedDepense = d;
    this.formData = {
      description: d.description,
      montant: d.montant,
      dateDepense: d.dateDepense,
      categorieId: d.categorieId,
      reference: d.reference || ''
    };
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; this.selectedDepense = null; }

  onSubmit(): void {
    if (!this.formData.description || !this.formData.montant || !this.formData.dateDepense || !this.formData.categorieId) {
      this.toastr.warning('Veuillez remplir tous les champs obligatoires', 'Validation');
      return;
    }
    this.modalLoading = true;
    const req$ = this.modalMode === 'create'
      ? this.depenseService.create(this.formData)
      : this.depenseService.update(this.selectedDepense!.id, this.formData);

    req$.subscribe({
      next: () => {
        this.toastr.success(this.modalMode === 'create' ? 'Dépense enregistrée' : 'Dépense mise à jour', 'Succès');
        this.closeModal();
        this.loadDepenses();
        this.modalLoading = false;
      },
      error: (err) => {
        this.toastr.error(err.message || 'Erreur', 'Erreur');
        this.modalLoading = false;
      }
    });
  }

  delete(d: DepenseResponse): void {
    if (!confirm(`Supprimer la dépense "${d.description}" ?`)) return;
    this.depenseService.delete(d.id).subscribe({
      next: () => { this.toastr.success('Dépense supprimée', 'Succès'); this.loadDepenses(); },
      error: (err) => this.toastr.error(err.message || 'Erreur', 'Erreur')
    });
  }

  private emptyForm(): DepenseRequest {
    return { description: '', montant: 0, dateDepense: new Date().toISOString().slice(0, 10), categorieId: '', reference: '' };
  }
}