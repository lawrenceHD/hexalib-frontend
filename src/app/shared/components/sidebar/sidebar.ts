import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { SidebarStateService } from '../../../core/services/sidebar-state';
import { User } from '../../../core/models/user.model';
import { Observable } from 'rxjs';

interface MenuItem {
  label: string;
  route?: string;
  icon: string;
  badge?: string;
  disabled?: boolean;
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

  // On expose l'observable directement depuis le service injecté
  // Plus besoin de le stocker dans une propriété locale → évite l'erreur d'initialisation
  collapsed$!: Observable<boolean>;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      label: 'Catégories',
      route: '/categories',
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
    },
    {
      label: 'Livres',
      route: '/livres',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
     
    },
    {
      label: 'Ventes',
      route: '/ventes',
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      badge: 'Bientôt',
      disabled: true
    },
    {
      label: 'Rapports',
      route: '/rapports',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      badge: 'Bientôt',
      disabled: true
    },
    {
      label: 'Paramètres',
      route: '/settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      badge: 'Bientôt',
      disabled: true
    }
  ];

  // Services injectés correctement
  constructor(
    public authService: AuthService,
    private router: Router,
    private sidebarState: SidebarStateService  // private ou public selon besoin
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    // On assigne l'observable ici → plus d'accès prématuré
    this.collapsed$ = this.sidebarState.collapsed$;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleSidebar(): void {
    this.sidebarState.toggle();
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
    }
  }

  handleMenuClick(item: MenuItem): void {
    if (item.disabled) return;

    if (item.action) {
      item.action();
    } else if (item.route) {
      this.router.navigate([item.route]);
      this.isMobileMenuOpen = false; // Ferme le menu mobile après navigation
    }
  }
}