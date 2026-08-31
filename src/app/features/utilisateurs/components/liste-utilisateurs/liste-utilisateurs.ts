// src/app/features/utilisateurs/components/liste-utilisateurs/liste-utilisateurs.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { RouterModule }    from '@angular/router';
import { ToastrService }   from 'ngx-toastr';
import { Subject }         from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { UserService }     from '../../services/user';
import { User, UserPage }  from '../../../../core/models/user.model';
import { FormulaireUtilisateurComponent } from '../formulaire-utilisateur/formulaire-utilisateur';

@Component({
  selector:    'app-liste-utilisateurs',
  standalone:  true,
  imports:     [CommonModule, FormsModule, RouterModule, FormulaireUtilisateurComponent],
  templateUrl: './liste-utilisateurs.html',
  styleUrl:    './liste-utilisateurs.css'
})
export class ListeUtilisateursComponent implements OnInit, OnDestroy {

  users:       User[]  = [];
  loading      = false;
  totalUsers   = 0;
  totalPages   = 0;

  // Filtres
  search  = '';
  role    = '';
  statut  = '';
  page    = 0;
  size    = 10;

  // Modal formulaire
  showModal     = false;
  selectedUser: User | null = null;

  // Modal confirmation
  showConfirm   = false;
  userToDelete: User | null = null;
  confirmLoading = false;

  // Mot de passe temporaire après reset
  tempPassword:  string | null = null;
  showTempPwd    = false;

  private destroy$     = new Subject<void>();
  private searchInput$ = new Subject<string>();

  constructor(
    private userService: UserService,
    private toastr:      ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    // Debounce recherche
    this.searchInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 0;
      this.loadUsers();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers({
      page:   this.page,
      size:   this.size,
      search: this.search || undefined,
      role:   this.role   || undefined,
      statut: this.statut || undefined
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.users      = res.data.users;
          this.totalUsers = res.data.total;
          this.totalPages = res.data.totalPages;
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearchChange(value: string): void {
    this.search = value;
    this.searchInput$.next(value);
  }

  onFilterChange(): void {
    this.page = 0;
    this.loadUsers();
  }

  // ── Pages ────────────────────────────────────────────────────────────────

  goToPage(p: number): void {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.loadUsers();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  // ── Modal formulaire ──────────────────────────────────────────────────────

  openCreate(): void {
    this.selectedUser = null;
    this.showModal    = true;
  }

  openEdit(user: User): void {
    this.selectedUser = user;
    this.showModal    = true;
  }

  closeModal(): void {
    this.showModal    = false;
    this.selectedUser = null;
  }

  onUserSaved(): void {
    this.closeModal();
    this.loadUsers();
  }

  // ── Toggle statut ─────────────────────────────────────────────────────────

  toggleStatut(user: User): void {
    const action = user.statut === 'ACTIF' ? 'désactiver' : 'activer';
    if (!confirm(`Voulez-vous ${action} ${user.nomComplet} ?`)) return;

    this.userService.toggleStatut(user.id).subscribe({
      next: (res) => {
        if (res.success) {
          user.statut = res.data.statut;
          this.toastr.success(`Utilisateur ${action === 'activer' ? 'activé' : 'désactivé'}`, 'Succès');
        }
      },
      error: (err) => {
        this.toastr.error(err?.message || 'Erreur lors du changement de statut', 'Erreur');
      }
    });
  }

  // ── Suppression ───────────────────────────────────────────────────────────

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.showConfirm  = true;
  }

  cancelDelete(): void {
    this.userToDelete  = null;
    this.showConfirm   = false;
  }

  doDelete(): void {
    if (!this.userToDelete) return;
    this.confirmLoading = true;

    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Utilisateur supprimé / désactivé', 'Succès');
          this.loadUsers();
        }
        this.confirmLoading = false;
        this.cancelDelete();
      },
      error: (err) => {
        this.toastr.error(err?.message || 'Erreur lors de la suppression', 'Erreur');
        this.confirmLoading = false;
        this.cancelDelete();
      }
    });
  }

  // ── Reset mot de passe ────────────────────────────────────────────────────

  resetPassword(user: User): void {
    if (!confirm(`Réinitialiser le mot de passe de ${user.nomComplet} ?`)) return;

    this.userService.resetPassword(user.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.tempPassword = res.data.temporaryPassword;
          this.showTempPwd  = true;
        }
      },
      error: (err) => {
        this.toastr.error(err?.message || 'Erreur lors de la réinitialisation', 'Erreur');
      }
    });
  }

  closeTempPwd(): void {
    this.tempPassword = null;
    this.showTempPwd  = false;
  }

  copyTempPwd(): void {
    if (this.tempPassword) {
      navigator.clipboard.writeText(this.tempPassword);
      this.toastr.success('Mot de passe copié !', '');
    }
  }

  // ── Helpers UI ────────────────────────────────────────────────────────────

  getRoleBadge(role: string): string {
    return role === 'ADMIN'
      ? 'bg-purple-100 text-purple-700'
      : 'bg-blue-100 text-blue-700';
  }

  getStatutBadge(statut: string): string {
    return statut === 'ACTIF'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  }

  getInitiales(nom: string): string {
    return nom?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  }

  formatDate(date: string | null): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  get startItem(): number { return this.page * this.size + 1; }
  get endItem():   number { return Math.min((this.page + 1) * this.size, this.totalUsers); }
}