import { Component, OnInit } from '@angular/core';
import { VenteService } from '../../services/vente';
import { VenteResponse, StatutVente } from '../../models/vente.model';
import { CommonModule } from '@angular/common';      // ← pour pipes (number, date, etc.) + *ngIf, *ngFor
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vente-list',
  imports: [
    CommonModule,     // Résout les pipes + directives de base
    FormsModule       // Résout ngModel
  ],
  templateUrl: './vente-list.html',
  styleUrls: ['./vente-list.css']
})
export class VenteListComponent implements OnInit {
  ventes: VenteResponse[] = [];
  loading = false;

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Recherche
  searchTerm = '';

  // Enum pour le template
  StatutVente = StatutVente;

  // Détail vente sélectionnée
  venteSelectionnee: VenteResponse | null = null;
  showDetailModal = false;

  constructor(private venteService: VenteService) {}

  ngOnInit(): void {
    this.loadVentes();
  }

  /**
   * Charger les ventes
   */
  loadVentes(): void {
    this.loading = true;

    const request$ = this.searchTerm
      ? this.venteService.search(this.searchTerm, this.currentPage, this.pageSize)
      : this.venteService.getAll(this.currentPage, this.pageSize);

    request$.subscribe({
      next: (response) => {
        this.ventes = response.data.content;
        this.totalElements = response.data.totalElements;
        this.totalPages = response.data.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  /**
   * Rechercher
   */
  onSearch(): void {
    this.currentPage = 0;
    this.loadVentes();
  }

  /**
   * Changer de page
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVentes();
  }

  /**
   * Voir le détail d'une vente
   */
  voirDetail(vente: VenteResponse): void {
    this.venteSelectionnee = vente;
    this.showDetailModal = true;
  }

  /**
   * Fermer le modal détail
   */
  closeDetailModal(): void {
    this.showDetailModal = false;
    this.venteSelectionnee = null;
  }

  /**
   * Télécharger la facture
   */
  telechargerFacture(venteId: string): void {
    this.venteService.getFacturePDF(venteId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facture-${venteId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur téléchargement facture', err);
        alert('Erreur lors du téléchargement de la facture');
      }
    });
  }

  /**
   * Annuler une vente (Admin uniquement)
   */
  annulerVente(vente: VenteResponse): void {
    const motif = prompt('Motif d\'annulation :');
    if (!motif) {
      return;
    }

    if (confirm(`Confirmer l'annulation de la vente ${vente.numeroFacture} ?`)) {
      this.venteService.annuler(vente.id, motif).subscribe({
        next: () => {
          alert('Vente annulée avec succès');
          this.loadVentes();
          this.closeDetailModal();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'annulation');
        }
      });
    }
  }

  /**
   * Formater la date
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}