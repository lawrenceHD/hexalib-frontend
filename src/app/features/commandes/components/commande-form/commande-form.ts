// src/app/features/commandes/components/commande-form/commande-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommandeService } from '../../services/commande';
import { FournisseurService } from '../../../fournisseurs/services/fournisseur';
import { LivreService } from '../../../livres/services/livre';
import { CommandeFournisseur, LigneCommandeRequest } from '../../models/commande.model';
import { Fournisseur } from '../../../fournisseurs/models/fournisseur.model';
import { Livre } from '../../../livres/models/livre.model';

interface LigneCommandeForm {
  livre: Livre | null;
  quantite: number;
  prixAchatUnitaire: number;
  sousTotal: number;
}

@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-form.html',
  styleUrl: './commande-form.css'
})
export class CommandeFormComponent implements OnInit {
  mode: 'create' | 'edit' = 'create';
  commandeId: string | null = null;
  loading = false;

  fournisseurs: Fournisseur[] = [];
  livres: Livre[] = [];
  livresFiltres: Livre[] = [];
  searchLivre = '';

  // Formulaire
  formData = {
    fournisseurId: '',
    dateCommande: '',
    dateReceptionPrevue: '',
    notes: ''
  };

  lignes: LigneCommandeForm[] = [];

  // Modal ajout ligne
  showAddLigneModal = false;
  ligneTemp: LigneCommandeForm = this.initLigneTemp();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commandeService: CommandeService,
    private fournisseurService: FournisseurService,
    private livreService: LivreService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Vérifier le mode (création ou édition)
    this.commandeId = this.route.snapshot.paramMap.get('id');
    this.mode = this.commandeId ? 'edit' : 'create';

    // Initialiser la date de commande à aujourd'hui
    this.formData.dateCommande = this.formatDateForInput(new Date());

    this.loadFournisseurs();
    this.loadLivres();

