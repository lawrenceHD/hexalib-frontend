// ════════════════════════════════════════════════════
// rapport-tresorerie.component.ts
// ════════════════════════════════════════════════════
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComptabiliteService } from '../../services/comptabilite';
import { RapportTresorerieDTO } from '../../models/comptabilite.model';
import { ToastrService } from 'ngx-toastr';
 
@Component({
  selector: 'app-rapport-tresorerie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rapport-tresorerie.html'
})
export class RapportTresorerieComponent implements OnInit {
  rapport: RapportTresorerieDTO | null = null;
  loading = false;
  debut = this.getFirstDayOfMonth();
  fin   = this.getToday();
 
  constructor(private service: ComptabiliteService, private toastr: ToastrService) {}
  ngOnInit(): void { this.generer(); }
 
  generer(): void {
    this.loading = true;
    this.service.getTresorerie(this.debut, this.fin).subscribe({
      next: (res) => { this.rapport = res.data; this.loading = false; },
      error: (err) => { this.toastr.error(err.message || 'Erreur', 'Erreur'); this.loading = false; }
    });
  }
 
  private getFirstDayOfMonth(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  }
  private getToday(): string { return new Date().toISOString().slice(0, 10); }
}
 