import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { SidebarStateService } from '../../../core/services/sidebar-state';
import { User } from '../../../core/models/user.model';
import { Observable } from 'rxjs';

interface MenuItem {
  label: string;
  route: string | null;
  icon: string;
  disabled: boolean;
  badge?: string | number | null;
  adminOnly?: boolean;
  action?: () => void;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  isMobileMenuOpen = false;
  isDesktopMenuOpen = true;

  collapsed$!: Observable<boolean>;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', disabled: false, badge: null },
    { label: 'Catégories', route: '/categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', disabled: false, badge: null },
    { label: 'Livres', route: '/livres', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', disabled: false, badge: null },
    { label: 'Fournisseurs', route: '/fournisseurs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', disabled: false, badge: null, adminOnly: true },
    { label: 'Commandes', route: '/commandes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', disabled: false, badge: null, adminOnly: true },
    { label: 'Ventes', route: '/ventes', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', disabled: false, badge: null },
    {
      label: 'Réductions',
      route: '/reductions',
      icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
      disabled: false,
      badge: null
    },
    {
      label: 'Stock',
      route: '/stock',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      disabled: false,
      badge: null
    },
    {
      label: 'Réservations',
      route: '/reservations',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      disabled: true,
      badge: null
    },
    {
      label: 'Rapports',
      route: '/rapports',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      disabled: false,
      badge: null,
      adminOnly: true
    }
  ];
    // ... les autres items restent identiques
 

  get filteredMenuItems(): MenuItem[] {
    if (!this.currentUser) return [];
    return this.menuItems.filter(item => {
      if (item.adminOnly && this.currentUser?.role !== 'ADMIN') return false;
      return true;
    });
  }

  constructor(
    public authService: AuthService,
    private router: Router,
    private sidebarState: SidebarStateService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.collapsed$ = this.sidebarState.collapsed$;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnexion ?')) {
      this.authService.logout();
    }
  }

  handleMenuClick(item: MenuItem): void {
    if (item.disabled) return;

    if (item.action) {
      item.action();
    } else if (item.route) {
      this.router.navigate([item.route]);
      this.isMobileMenuOpen = false;
    }
  }
}