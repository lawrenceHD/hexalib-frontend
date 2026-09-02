import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { VenteService } from '../../services/vente';
import { LivreService } from '../../../livres/services/livre';
import { ReductionService } from '../../../reductions/services/reduction';
import { LignePanier, ReductionDisponible, VenteRequest } from '../../models/vente.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IconComponent } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-point-vente',
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './point-vente.html',
  styleUrls: ['./point-vente.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointVenteComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  showCartMobile = false;
  // Recherche de livres
  searchTerm = '';
  livresDisponibles: any[] = [];
  loadingLivres = false;

  // Réductions actives (chargées une seule fois)
  reductionsActives: ReductionDisponible[] = [];
  loadingReductions = false;

  // Panier
  panier: LignePanier[] = [];

  // Totaux
  totalHT = 0;
  totalReductions = 0;
  totalTTC = 0;

  // Validation
  processing = false;

  constructor(
    private venteService: VenteService,
    private livreService: LivreService,
    private reductionService: ReductionService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  trackByLivre(_: number, l: any): string { return l.id; }
  trackByPanier(_: number, l: LignePanier): string { return l.livre.id; }
  toggleCartMobile(): void { this.showCartMobile = !this.showCartMobile; this.cdr.markForCheck(); }

  ngOnInit(): void {
    this.loadLivresDisponibles();
    this.loadReductionsActives();
  }

  goBack(): void {
    this.router.navigate(['/ventes/liste']);
  }

  redirectToPointVente(): void {
    this.router.navigate(['/ventes/point-vente']);
  }

  /**
   * Charger les livres disponibles (stock > 0)
   */
  loadLivresDisponibles(): void {
    this.loadingLivres = true;
    this.livreService.getAllLivres(0, 200, this.searchTerm, '', 'ACTIF', '').subscribe({
      next: (response) => {
        this.livresDisponibles = response.data.content.filter((l: any) => l.quantiteStock > 0);
        this.loadingLivres = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement des livres', 'Erreur');
        this.loadingLivres = false;
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Charger toutes les réductions actives (valides aujourd'hui)
   */
  loadReductionsActives(): void {
    this.loadingReductions = true;
    this.reductionService.getValides().subscribe({
      next: (response) => {
        this.reductionsActives = (response.data || []).map((r: any) => ({
          id: r.id,
          intitule: r.intitule,
          type: r.type,
          valeur: r.valeur,
          cible: r.cible,
          cibleId: r.cibleId,
          estValide: r.estValide
        }));
        this.loadingReductions = false;
      },
      error: () => {
        this.loadingReductions = false;
      }
    });
  }

  /**
   * Filtrer les réductions applicables à un livre donné
   * Règle : GLOBALE toujours + CATEGORIE si même catégorie + LIVRE si même livre
   */
  getReductionsApplicables(livre: any): ReductionDisponible[] {
    return this.reductionsActives.filter(r => {
      if (r.cible === 'GLOBALE') return true;
      if (r.cible === 'LIVRE' && (r as any).cibleId === livre.id) return true;
      if (r.cible === 'CATEGORIE' && (r as any).cibleId === livre.categorie?.id) return true;
      return false;
    });
  }

  /**
   * Rechercher des livres
   */
  onSearch(): void {
    this.loadLivresDisponibles();
  }

  /**
   * Ajouter un livre au panier
   */
  ajouterAuPanier(livre: any): void {
    const existant = this.panier.find(l => l.livre.id === livre.id);

    if (existant) {
      if (existant.quantite + 1 > livre.quantiteStock) {
        this.toastr.warning(`Stock insuffisant. Disponible : ${livre.quantiteStock}`, 'Stock');
        return;
      }
      existant.quantite++;
      this.recalculerLigne(existant);
    } else {
      const reductionsApplicables = this.getReductionsApplicables(livre);
      const ligne: LignePanier = {
        livre,
        quantite: 1,
        prixUnitaire: livre.prixVente,
        reductionChoisie: null,
        reductionsDisponibles: reductionsApplicables,
        montantReduction: 0,
        sousTotal: livre.prixVente,
        showReductions: false
      };
      this.panier.push(ligne);
    }

    this.calculerTotaux();
  }

  /**
   * Afficher/masquer le panneau de réductions d'une ligne
   */
  toggleReductions(ligne: LignePanier): void {
    ligne.showReductions = !ligne.showReductions;
  }

  /**
   * Appliquer une réduction choisie par le vendeur
   */
  appliquerReduction(ligne: LignePanier, reduction: ReductionDisponible): void {
    ligne.reductionChoisie = reduction;
    this.recalculerLigne(ligne);
    ligne.showReductions = false;
    this.toastr.success(`Réduction "${reduction.intitule}" appliquée`, 'Réduction');
  }

  /**
   * Supprimer la réduction d'une ligne
   */
  supprimerReduction(ligne: LignePanier): void {
    ligne.reductionChoisie = null;
    this.recalculerLigne(ligne);
    this.toastr.info('Réduction retirée', 'Panier');
  }

  /**
   * Recalculer sous-total d'une ligne selon la réduction choisie
   */
  recalculerLigne(ligne: LignePanier): void {
    const montantBase = ligne.prixUnitaire * ligne.quantite;

    if (ligne.reductionChoisie) {
      const r = ligne.reductionChoisie;
      if (r.type === 'POURCENTAGE') {
        ligne.montantReduction = Math.round((montantBase * r.valeur) / 100);
      } else {
        ligne.montantReduction = Math.min(r.valeur, montantBase); // Ne pas dépasser le prix
      }
    } else {
      ligne.montantReduction = 0;
    }

    ligne.sousTotal = montantBase - ligne.montantReduction;
    this.calculerTotaux();
  }

  /**
   * Modifier la quantité d'une ligne
   */
  modifierQuantite(ligne: LignePanier, nouvelleQuantite: number): void {
    if (nouvelleQuantite < 1) return;

    if (nouvelleQuantite > ligne.livre.quantiteStock) {
      this.toastr.warning(`Stock insuffisant. Disponible : ${ligne.livre.quantiteStock}`, 'Stock');
      ligne.quantite = ligne.livre.quantiteStock;
    } else {
      ligne.quantite = nouvelleQuantite;
    }

    this.recalculerLigne(ligne);
  }

  /**
   * Retirer une ligne du panier
   */
  retirerDuPanier(index: number): void {
    this.panier.splice(index, 1);
    this.calculerTotaux();
  }

  /**
   * Vider le panier
   */
  viderPanier(): void {
    if (confirm('Voulez-vous vraiment vider le panier ?')) {
      this.panier = [];
      this.calculerTotaux();
    }
  }

  /**
   * Calculer les totaux globaux
   */
  calculerTotaux(): void {
    this.totalHT = this.panier.reduce((sum, l) => sum + l.prixUnitaire * l.quantite, 0);
    this.totalReductions = this.panier.reduce((sum, l) => sum + l.montantReduction, 0);
    this.totalTTC = this.totalHT - this.totalReductions;
    this.cdr.markForCheck();
  }

  /**
   * Valider la vente
   */
  validerVente(): void {
    if (this.panier.length === 0) {
      this.toastr.warning('Le panier est vide', 'Panier');
      return;
    }

    if (!confirm(`Confirmer la vente de ${this.totalTTC.toLocaleString('fr-FR')} XAF ?`)) return;

    this.processing = true;

    const request: VenteRequest = {
      lignes: this.panier.map(ligne => ({
        livreId: ligne.livre.id,
        quantite: ligne.quantite,
        reductionId: ligne.reductionChoisie?.id // ← Envoyer la réduction choisie
      }))
    };

    this.venteService.create(request).subscribe({
      next: (response) => {
        this.toastr.success('Vente enregistrée avec succès !', 'Succès');
        const venteId = response.data.id;
        this.telechargerFacture(venteId);
        this.panier = [];
        this.calculerTotaux();
        this.loadLivresDisponibles();
        this.processing = false;
      },
      error: (err) => {
        this.toastr.error(err.message || 'Erreur lors de la vente', 'Erreur');
        this.processing = false;
      }
    });
  }

  /**
   * Télécharger la facture PDF
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
      error: () => {
        this.toastr.error('Erreur lors du téléchargement de la facture', 'Erreur');
      }
    });
  }

  /**
   * Formater la valeur d'une réduction pour l'affichage
   */
  formatReduction(r: ReductionDisponible): string {
    return r.type === 'POURCENTAGE' ? `${r.valeur}%` : `${r.valeur.toLocaleString('fr-FR')} XAF`;
  }
}