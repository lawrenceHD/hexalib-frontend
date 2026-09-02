import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { VenteService } from '../../services/vente';
import { VenteResponse, StatutVente } from '../../models/vente.model';

@Component({
  selector: 'app-vente-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './vente-list.html',
  styleUrls: ['./vente-list.css']
})
export class VenteListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  ventes: VenteResponse[] = [];
  loading = false;

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Recherche (admin uniquement)
  searchTerm = '';

  // Enum pour le template
  StatutVente = StatutVente;

  // Détail vente sélectionnée
  venteSelectionnee: VenteResponse | null = null;
  showDetailModal = false;

  constructor(
    private venteService: VenteService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadVentes();
  }

  redirectToPointVente(): void {
    this.router.navigate(['/ventes/point-vente']);
  }

  /**
   * Charger les ventes selon le rôle :
   * - ADMIN → toutes les ventes (avec recherche possible)
   * - VENDEUR → uniquement ses propres ventes
   */
  loadVentes(): void {
    this.loading = true;

    let request$;

    if (this.authService.isAdmin()) {
      // Admin : toutes les ventes, avec recherche
      request$ = this.searchTerm
        ? this.venteService.search(this.searchTerm, this.currentPage, this.pageSize)
        : this.venteService.getAll(this.currentPage, this.pageSize);
    } else {
      // Vendeur : uniquement ses ventes
      request$ = this.venteService.getMesVentes(this.currentPage, this.pageSize);
    }

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

  onSearch(): void {
    this.currentPage = 0;
    this.loadVentes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVentes();
  }

  voirDetail(vente: VenteResponse): void {
    this.venteSelectionnee = vente;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.venteSelectionnee = null;
  }

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
      error: () => alert('Erreur lors du téléchargement de la facture')
    });
  }

  /**
   * Annuler une vente — admin uniquement
   */
  annulerVente(vente: VenteResponse): void {
    const motif = prompt('Motif d\'annulation :');
    if (!motif) return;

    if (confirm(`Confirmer l'annulation de la vente ${vente.numeroFacture} ?`)) {
      this.venteService.annuler(vente.id, motif).subscribe({
        next: () => {
          alert('Vente annulée avec succès');
          this.loadVentes();
          this.closeDetailModal();
        },
        error: () => alert('Erreur lors de l\'annulation')
      });
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}