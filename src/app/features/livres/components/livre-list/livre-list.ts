// src/app/features/livres/components/livre-list/livre-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LivreService } from '../../services/livre';
import { CategorieService } from '../../../categories/services/categorie';
import { Livre, PageResponse } from '../../models/livre.model';
import { Categorie } from '../../../../core/models/categorie.model';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-livre-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './livre-list.html',
  styleUrl: './livre-list.css'
})
export class LivreListComponent implements OnInit {
  livres: Livre[] = [];
  categories: Categorie[] = [];
  langues: string[] = [];
  loading = false;
  
  // Filtres
  searchTerm = '';
  selectedCategorieId = '';
  selectedStatut = '';
  selectedLangue = '';
  
  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Modal
  showModal = false;
  showStockModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedLivre: Livre | null = null;
  
  // Form
  formData: any = this.initFormData();
  
  // Ajustement stock
  stockFormData = {
    quantite: 0,
    motif: ''
  };

  constructor(
    private livreService: LivreService,
    private categorieService: CategorieService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLivres();
    this.loadCategoriesActives();
    this.loadLangues();
  }

  initFormData() {
    return {
      titre: '',
      description: '',
      auteur: '',
      maisonEdition: '',
      dateParution: '',
      isbn: '',
      langue: 'Français',
      quantiteStock: 0,
      seuilMinimal: 5,
      prixVente: 0,
      prixAchat: 0,
      emplacement: '',
      categorieId: ''
    };
  }

  loadLivres(): void {
    this.loading = true;
    this.livreService.getAllLivres(
      this.currentPage, 
      this.pageSize, 
      this.searchTerm,
      this.selectedCategorieId,
      this.selectedStatut,
      this.selectedLangue
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.livres = response.data.content;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors du chargement', 'Erreur');
        this.loading = false;
      }
    });
  }

  loadCategoriesActives(): void {
    this.categorieService.getAllCategoriesActives().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Erreur chargement catégories', error);
      }
    });
  }

  loadLangues(): void {
    this.livreService.getAllLangues().subscribe({
      next: (response) => {
        if (response.success) {
          this.langues = response.data;
        }
      },
      error: (error) => {
        console.error('Erreur chargement langues', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadLivres();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadLivres();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategorieId = '';
    this.selectedStatut = '';
    this.selectedLangue = '';
    this.onFilterChange();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLivres();
  }

  openCreateModal(): void {
  console.log('Opening modal...'); // ✅ Debug
  this.modalMode = 'create';
  this.formData = this.initFormData();
  this.showModal = true;
  console.log('showModal:', this.showModal); // ✅ Debug
}

  openEditModal(livre: Livre): void {
    this.modalMode = 'edit';
    this.selectedLivre = livre;
    this.formData = {
      titre: livre.titre,
      description: livre.description || '',
      auteur: livre.auteur,
      maisonEdition: livre.maisonEdition,
      dateParution: livre.dateParution ? this.formatDateForInput(new Date(livre.dateParution)) : '',
      isbn: livre.isbn || '',
      langue: livre.langue,
      quantiteStock: livre.quantiteStock,
      seuilMinimal: livre.seuilMinimal,
      prixVente: livre.prixVente,
      prixAchat: livre.prixAchat || 0,
      emplacement: livre.emplacement || '',
      categorieId: livre.categorie.id
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedLivre = null;
    this.formData = this.initFormData();
  }

  onSubmit(): void {
    // Validation basique
    if (!this.formData.titre.trim()) {
      this.toastr.warning('Le titre est obligatoire', 'Validation');
      return;
    }
    if (!this.formData.auteur.trim()) {
      this.toastr.warning('L\'auteur est obligatoire', 'Validation');
      return;
    }
    if (!this.formData.categorieId) {
      this.toastr.warning('La catégorie est obligatoire', 'Validation');
      return;
    }
    if (this.formData.prixVente <= 0) {
      this.toastr.warning('Le prix de vente doit être supérieur à 0', 'Validation');
      return;
    }

    if (this.modalMode === 'create') {
      this.createLivre();
    } else {
      this.updateLivre();
    }
  }

  createLivre(): void {
    this.loading = true;
    this.livreService.createLivre(this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Livre créé avec succès', 'Succès');
          this.closeModal();
          this.loadLivres();
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors de la création', 'Erreur');
        this.loading = false;
      }
    });
  }

  updateLivre(): void {
    if (!this.selectedLivre) return;

    this.loading = true;
    this.livreService.updateLivre(this.selectedLivre.id, this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Livre modifié avec succès', 'Succès');
          this.closeModal();
          this.loadLivres();
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors de la modification', 'Erreur');
        this.loading = false;
      }
    });
  }

  deleteLivre(livre: Livre): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le livre "${livre.titre}" ?`)) {
      return;
    }

    this.livreService.deleteLivre(livre.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Livre supprimé avec succès', 'Succès');
          this.loadLivres();
        }
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors de la suppression', 'Erreur');
      }
    });
  }

  toggleStatut(livre: Livre): void {
    this.livreService.toggleStatut(livre.id).subscribe({
      next: (response) => {
        if (response.success) {
          const action = response.data.statut === 'ACTIF' ? 'activé' : 'désactivé';
          this.toastr.success(`Livre ${action} avec succès`, 'Succès');
          this.loadLivres();
        }
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur', 'Erreur');
      }
    });
  }

  openStockModal(livre: Livre): void {
    this.selectedLivre = livre;
    this.stockFormData = {
      quantite: livre.quantiteStock,
      motif: ''
    };
    this.showStockModal = true;
  }

  closeStockModal(): void {
    this.showStockModal = false;
    this.selectedLivre = null;
    this.stockFormData = { quantite: 0, motif: '' };
  }

  ajusterStock(): void {
    if (!this.selectedLivre) return;
    if (this.stockFormData.quantite < 0) {
      this.toastr.warning('La quantité ne peut pas être négative', 'Validation');
      return;
    }

    this.livreService.ajusterStock(
      this.selectedLivre.id, 
      this.stockFormData.quantite, 
      this.stockFormData.motif
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Stock ajusté avec succès', 'Succès');
          this.closeStockModal();
          this.loadLivres();
        }
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur', 'Erreur');
      }
    });
  }

  getStatutStockClass(livre: Livre): string {
    if (livre.enRupture) {
      return 'bg-red-500/20 text-red-700';
    } else if (livre.stockCritique) {
      return 'bg-orange-500/20 text-orange-700';
    } else {
      return 'bg-green-500/20 text-green-700';
    }
  }

  getStatutStockLabel(livre: Livre): string {
    if (livre.enRupture) {
      return 'RUPTURE';
    } else if (livre.stockCritique) {
      return 'CRITIQUE';
    } else {
      return 'DISPONIBLE';
    }
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }
}