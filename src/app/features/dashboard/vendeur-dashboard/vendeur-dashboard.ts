// src/app/features/dashboard/vendeur-dashboard/vendeur-dashboard.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { AuthService }       from '../../../core/services/auth';
import { HttpClient }        from '@angular/common/http';
import { environment }       from '../../../../environments/environment';
import { User }              from '../../../core/models/user.model';

interface DashboardVendeur {
  mesVentesJour:             number;
  monCAJour:                 number;
  mesVentesMois:             number;
  monCAMois:                 number;
  nombreLivresStockCritique: number;
  mesMeilleuresVentes:       TopLivre[];
}

interface TopLivre {
  livreId:         string;
  titre:           string;
  auteur:          string;
  categorie:       string;
  quantiteVendue:  number;
  chiffreAffaires: number;
  rang:            number;
}

@Component({
  selector:    'app-vendeur-dashboard',
  standalone:  true,
  imports:     [CommonModule, RouterModule],
  templateUrl: './vendeur-dashboard.html',
  styleUrl:    './vendeur-dashboard.css'
})
export class VendeurDashboardComponent implements OnInit {
  currentUser: User | null = null;
  dashboard:   DashboardVendeur | null = null;
  loading      = true;
  errorMsg     = '';
  today        = new Date();

  private readonly apiUrl = `${environment.apiUrl}/rapports`;

  constructor(
    private authService: AuthService,
    private http:        HttpClient
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading  = true;
    this.errorMsg = '';

    this.http.get<any>(`${this.apiUrl}/dashboard/vendeur`).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.dashboard = res.data;
        } else {
          // Réponse OK mais données manquantes → dashboard vide par défaut
          this.dashboard = this.emptyDashboard();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('[VendeurDashboard] Erreur chargement:', err);
        // Ne pas bloquer l'UI — afficher un dashboard vide avec message
        this.dashboard = this.emptyDashboard();
        this.errorMsg  = err?.message || 'Impossible de charger les statistiques.';
        this.loading   = false;
      }
    });
  }

  private emptyDashboard(): DashboardVendeur {
    return {
      mesVentesJour:             0,
      monCAJour:                 0,
      mesVentesMois:             0,
      monCAMois:                 0,
      nombreLivresStockCritique: 0,
      mesMeilleuresVentes:       []
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style:                 'currency',
      currency:              'XAF',
      maximumFractionDigits: 0
    }).format(value ?? 0);
  }
}