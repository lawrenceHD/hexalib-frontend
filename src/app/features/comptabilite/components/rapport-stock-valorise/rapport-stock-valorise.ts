// ════════════════════════════════════════════════════
// rapport-stock-valorise.component.ts
// ════════════════════════════════════════════════════
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComptabiliteService } from '../../services/comptabilite';
import { RapportStockValoriseDTO } from '../../models/comptabilite.model';
import { ToastrService } from 'ngx-toastr';
 
@Component({
  selector: 'app-rapport-stock-valorise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rapport-stock-valorise.html'
})
export class RapportStockValoriseComponent implements OnInit {
  rapport: RapportStockValoriseDTO | null = null;
  loading = false;
 
  constructor(private service: ComptabiliteService, private toastr: ToastrService) {}
  ngOnInit(): void { this.loadRapport(); }
 
  loadRapport(): void {
    this.loading = true;
    this.service.getStockValorise().subscribe({
      next: (res) => { this.rapport = res.data; this.loading = false; },
      error: (err) => { this.toastr.error(err.message || 'Erreur', 'Erreur'); this.loading = false; }
    });
  }
}