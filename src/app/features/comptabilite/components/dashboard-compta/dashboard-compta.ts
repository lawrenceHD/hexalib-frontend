import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComptabiliteService } from '../../services/comptabilite';
import { DashboardComptaDTO, DepenseParCategorie } from '../../models/comptabilite.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-compta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard-compta.html'
})
export class DashboardComptaComponent implements OnInit {
  dashboard: DashboardComptaDTO | null = null;
  loading = false;

  // Filtres période
  debut = this.getFirstDayOfMonth();
  fin   = this.getToday();

  constructor(
    private comptabiliteService: ComptabiliteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.comptabiliteService.getDashboard(this.debut, this.fin).subscribe({
      next: (res) => {
        this.dashboard = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.message || 'Erreur chargement dashboard', 'Erreur');
        this.loading = false;
      }
    });
  }

  onPeriodeChange(): void {
    this.loadDashboard();
  }

  // Barre de progression pour les catégories
  getBarWidth(pct: number): string {
    return Math.min(pct, 100).toFixed(1) + '%';
  }

  // Couleur selon solde
  getSoldeClass(): string {
    if (!this.dashboard) return 'text-gray-600';
    return this.dashboard.soldeNet >= 0 ? 'text-green-600' : 'text-red-600';
  }

  private getFirstDayOfMonth(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  }

  private getToday(): string {
    return new Date().toISOString().slice(0, 10);
  }
}