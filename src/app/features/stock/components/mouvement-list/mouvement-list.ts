import { Component, OnInit } from '@angular/core';
import { MouvementStockService } from '../../services/mouvement-stock';
import { LivreService } from '../../../livres/services/livre';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  MouvementStockResponse, 
  MouvementStockRequest, 
  TypeMouvement 
} from '../../models/mouvement-stock.model';

@Component({
  selector: 'app-mouvement-list',
  templateUrl: './mouvement-list.html',
   imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./mouvement-list.css']
})
export class MouvementListComponent implements OnInit {
  mouvements: MouvementStockResponse[] = [];
  loading = false;

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Filtres
  selectedType: TypeMouvement | '' = '';
  selectedLivreId = '';

  // Enum pour le template
  TypeMouvement = TypeMouvement;

  // Modal ajustement
  showModal = false;
  modalLoading = false;

  // Livres pour le select
  livres: any[] = [];

  // Form data
  formData: MouvementStockRequest = {
    livreId: '',
    typeMouvement: TypeMouvement.AJUSTEMENT,
    quantite: 0,
    motif: '',
    reference: ''
  };

  constructor(
    private mouvementStockService: MouvementStockService,
    private livreService: LivreService
  ) {}

  ngOnInit(): void {
    this.loadMouvements();
    this.loadLivres();
  }

  /**
   * Charger les mouvements
   */
  loadMouvements(): void {
    this.loading = true;

    let request$;
    if (this.selectedType || this.selectedLivreId) {
      request$ = this.mouvementStockService.search(
        this.selectedLivreId || undefined,
        this.selectedType || undefined,
        undefined,
        undefined,
        undefined,
        this.currentPage,
        this.pageSize
      );
    } else {
      request$ = this.mouvementStockService.getAll(this.currentPage, this.pageSize);
    }

    request$.subscribe({
      next: (response) => {
        this.mouvements = response.data.content;
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
   * Charger les livres
   */
  loadLivres(): void {
    this.livreService.getAllLivres(0, 100, '', '', 'ACTIF', '').subscribe({
      next: (response) => {
        this.livres = response.data.content;
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Changer de filtre
   */
  onFilterChange(): void {
    this.currentPage = 0;
    this.loadMouvements();
  }

  /**
   * Reset filtres
   */
  resetFilters(): void {
    this.selectedType = '';
    this.selectedLivreId = '';
    this.currentPage = 0;
    this.loadMouvements();
  }

  /**
   * Pagination
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMouvements();
  }

  /**
   * Ouvrir modal ajustement
   */
  openAjustementModal(): void {
    this.formData = {
      livreId: '',
      typeMouvement: TypeMouvement.AJUSTEMENT,
      quantite: 0,
      motif: '',
      reference: ''
    };
    this.showModal = true;
  }

  /**
   * Fermer modal
   */
  closeModal(): void {
    this.showModal = false;
  }

  /**
   * Soumettre le formulaire
   */
  onSubmit(): void {
    if (!this.formData.livreId || !this.formData.quantite) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.modalLoading = true;

    this.mouvementStockService.create(this.formData).subscribe({
      next: () => {
        alert('Mouvement de stock créé avec succès');
        this.closeModal();
        this.loadMouvements();
        this.modalLoading = false;
      },
      error: (err) => {
        console.error(err);
        const message = err.error?.message || 'Erreur lors de l\'enregistrement';
        alert(message);
        this.modalLoading = false;
      }
    });
  }

  /**
   * Obtenir le label du type
   */
  getTypeLabel(type: TypeMouvement): string {
    const labels = {
      [TypeMouvement.ENTREE]: 'Entrée',
      [TypeMouvement.SORTIE]: 'Sortie',
      [TypeMouvement.AJUSTEMENT]: 'Ajustement',
      [TypeMouvement.RETOUR]: 'Retour'
    };
    return labels[type] || type;
  }

  /**
   * Obtenir la couleur du type
   */
  getTypeColor(type: TypeMouvement): string {
    const colors = {
      [TypeMouvement.ENTREE]: 'bg-green-500/20 text-green-700',
      [TypeMouvement.SORTIE]: 'bg-red-500/20 text-red-700',
      [TypeMouvement.AJUSTEMENT]: 'bg-blue-500/20 text-blue-700',
      [TypeMouvement.RETOUR]: 'bg-orange-500/20 text-orange-700'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-700';
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