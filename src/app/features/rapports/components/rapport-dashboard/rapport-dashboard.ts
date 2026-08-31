import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { RapportService } from '../../services/rapport';
import { DashboardAdminDTO, EvolutionCADTO } from '../../models/rapport.model';

@Component({
  selector: 'app-rapport-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rapport-dashboard.html',
  styleUrl: './rapport-dashboard.css'
})
export class RapportDashboard implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  dashboard: DashboardAdminDTO | null = null;
  loading = false;
  error: string | null = null;

  chartBars: { label: string; height: number; value: number; ventes: number }[] = [];

  constructor(private rapportService: RapportService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;

    this.rapportService.getDashboardAdmin()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboard = data;
          this.loading = false;
          if (data.evolutionCA7Jours?.length) {
            this.buildChart(data.evolutionCA7Jours);
          }
        },
        error: () => {
          this.error = 'Impossible de charger le tableau de bord.';
          this.loading = false;
        }
      });
  }

  private buildChart(data: EvolutionCADTO[]): void {
    const max = Math.max(...data.map(d => d.chiffreAffaires), 1);
    this.chartBars = data.map(d => ({
      label: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      height: Math.round((d.chiffreAffaires / max) * 100),
      value: d.chiffreAffaires,
      ventes: d.nombreVentes
    }));
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value ?? 0) + ' FCFA';
  }

  formatCurrencyShort(value: number): string {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
    return value.toString();
  }

  getRangClass(rang: number): string {
    if (rang === 1) return 'rang-badge rang-gold';
    if (rang === 2) return 'rang-badge rang-silver';
    if (rang === 3) return 'rang-badge rang-bronze';
    return 'rang-badge rang-default';
  }

  getStockBadgeClass(statut: string): string {
    return statut === 'RUPTURE'
      ? 'status-badge status-badge--danger'
      : 'status-badge status-badge--warning';
  }
}