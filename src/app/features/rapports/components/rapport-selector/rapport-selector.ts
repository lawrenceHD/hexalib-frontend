import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { RapportService } from '../../services/rapport';
import { RapportJournalier } from '../rapport-journalier/rapport-journalier';
import { RapportPeriodique } from '../rapport-periodique/rapport-periodique';
import {
  TypePeriode,
  RapportJournalierDTO,
  RapportPeriodiqueDTO
} from '../../models/rapport.model';

@Component({
  selector: 'app-rapport-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, RapportJournalier, RapportPeriodique],
  templateUrl: './rapport-selector.html',
  styleUrl: './rapport-selector.css'
})
export class RapportSelector implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  typePeriode: TypePeriode = 'journalier';
  loading = false;
  downloading = false;
  error: string | null = null;

  // Données du formulaire
  selectedDate     = new Date().toISOString().split('T')[0];
  selectedDateFin  = new Date().toISOString().split('T')[0];
  selectedMois     = new Date().toISOString().substring(0, 7);
  selectedAnnee    = new Date().getFullYear();
  selectedDateDebut = new Date().toISOString().split('T')[0];
  selectedDateFinPerso = new Date().toISOString().split('T')[0];

  today = new Date().toISOString().split('T')[0];
  currentMois = new Date().toISOString().substring(0, 7);
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Résultat
  rapportJournalier: RapportJournalierDTO | null = null;
  rapportPeriodique: RapportPeriodiqueDTO | null = null;

  types: { label: string; value: TypePeriode; icon: string }[] = [
    { label: 'Journalier',    value: 'journalier',   icon: 'J' },
    { label: 'Hebdomadaire',  value: 'hebdomadaire', icon: 'H' },
    { label: 'Mensuel',       value: 'mensuel',      icon: 'M' },
    { label: 'Annuel',        value: 'annuel',       icon: 'A' },
    { label: 'Personnalisé',  value: 'personnalise', icon: 'P' }
  ];

  constructor(private rapportService: RapportService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectType(type: TypePeriode): void {
    this.typePeriode = type;
    this.rapportJournalier = null;
    this.rapportPeriodique = null;
    this.error = null;
  }

  generer(): void {
    this.loading = true;
    this.error = null;
    this.rapportJournalier = null;
    this.rapportPeriodique = null;

    if (this.typePeriode === 'journalier') {
      this.rapportService.getRapportJournalier(this.selectedDate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => { this.rapportJournalier = data; this.loading = false; },
          error: () => { this.error = 'Erreur lors de la génération.'; this.loading = false; }
        });
    } else {
      const obs$ = this.getPeriodiqueObservable();
      if (!obs$) return;
      obs$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => { this.rapportPeriodique = data; this.loading = false; },
        error: () => { this.error = 'Erreur lors de la génération.'; this.loading = false; }
      });
    }
  }

  telechargerPDF(): void {
    this.downloading = true;
    const obs$ = this.getPDFObservable();
    if (!obs$) return;

    obs$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (blob) => {
        this.rapportService.triggerDownload(blob, this.getPDFFilename());
        this.downloading = false;
      },
      error: () => { this.downloading = false; }
    });
  }

  private getPeriodiqueObservable() {
    switch (this.typePeriode) {
      case 'hebdomadaire': return this.rapportService.getRapportHebdomadaire(this.selectedDateFin);
      case 'mensuel':      return this.rapportService.getRapportMensuel(this.selectedMois + '-01');
      case 'annuel':       return this.rapportService.getRapportAnnuel(this.selectedAnnee);
      case 'personnalise': return this.rapportService.getRapportPersonnalise(this.selectedDateDebut, this.selectedDateFinPerso);
      default: return null;
    }
  }

  private getPDFObservable() {
    switch (this.typePeriode) {
      case 'journalier':   return this.rapportService.downloadRapportJournalierPDF(this.selectedDate);
      case 'hebdomadaire': return this.rapportService.downloadRapportHebdomadairePDF(this.selectedDateFin);
      case 'mensuel':      return this.rapportService.downloadRapportMensuelPDF(this.selectedMois + '-01');
      case 'annuel':       return this.rapportService.downloadRapportAnnuelPDF(this.selectedAnnee);
      case 'personnalise': return this.rapportService.downloadRapportPersonnalisePDF(this.selectedDateDebut, this.selectedDateFinPerso);
      default: return null;
    }
  }

  private getPDFFilename(): string {
    switch (this.typePeriode) {
      case 'journalier':   return `Rapport_Journalier_${this.selectedDate}.pdf`;
      case 'hebdomadaire': return `Rapport_Hebdomadaire_${this.selectedDateFin}.pdf`;
      case 'mensuel':      return `Rapport_Mensuel_${this.selectedMois}.pdf`;
      case 'annuel':       return `Rapport_Annuel_${this.selectedAnnee}.pdf`;
      case 'personnalise': return `Rapport_${this.selectedDateDebut}_${this.selectedDateFinPerso}.pdf`;
      default:             return 'rapport.pdf';
    }
  }

  get hasResult(): boolean {
    return !!(this.rapportJournalier || this.rapportPeriodique);
  }
}