import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RapportPeriodiqueDTO, EvolutionCADTO } from '../../models/rapport.model';

@Component({
  selector: 'app-rapport-periodique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rapport-periodique.html',
  styleUrl: './rapport-periodique.css'
})
export class RapportPeriodique implements OnChanges {

  @Input() rapport!: RapportPeriodiqueDTO;

  chartBars: { label: string; height: number; value: number }[] = [];

  ngOnChanges(): void {
    if (this.rapport?.evolutionCA7Jours?.length) {
      this.buildChart(this.rapport.evolutionCA7Jours);
    }
  }

  private buildChart(data: EvolutionCADTO[]): void {
    const max = Math.max(...data.map(d => d.chiffreAffaires), 1);
    this.chartBars = data.map(d => ({
      label: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      height: Math.round((d.chiffreAffaires / max) * 100),
      value: d.chiffreAffaires
    }));
  }

  getPeriodeLabel(): string {
    const labels: Record<string, string> = {
      HEBDOMADAIRE: 'Hebdomadaire',
      MENSUEL: 'Mensuel',
      ANNUEL: 'Annuel',
      PERSONNALISE: 'Personnalisé'
    };
    return labels[this.rapport?.periode] ?? this.rapport?.periode;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value ?? 0) + ' FCFA';
  }

  formatCurrencyShort(value: number): string {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
    return value.toString();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  getEvolutionClass(value: number): string {
    if (value > 0) return 'evolution-up';
    if (value < 0) return 'evolution-down';
    return 'evolution-flat';
  }

  getEvolutionSign(value: number): string {
    return value > 0 ? '+' : '';
  }

  getEvolutionArrow(value: number): string {
    if (value > 0) return '↑';
    if (value < 0) return '↓';
    return '→';
  }

  getRotationBadgeClass(taux: number): string {
    if (taux >= 50) return 'status-badge status-badge--success';
    if (taux >= 20) return 'status-badge status-badge--info';
    return 'status-badge status-badge--warning';
  }

  getRangClass(rang: number): string {
    if (rang === 1) return 'rang-badge rang-gold';
    if (rang === 2) return 'rang-badge rang-silver';
    if (rang === 3) return 'rang-badge rang-bronze';
    return 'rang-badge rang-default';
  }
}