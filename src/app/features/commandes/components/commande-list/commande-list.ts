// src/app/features/commandes/components/commande-list/commande-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommandeService } from '../../services/commande';
import { FournisseurService } from '../../../fournisseurs/services/fournisseur';
import { CommandeFournisseur, PageResponse } from '../../models/commande.model';
import { Fournisseur } from '../../../fournisseurs/models/fournisseur.model';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-list.html',
  styleUrl: './commande-list.css'
})
export class CommandeListComponent implements OnInit {
  commandes: CommandeFournisseur[] = [];
  fournisseurs: Fournisseur[] = [];
  loading = false;

  // Filtres
  searchTerm = '';
  selectedFournisseurId = '';
  selectedStatut = '';
  dateDebut = '';
  dateFin = '';

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Modals
  showRecevoirModal = false;
  showAnnulerModal = false;
  selectedCommande: CommandeFournisseur | null = null;
  dateReception = '';
  motifAnnulation = '';

  constructor(
    private commandeService: CommandeService,
    private fournisseurService: FournisseurService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
    this.loadFournisseurs();
  }

  loadCommandes(): void {
    this.loading = true;
    this.commandeService.getAllCommandes(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.selectedFournisseurId,
      this.selectedStatut,
      this.dateDebut,
      this.dateFin
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.commandes = response.data.content;
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

  loadFournisseurs(): void {
    this.fournisseurService.getAllFournisseursActifs().subscribe({
      next: (response) => {
        if (response.success) {
          this.fournisseurs = response.data;
        }
      },
      error: (error) => {
        console.error('Erreur chargement fournisseurs', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadCommandes();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadCommandes();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedFournisseurId = '';
    this.selectedStatut = '';
    this.dateDebut = '';
    this.dateFin = '';
    this.onFilterChange();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCommandes();
  }

  createCommande(): void {
    this.router.navigate(['/commandes/nouveau']);
  }

  viewDetails(commande: CommandeFournisseur): void {
    this.router.navigate(['/commandes', commande.id]);
  }

  editCommande(commande: CommandeFournisseur): void {
    this.router.navigate(['/commandes', commande.id, 'modifier']);
  }

  deleteCommande(commande: CommandeFournisseur): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la commande "${commande.numeroCommande}" ?`)) {
      return;
    }

    this.commandeService.deleteCommande(commande.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Commande supprimée avec succès', 'Succès');
          this.loadCommandes();
        }
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors de la suppression', 'Erreur');
      }
    });
  }

  openRecevoirModal(commande: CommandeFournisseur): void {
    this.selectedCommande = commande;
    this.dateReception = this.formatDateForInput(new Date());
    this.showRecevoirModal = true;
  }

  closeRecevoirModal(): void {
    this.showRecevoirModal = false;
    this.selectedCommande = null;
    this.dateReception = '';
  }

  confirmRecevoir(): void {
    if (!this.selectedCommande || !this.dateReception) return;

    this.loading = true;
    this.commandeService.recevoirCommande(this.selectedCommande.id, this.dateReception).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Commande reçue avec succès. Les stocks ont été mis à jour.', 'Succès');
          this.closeRecevoirModal();
          this.loadCommandes();
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur', 'Erreur');
        this.loading = false;
      }
    });
  }

  openAnnulerModal(commande: CommandeFournisseur): void {
    this.selectedCommande = commande;
    this.motifAnnulation = '';
    this.showAnnulerModal = true;
  }

  closeAnnulerModal(): void {
    this.showAnnulerModal = false;
    this.selectedCommande = null;
    this.motifAnnulation = '';
  }

  confirmAnnuler(): void {
    if (!this.selectedCommande) return;

    this.loading = true;
    this.commandeService.annulerCommande(this.selectedCommande.id, this.motifAnnulation).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Commande annulée avec succès', 'Succès');
          this.closeAnnulerModal();
          this.loadCommandes();
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur', 'Erreur');
        this.loading = false;
      }
    });
  }

  downloadPdf(commande: CommandeFournisseur): void {
    this.commandeService.downloadPdf(commande.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Commande_${commande.numeroCommande}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('PDF téléchargé avec succès', 'Succès');
      },
      error: (error) => {
        this.toastr.error('Erreur lors du téléchargement du PDF', 'Erreur');
      }
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'bg-orange-500/20 text-orange-700';
      case 'RECUE':
        return 'bg-green-500/20 text-green-700';
      case 'ANNULEE':
        return 'bg-red-500/20 text-red-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'EN ATTENTE';
      case 'RECUE':
        return 'REÇUE';
      case 'ANNULEE':
        return 'ANNULÉE';
      default:
        return statut;
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