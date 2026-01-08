import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategorieService } from '../../services/categorie';
import { Categorie, PageResponse } from '../../../../core/models/categorie.model';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-categorie-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorie-list.html',
  styleUrl: './categorie-list.css'
})
export class CategorieListComponent implements OnInit {
  categories: Categorie[] = [];
  loading = false;
  searchTerm = '';
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Modal
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedCategorie: Categorie | null = null;
  
  // Form
  formData = {
    nom: '',
    description: ''
  };

  constructor(
    private categorieService: CategorieService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categorieService.getAllCategories(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.categories = response.data.content;
            this.totalElements = response.data.totalElements;
            this.totalPages = response.data.totalPages;
          }
          this.loading = false;
        },
        error: (error) => {
          this.toastr.error(error.message, 'Erreur');
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadCategories();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCategories();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.formData = { nom: '', description: '' };
    this.showModal = true;
  }

  openEditModal(categorie: Categorie): void {
    this.modalMode = 'edit';
    this.selectedCategorie = categorie;
    this.formData = {
      nom: categorie.nom,
      description: categorie.description || ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCategorie = null;
    this.formData = { nom: '', description: '' };
  }

  onSubmit(): void {
    if (!this.formData.nom.trim()) {
      this.toastr.warning('Le nom est obligatoire', 'Validation');
      return;
    }

    if (this.modalMode === 'create') {
      this.createCategorie();
    } else {
      this.updateCategorie();
    }
  }

  createCategorie(): void {
    this.loading = true;
    this.categorieService.createCategorie(this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Catégorie créée avec succès', 'Succès');
          this.closeModal();
          this.loadCategories();
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message, 'Erreur');
        this.loading = false;
      }
    });
  }

  updateCategorie(): void {
    if (!this.selectedCategorie) return;

    this.loading = true;
    this.categorieService.updateCategorie(this.selectedCategorie.id, this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Catégorie modifiée avec succès', 'Succès');
          this.closeModal();
          this.loadCategories();
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message, 'Erreur');
        this.loading = false;
      }
    });
  }

  deleteCategorie(categorie: Categorie): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categorie.nom}" ?`)) {
      return;
    }

    this.categorieService.deleteCategorie(categorie.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Catégorie supprimée avec succès', 'Succès');
          this.loadCategories();
        }
      },
      error: (error) => {
        this.toastr.error(error.message, 'Erreur');
      }
    });
  }

  toggleStatut(categorie: Categorie): void {
    this.categorieService.toggleStatut(categorie.id).subscribe({
      next: (response) => {
        if (response.success) {
          const action = response.data.statut === 'ACTIF' ? 'activée' : 'désactivée';
          this.toastr.success(`Catégorie ${action} avec succès`, 'Succès');
          this.loadCategories();
        }
      },
      error: (error) => {
        this.toastr.error(error.message, 'Erreur');
      }
    });
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }
}