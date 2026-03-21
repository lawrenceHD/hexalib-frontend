// src/app/features/utilisateurs/components/formulaire-utilisateur/formulaire-utilisateur.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService }  from 'ngx-toastr';
import { UserService }    from '../../services/user';
import { User }           from '../../../../core/models/user.model';

@Component({
  selector:    'app-formulaire-utilisateur',
  standalone:  true,
  imports:     [CommonModule, ReactiveFormsModule],
  templateUrl: './formulaire-utilisateur.html'
})
export class FormulaireUtilisateurComponent implements OnInit, OnChanges {
  @Input()  user:      User | null = null;   // null = création, User = édition
  @Output() saved     = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form:    FormGroup;
  loading  = false;
  isEdit   = false;
  showPwd  = false;

  constructor(
    private fb:          FormBuilder,
    private userService: UserService,
    private toastr:      ToastrService
  ) {
    this.form = this.buildForm();
  }

  ngOnInit():    void { this.init(); }
  ngOnChanges(): void { this.init(); }

  private init(): void {
    this.isEdit = !!this.user;
    this.form   = this.buildForm();

    if (this.isEdit && this.user) {
      this.form.patchValue({
        nomComplet: this.user.nomComplet,
        email:      this.user.email,
        role:       this.user.role,
        statut:     this.user.statut
      });
    }
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      nomComplet: ['', [Validators.required, Validators.minLength(3)]],
      email:      ['', [Validators.required, Validators.email]],
      role:       ['VENDEUR', Validators.required],
      statut:     ['ACTIF'],
      // Password seulement à la création
      password:   ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const v = this.form.value;

    if (this.isEdit && this.user) {
      this.userService.updateUser(this.user.id, {
        nomComplet: v.nomComplet,
        email:      v.email,
        role:       v.role,
        statut:     v.statut
      }).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success('Utilisateur mis à jour', 'Succès');
            this.saved.emit();
          }
          this.loading = false;
        },
        error: (err) => {
          this.toastr.error(err?.message || 'Erreur lors de la mise à jour', 'Erreur');
          this.loading = false;
        }
      });
    } else {
      this.userService.createUser({
        nomComplet: v.nomComplet,
        email:      v.email,
        role:       v.role,
        password:   v.password || undefined
      }).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success('Utilisateur créé avec succès', 'Succès');
            this.saved.emit();
          }
          this.loading = false;
        },
        error: (err) => {
          this.toastr.error(err?.message || 'Erreur lors de la création', 'Erreur');
          this.loading = false;
        }
      });
    }
  }

  togglePwd(): void { this.showPwd = !this.showPwd; }

  f(name: string) { return this.form.get(name); }
}