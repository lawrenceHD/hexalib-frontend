import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RapportJournalierDTO } from '../../models/rapport.model';

@Component({
  selector: 'app-rapport-journalier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rapport-journalier.html',
  styleUrl: './rapport-journalier.css'
})
export class RapportJournalier {

  @Input() rapport!: RapportJournalierDTO;

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value ?? 0) + ' FCFA';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
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