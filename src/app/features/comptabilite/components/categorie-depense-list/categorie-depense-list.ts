// categorie-depense-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieDepenseService } from '../../services/categorie-depense';
import { CategorieDepenseResponse, CategorieDepenseRequest } from '../../models/comptabilite.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categorie-depense-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorie-depense-list.html'
})
export class CategorieDepenseListComponent implements OnInit {
  categories: CategorieDepenseResponse[] = [];
  loading = false;
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selected: CategorieDepenseResponse | null = null;
  modalLoading = false;
  formData: CategorieDepenseRequest = { nom: '', description: '' };

  constructor(
    private service: CategorieDepenseService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (res) => { this.categories = res.data; this.loading = false; },
      error: (err) => { this.toastr.error(err.message || 'Erreur', 'Erreur'); this.loading = false; }
    });
  }

  openCreate(): void { this.modalMode = 'create'; this.formData = { nom: '', description: '' }; this.showModal = true; }
  openEdit(c: CategorieDepenseResponse): void {
    this.modalMode = 'edit'; this.selected = c;
    this.formData = { nom: c.nom, description: c.description || '' };
    this.showModal = true;
  }
  closeModal(): void { this.showModal = false; this.selected = null; }

  onSubmit(): void {
    if (!this.formData.nom) { this.toastr.warning('Le nom est obligatoire', 'Validation'); return; }
    this.modalLoading = true;
    const req$ = this.modalMode === 'create'
      ? this.service.create(this.formData)
      : this.service.update(this.selected!.id, this.formData);
    req$.subscribe({
      next: () => { this.toastr.success('Catégorie enregistrée', 'Succès'); this.closeModal(); this.load(); this.modalLoading = false; },
      error: (err) => { this.toastr.error(err.message || 'Erreur', 'Erreur'); this.modalLoading = false; }
    });
  }

  toggle(c: CategorieDepenseResponse): void {
    this.service.toggleStatut(c.id).subscribe({
      next: () => { this.toastr.success('Statut modifié', 'Succès'); this.load(); },
      error: (err) => this.toastr.error(err.message || 'Erreur', 'Erreur')
    });
  }

  delete(c: CategorieDepenseResponse): void {
    if (!confirm(`Supprimer "${c.nom}" ?`)) return;
    this.service.delete(c.id).subscribe({
      next: () => { this.toastr.success('Catégorie supprimée', 'Succès'); this.load(); },
      error: (err) => this.toastr.error(err.message || 'Erreur', 'Erreur')
    });
  }
}