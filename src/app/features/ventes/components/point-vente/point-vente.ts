import { Component, OnInit } from '@angular/core';
import { VenteService } from '../../services/vente';
import { LivreService } from '../../../livres/services/livre';
import { ReductionService } from '../../../reductions/services/reduction';
import { LignePanier, VenteRequest, LigneVenteRequest } from '../../models/vente.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';      // ← pour pipes (number, date, etc.) + *ngIf, *ngFor
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-point-vente',
  imports: [
    CommonModule,     // Résout les pipes + directives de base
    FormsModule       // Résout ngModel
  ],
  templateUrl: './point-vente.html',
  styleUrls: ['./point-vente.css']
})
export class PointVenteComponent implements OnInit {
  // Recherche de livres
  searchTerm = '';
  livresDisponibles: any[] = [];
  loadingLivres = false;

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLivresDisponibles();
  }

  /**
   * Charger les livres disponibles
   */
  loadLivresDisponibles(): void {
    this.loadingLivres = true;
    this.livreService.getAllLivres(0, 100, this.searchTerm, '', 'ACTIF', '').subscribe({
      next: (response) => {
        this.livresDisponibles = response.data.content.filter(l => l.quantiteStock > 0);
        this.loadingLivres = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingLivres = false;
      }
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
    // Vérifier si le livre est déjà dans le panier
    const existant = this.panier.find(l => l.livre.id === livre.id);
    
    if (existant) {
      // Vérifier le stock
      if (existant.quantite + 1 > livre.quantiteStock) {
        alert(`Stock insuffisant. Disponible: ${livre.quantiteStock}`);
        return;
      }
      existant.quantite++;
    } else {
      // Ajouter au panier
      const ligne: LignePanier = {
        livre: livre,
        quantite: 1,
        prixUnitaire: livre.prixVente,
        montantReduction: 0,
        sousTotal: livre.prixVente
      };
      this.panier.push(ligne);
    }

    // Charger et appliquer la réduction
    this.appliquerReduction(this.panier[this.panier.length - 1] || existant!);
    
    this.calculerTotaux();
  }

  /**
   * Appliquer la meilleure réduction à une ligne
   */
  appliquerReduction(ligne: LignePanier): void {
    this.reductionService.getBestForLivre(ligne.livre.id).subscribe({
      next: (response) => {
        if (response.data) {
          const reduction = response.data;
          const montantBase = ligne.prixUnitaire * ligne.quantite;
          
          if (reduction.type === 'POURCENTAGE') {
            ligne.montantReduction = (montantBase * reduction.valeur) / 100;
          } else {
            ligne.montantReduction = reduction.valeur;
          }
          
          ligne.reductionAppliquee = reduction;
          ligne.sousTotal = montantBase - ligne.montantReduction;
        } else {
          ligne.montantReduction = 0;
          ligne.sousTotal = ligne.prixUnitaire * ligne.quantite;
        }
        this.calculerTotaux();
      },
      error: () => {
        ligne.montantReduction = 0;
        ligne.sousTotal = ligne.prixUnitaire * ligne.quantite;
        this.calculerTotaux();
      }
    });
  }

  /**
   * Modifier la quantité d'une ligne
   */
  modifierQuantite(ligne: LignePanier, nouvelleQuantite: number): void {
    if (nouvelleQuantite < 1) {
      return;
    }

    if (nouvelleQuantite > ligne.livre.quantiteStock) {
      alert(`Stock insuffisant. Disponible: ${ligne.livre.quantiteStock}`);
      return;
    }

    ligne.quantite = nouvelleQuantite;
    this.appliquerReduction(ligne);
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
   * Calculer les totaux
   */
  calculerTotaux(): void {
    this.totalHT = this.panier.reduce((sum, ligne) => 
      sum + (ligne.prixUnitaire * ligne.quantite), 0);
    
    this.totalReductions = this.panier.reduce((sum, ligne) => 
      sum + ligne.montantReduction, 0);
    
    this.totalTTC = this.totalHT - this.totalReductions;
  }

  /**
   * Valider la vente
   */
  validerVente(): void {
    if (this.panier.length === 0) {
      alert('Le panier est vide');
      return;
    }

    if (confirm(`Confirmer la vente de ${this.totalTTC} XAF ?`)) {
      this.processing = true;

      const request: VenteRequest = {
        lignes: this.panier.map(ligne => ({
          livreId: ligne.livre.id,
          quantite: ligne.quantite
        }))
      };

      this.venteService.create(request).subscribe({
        next: (response) => {
          alert('Vente enregistrée avec succès !');
          const venteId = response.data.id;
          
          // Télécharger la facture
          this.telechargerFacture(venteId);
          
          // Réinitialiser
          this.panier = [];
          this.calculerTotaux();
          this.loadLivresDisponibles();
          this.processing = false;
        },
        error: (err) => {
          console.error(err);
          const message = err.error?.message || 'Erreur lors de la vente';
          alert(message);
          this.processing = false;
        }
      });
    }
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
      error: (err) => {
        console.error('Erreur téléchargement facture', err);
      }
    });
  }
}