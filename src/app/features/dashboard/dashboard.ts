// src/app/features/dashboard/dashboard.ts
// Ce composant redirige vers le bon dashboard selon le rôle

import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { AuthService }       from '../../core/services/auth';
import { RapportDashboard }  from '../rapports/components/rapport-dashboard/rapport-dashboard';
import { VendeurDashboardComponent } from './vendeur-dashboard/vendeur-dashboard';

@Component({
  selector:   'app-dashboard',
  standalone: true,
  imports:    [CommonModule, RapportDashboard, VendeurDashboardComponent],
  template:   `
    <app-rapport-dashboard    *ngIf="isAdmin"></app-rapport-dashboard>
    <app-vendeur-dashboard    *ngIf="!isAdmin"></app-vendeur-dashboard>
  `
})
export class DashboardComponent implements OnInit {
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }
}