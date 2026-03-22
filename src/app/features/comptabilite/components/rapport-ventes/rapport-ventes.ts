// rapport-ventes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComptabiliteService } from '../../services/comptabilite';
import { RapportVentesDTO, TypeRapportVentes } from '../../models/comptabilite.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rapport-ventes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rapport-ventes.html'
})
export class RapportVentesComponent implements OnInit {
  rapport: RapportVentesDTO | null = null;
  loading = false;

  debut       = this.getFirstDayOfMonth();
  fin         = this.getToday();
  typeRapport: TypeRapportVentes = 'COMBINE';

  constructor(
    private comptabiliteService: ComptabiliteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void { this.generer(); }

  generer(): void {
    this.loading = true;
    this.comptabiliteService.getRapportVentes(this.debut, this.fin, this.typeRapport).subscribe({
      next: (res) => { this.rapport = res.data; this.loading = false; },
      error: (err) => { this.toastr.error(err.message || 'Erreur', 'Erreur'); this.loading = false; }
    });
  }

  getTypeLabel(): string {
    const labels: Record<TypeRapportVentes, string> = {
      'COMBINE': 'Rapport Combiné',
      'AVEC_REDUCTION': 'Ventes avec Réductions',
      'SANS_REDUCTION': 'Ventes sans Réduction'
    };
    return labels[this.typeRapport];
  }

  private getFirstDayOfMonth(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  }
  private getToday(): string { return new Date().toISOString().slice(0, 10); }
}