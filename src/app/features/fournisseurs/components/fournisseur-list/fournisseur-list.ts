// src/app/features/fournisseurs/components/fournisseur-list/fournisseur-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FournisseurService } from '../../services/fournisseur';
import { Fournisseur, PageResponse } from '../../models/fournisseur.model';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournisseur-list.html',
  styleUrl: './fournisseur-list.css'
})
export class FournisseurListComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  loading = false;
  
  // Filtres
  searchTerm = '';
  selectedStatut = '';
  
  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Modal
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedFournisseur: Fournisseur | null = null;
  
  // Form
  formData: any = this.initFormData();

  constructor(
    private fournisseurService: FournisseurService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  initFormData() {
    return {
      nom: '',
      contact: '',
      telephone: '',
      email: '',
      adresse: '',
      delaiLivraisonJours: null
    };
  }

  loadFournisseurs(): void {
    this.loading = true;
    this.fournisseurService.getAllFournisseurs(
      this.currentPage, 
      this.pageSize, 
      this.searchTerm,
      this.selectedStatut
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.fournisseurs = response.data.content;
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

  onSearch(): void {
    this.currentPage = 0;
    this.loadFournisseurs();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadFournisseurs();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatut = '';
    this.onFilterChange();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFournisseurs();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.formData = this.initFormData();
    this.showModal = true;
  }

  openEditModal(fournisseur: Fournisseur): void {
    this.modalMode = 'edit';
    this.selectedFournisseur = fournisseur;
    this.formData = {
      nom: fournisseur.nom,
      contact: fournisseur.contact || '',
      telephone: fournisseur.telephone || '',
      email: fournisseur.email || '',
      adresse: fournisseur.adresse || '',
      delaiLivraisonJours: fournisseur.delaiLivraisonJours || null
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedFournisseur = null;
    this.formData = this.initFormData();
  }

  onSubmit(): void {
    // Validation basique
    if (!this.formData.nom.trim()) {
      this.toastr.warning('Le nom est obligatoire', 'Validation');
      return;
    }

    if (this.modalMode === 'create') {
      this.createFournisseur();
    } else {
      this.updateFournisseur();
    }
  }

  createFournisseur(): void {
    this.loading = true;
    this.fournisseurService.createFournisseur(this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Fournisseur créé avec succès', 'Succès');
          this.closeModal();
          this.loadFournisseurs();
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors de la création', 'Erreur');
        this.loading = false;
      }
    });
  }

  updateFournisseur(): void {
    if (!this.selectedFournisseur) return;

    this.loading = true;
    this.fournisseurService.updateFournisseur(this.selectedFournisseur.id, this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Fournisseur modifié avec succès', 'Succès');
          this.closeModal();
          this.loadFournisseurs();
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors de la modification', 'Erreur');
        this.loading = false;
      }
    });
  }

  deleteFournisseur(fournisseur: Fournisseur): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le fournisseur "${fournisseur.nom}" ?`)) {
      return;
    }

    this.fournisseurService.deleteFournisseur(fournisseur.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Fournisseur supprimé avec succès', 'Succès');
          this.loadFournisseurs();
        }
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors de la suppression', 'Erreur');
      }
    });
  }

  toggleStatut(fournisseur: Fournisseur): void {
    this.fournisseurService.toggleStatut(fournisseur.id).subscribe({
      next: (response) => {
        if (response.success) {
          const action = response.data.statut === 'ACTIF' ? 'activé' : 'désactivé';
          this.toastr.success(`Fournisseur ${action} avec succès`, 'Succès');
          this.loadFournisseurs();
        }
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur', 'Erreur');
      }
    });
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }
}