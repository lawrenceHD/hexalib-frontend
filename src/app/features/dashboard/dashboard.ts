import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { SidebarStateService } from '../../core/services/sidebar-state';
import { User } from '../../core/models/user.model';
import { Observable } from 'rxjs';

interface StatCard {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  change: string;
  changeType: 'up' | 'down';
}

interface ChartDataPoint {
  month: string;
  online: number;
  store: number;
}

interface RecentActivity {
  time: string;
  title: string;
  subtitle: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  today = new Date();

  // Services injectés correctement comme propriétés de classe
  private readonly authService: AuthService;
  private readonly sidebarState: SidebarStateService;

  // Observable pour l'état du sidebar
  collapsed$!: Observable<boolean>;

  // Valeur maximale du graphique (initialisée avec une valeur sûre)
  maxChartValue: number = 1;

  stats: StatCard[] = [
    {
      title: '178+',
      subtitle: 'Produits Sauvegardés',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      gradient: 'from-purple-500 to-purple-600',
      change: '+8%',
      changeType: 'up'
    },
    {
      title: '20+',
      subtitle: 'Produits en Stock',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      gradient: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'up'
    },
    {
      title: '190+',
      subtitle: 'Ventes de Produits',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      gradient: 'from-red-500 to-pink-600',
      change: '+5%',
      changeType: 'up'
    },
    {
      title: '12+',
      subtitle: 'Nouvelles Commandes',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      gradient: 'from-orange-500 to-yellow-500',
      change: '+3%',
      changeType: 'up'
    }
  ];

  chartData: ChartDataPoint[] = [
    { month: 'Jan', online: 25, store: 20 },
    { month: 'Fév', online: 30, store: 25 },
    { month: 'Mar', online: 20, store: 30 },
    { month: 'Avr', online: 40, store: 35 },
    { month: 'Mai', online: 35, store: 30 },
    { month: 'Juin', online: 30, store: 35 }
  ];

  recentActivities: RecentActivity[] = [
    {
      time: 'Il y a 40 min',
      title: 'Tâche Mise à Jour',
      subtitle: 'Admin a mis à jour une tâche',
      color: 'bg-pink-500'
    },
    {
      time: 'Il y a 1 jour',
      title: 'Deal Ajouté',
      subtitle: 'Damla a ajouté une tâche',
      color: 'bg-purple-500'
    },
    {
      time: 'Il y a 3 min',
      title: 'Article Publié',
      subtitle: 'Cemil a mis à jour un article',
      color: 'bg-blue-500'
    }
  ];

  constructor(authService: AuthService, sidebarState: SidebarStateService) {
    // Assignation manuelle pour satisfaire strictPropertyInitialization
    this.authService = authService;
    this.sidebarState = sidebarState;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    // Abonnement à l'observable du sidebar
    this.collapsed$ = this.sidebarState.collapsed$;

    // Calcul du max pour le graphique
    const values = this.chartData.flatMap(d => [d.online, d.store]);
    this.maxChartValue = values.length > 0 ? Math.max(...values) : 1;
  }

  getBarHeight(value: number): number {
    return (value / this.maxChartValue) * 100;
  }
}