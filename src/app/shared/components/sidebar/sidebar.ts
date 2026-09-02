// src/app/shared/components/sidebar/sidebar.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService }       from '../../../core/services/auth';
import { SidebarStateService } from '../../../core/services/sidebar-state';
import { User }              from '../../../core/models/user.model';
import { Observable }        from 'rxjs';
import { IconComponent }     from '../../ui/icon/icon';

interface MenuItem {
  label:      string;
  route:      string | null;
  icon:       string;
  disabled:   boolean;
  badge?:     string | number | null;
  adminOnly?: boolean;
  action?:    () => void;
}

const ADMIN_MENU: MenuItem[] = [
  { label: 'Dashboard', route: '/dashboard', disabled: false, icon: 'dashboard' },
  { label: 'Catégories', route: '/categories', disabled: false, icon: 'tag' },
  { label: 'Comptabilité', route: '/comptabilite', disabled: false, icon: 'calculator', badge: null, adminOnly: true },
  { label: 'Livres', route: '/livres', disabled: false, icon: 'book-open' },
  { label: 'Ventes', route: '/ventes', disabled: false, icon: 'shopping-cart' },
  { label: 'Réductions', route: '/reductions', disabled: false, icon: 'tag' },
  { label: 'Stock', route: '/stock', disabled: false, icon: 'warehouse' },
  { label: 'Fournisseurs', route: '/fournisseurs', disabled: false, icon: 'truck' },
  { label: 'Commandes', route: '/commandes', disabled: false, icon: 'clipboard-list' },
  { label: 'Réservations', route: null, disabled: true, badge: 'Bientôt', icon: 'calendar-days' },
  { label: 'Rapports', route: '/rapports', disabled: false, icon: 'bar-chart-3' },
  { label: 'Utilisateurs', route: '/utilisateurs', disabled: false, icon: 'users' }
];

const VENDEUR_MENU: MenuItem[] = [
  { label: 'Dashboard', route: '/dashboard', disabled: false, icon: 'dashboard' },
  { label: 'Livres', route: '/livres', disabled: false, icon: 'book-open' },
  { label: 'Ventes', route: '/ventes', disabled: false, icon: 'shopping-cart' },
  { label: 'Réservations', route: null, disabled: true, badge: 'Bientôt', icon: 'calendar-days' },

];

@Component({
  selector:    'app-sidebar',
  standalone:  true,
  imports:     [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.html',
  styleUrl:    './sidebar.css'
})
export class SidebarComponent implements OnInit {
  currentUser:      User | null = null;
  isMobileMenuOpen  = false;
  collapsed$!:      Observable<boolean>;
  menuItems:        MenuItem[] = [];

  constructor(
    public  authService:   AuthService,
    private router:        Router,
    private sidebarState:  SidebarStateService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.collapsed$  = this.sidebarState.collapsed$;
    this.menuItems   = this.currentUser?.role === 'ADMIN' ? ADMIN_MENU : VENDEUR_MENU;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
    }
  }

  handleMenuClick(item: MenuItem): void {
    if (item.disabled) return;
    if (item.action)   { item.action(); return; }
    if (item.route)    { this.router.navigate([item.route]); this.isMobileMenuOpen = false; }
  }
}