    if (this.mode === 'edit' && this.commandeId) {
      this.loadCommande(this.commandeId);
    }
  }

  initLigneTemp(): LigneCommandeForm {
    return {
      livre: null,
      quantite: 1,
      prixAchatUnitaire: 0,
      sousTotal: 0
    };
  }

  loadFournisseurs(): void {
    this.fournisseurService.getAllFournisseursActifs().subscribe({
      next: (response) => {
        if (response.success) {
          this.fournisseurs = response.data;
        }
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des fournisseurs', 'Erreur');
      }
    });
  }

  loadLivres(): void {
    this.livreService.getAllLivres(0, 1000).subscribe({
      next: (response) => {
        if (response.success) {
          this.livres = response.data.content;
          this.livresFiltres = this.livres;
        }
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des livres', 'Erreur');
      }
    });
  }

  loadCommande(id: string): void {
    this.loading = true;
    this.commandeService.getCommandeById(id).subscribe({
      next: (response) => {
        if (response.success) {
          const commande = response.data;
          
          this.formData = {
            fournisseurId: commande.fournisseur.id,
            dateCommande: this.formatDateForInput(new Date(commande.dateCommande)),
            dateReceptionPrevue: commande.dateReceptionPrevue 
              ? this.formatDateForInput(new Date(commande.dateReceptionPrevue)) 
              : '',
            notes: commande.notes || ''
          };

          // Charger les lignes
          this.lignes = commande.lignes.map(ligne => {
            const livre = this.livres.find(l => l.id === ligne.livreId);
            return {
              livre: livre || null,
              quantite: ligne.quantite,
              prixAchatUnitaire: ligne.prixAchatUnitaire,
              sousTotal: ligne.sousTotal
            };
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors du chargement', 'Erreur');
        this.loading = false;
        this.router.navigate(['/commandes']);
      }
    });
  }

  onSearchLivre(): void {
    const search = this.searchLivre.toLowerCase().trim();
    if (!search) {
      this.livresFiltres = this.livres;
    } else {
      this.livresFiltres = this.livres.filter(livre =>
        livre.titre.toLowerCase().includes(search) ||
        livre.auteur.toLowerCase().includes(search) ||
        livre.code.toLowerCase().includes(search)
      );
    }
  }

  openAddLigneModal(): void {
    this.ligneTemp = this.initLigneTemp();
    this.searchLivre = '';
    this.livresFiltres = this.livres;
    this.showAddLigneModal = true;
  }

  closeAddLigneModal(): void {
    this.showAddLigneModal = false;
    this.ligneTemp = this.initLigneTemp();
  }

  selectLivre(livre: Livre): void {
    this.ligneTemp.livre = livre;
    // Pré-remplir le prix d'achat si disponible
    if (livre.prixAchat) {
      this.ligneTemp.prixAchatUnitaire = livre.prixAchat;
      this.calculateLigneSousTotal();
    }
  }

  calculateLigneSousTotal(): void {
    this.ligneTemp.sousTotal = this.ligneTemp.quantite * this.ligneTemp.prixAchatUnitaire;
  }

  addLigne(): void {
    if (!this.ligneTemp.livre) {
      this.toastr.warning('Veuillez sélectionner un livre', 'Validation');
      return;
    }
    if (this.ligneTemp.quantite <= 0) {
      this.toastr.warning('La quantité doit être supérieure à 0', 'Validation');
      return;
    }
    if (this.ligneTemp.prixAchatUnitaire <= 0) {
      this.toastr.warning('Le prix d\'achat doit être supérieur à 0', 'Validation');
      return;
    }

    // Vérifier si le livre n'est pas déjà dans la liste
    const existe = this.lignes.some(l => l.livre?.id === this.ligneTemp.livre?.id);
    if (existe) {
      this.toastr.warning('Ce livre est déjà dans la commande', 'Validation');
      return;
    }

    this.lignes.push({ ...this.ligneTemp });
    this.closeAddLigneModal();
    this.toastr.success('Livre ajouté à la commande', 'Succès');
  }

  removeLigne(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir retirer cet article ?')) {
      this.lignes.splice(index, 1);
    }
  }

  updateLigneQuantite(ligne: LigneCommandeForm): void {
    if (ligne.quantite <= 0) {
      ligne.quantite = 1;
    }
    ligne.sousTotal = ligne.quantite * ligne.prixAchatUnitaire;
  }

  updateLignePrix(ligne: LigneCommandeForm): void {
    if (ligne.prixAchatUnitaire < 0) {
      ligne.prixAchatUnitaire = 0;
    }
    ligne.sousTotal = ligne.quantite * ligne.prixAchatUnitaire;
  }

  getMontantTotal(): number {
    return this.lignes.reduce((sum, ligne) => sum + ligne.sousTotal, 0);
  }

  onSubmit(): void {
    // Validation
    if (!this.formData.fournisseurId) {
      this.toastr.warning('Veuillez sélectionner un fournisseur', 'Validation');
      return;
    }
    if (!this.formData.dateCommande) {
      this.toastr.warning('La date de commande est obligatoire', 'Validation');
      return;
    }
    if (this.lignes.length === 0) {
      this.toastr.warning('Ajoutez au moins un livre à la commande', 'Validation');
      return;
    }

    // Préparer les données
    const lignesRequest: LigneCommandeRequest[] = this.lignes.map(ligne => ({
      livreId: ligne.livre!.id,
      quantite: ligne.quantite,
      prixAchatUnitaire: ligne.prixAchatUnitaire
    }));

    const request = {
      fournisseurId: this.formData.fournisseurId,
      dateCommande: this.formData.dateCommande,
      dateReceptionPrevue: this.formData.dateReceptionPrevue || undefined,
      notes: this.formData.notes || undefined,
      lignes: lignesRequest
    };

    this.loading = true;

    if (this.mode === 'create') {
      this.commandeService.createCommande(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Commande créée avec succès', 'Succès');
            this.router.navigate(['/commandes', response.data.id]);
          }
          this.loading = false;
        },
        error: (error) => {
          this.toastr.error(error.message || 'Erreur lors de la création', 'Erreur');
          this.loading = false;
        }
      });
    } else if (this.commandeId) {
      this.commandeService.updateCommande(this.commandeId, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Commande modifiée avec succès', 'Succès');
            this.router.navigate(['/commandes', response.data.id]);
          }
          this.loading = false;
        },
        error: (error) => {
          this.toastr.error(error.message || 'Erreur lors de la modification', 'Erreur');
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Les modifications seront perdues.')) {
      this.router.navigate(['/commandes']);
    }
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get totalQuantite(): number {
  return this.lignes?.reduce((sum, ligne) => sum + (ligne.quantite || 0), 0) ?? 0;
}
}