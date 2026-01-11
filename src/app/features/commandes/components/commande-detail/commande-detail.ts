// src/app/features/commandes/components/commande-detail/commande-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CommandeService } from '../../services/commande';
import { CommandeFournisseur } from '../../models/commande.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-commande-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commande-detail.html',
  styleUrl: './commande-detail.css'
})
export class CommandeDetailComponent implements OnInit {
  commande: CommandeFournisseur | null = null;
  loading = false;
  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commandeService: CommandeService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCommande(id);
      this.loadPdfPreview(id);
    }
  }

  loadCommande(id: string): void {
    this.loading = true;
    this.commandeService.getCommandeById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.commande = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors du chargement', 'Erreur');
        this.loading = false;
        this.router.navigate(['/commandes']);
      }
    });
  }

  loadPdfPreview(id: string): void {
    const url = this.commandeService.getPdfPreviewUrl(id);
    const token = localStorage.getItem('token'); // Ajuster selon votre système d'auth
    
    // Ajouter le token dans l'URL ou utiliser un iframe avec credentials
    const urlWithAuth = `${url}?token=${token}`;
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlWithAuth);
  }

  downloadPdf(): void {
    if (!this.commande) return;
    
    this.commandeService.downloadPdf(this.commande.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Commande_${this.commande!.numeroCommande}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('PDF téléchargé avec succès', 'Succès');
      },
      error: (error) => {
        this.toastr.error('Erreur lors du téléchargement du PDF', 'Erreur');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/commandes']);
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'bg-orange-500/20 text-orange-700';
      case 'RECUE':
        return 'bg-green-500/20 text-green-700';
      case 'ANNULEE':
        return 'bg-red-500/20 text-red-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'EN ATTENTE';
      case 'RECUE':
        return 'REÇUE';
      case 'ANNULEE':
        return 'ANNULÉE';
      default:
        return statut;
    }
  }
}