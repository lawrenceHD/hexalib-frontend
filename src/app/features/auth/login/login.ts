// login.ts COMPLET avec logs de debug

import { Component, OnInit }  from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router }              from '@angular/router';
import { ToastrService }       from 'ngx-toastr';
import { AuthService }         from '../../../core/services/auth';

@Component({
  selector:    'app-login',
  standalone:  true,
  imports:     [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl:    './login.scss'
})
export class LoginComponent implements OnInit {
  loginForm:    FormGroup;
  loading     = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router,
    private toastr:      ToastrService
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // ── DEBUG ──────────────────────────────────────────────────────────────
    console.log('──────────────────────────────────');
    console.log('[LOGIN] ngOnInit appelé');
    console.log('[LOGIN] URL:', window.location.href);
    console.log('[LOGIN] isAuthenticated:', this.authService.isAuthenticated());
    console.log('[LOGIN] accessToken:', this.authService.accessToken ? 'PRESENT' : 'ABSENT');
    console.log('[LOGIN] currentUser:', this.authService.currentUserValue);
    console.log('──────────────────────────────────');
    // ── FIN DEBUG ──────────────────────────────────────────────────────────

    if (this.authService.isAuthenticated()) {
      console.log('[LOGIN] >>> Déjà connecté → redirection /dashboard');
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading      = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // ── DEBUG ──────────────────────────────────────────────────────────
        console.log('[LOGIN] Réponse backend:', JSON.stringify(response));
        console.log('[LOGIN] accessToken après login:', this.authService.accessToken ? 'STOCKÉ' : 'ABSENT');
        console.log('[LOGIN] currentUser après login:', this.authService.currentUserValue);
        // ── FIN DEBUG ──────────────────────────────────────────────────────

        if (response.success) {
          const user = response.data.user;
          if (user.premiereConnexion) {
            this.toastr.warning('Veuillez changer votre mot de passe temporaire.', 'Première connexion');
          } else {
            this.toastr.success(`Bienvenue ${user.nomComplet} !`, 'Connexion réussie');
          }
          console.log('[LOGIN] >>> Redirection vers /dashboard');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        // ── DEBUG ──────────────────────────────────────────────────────────
        console.error('[LOGIN] Erreur:', error);
        // ── FIN DEBUG ──────────────────────────────────────────────────────
        this.loading      = false;
        this.errorMessage = error?.error?.message || error?.message || 'Email ou mot de passe incorrect.';
        this.toastr.error(this.errorMessage, 'Échec de connexion');
      },
      complete: () => { this.loading = false; }
    });
  }

  togglePassword(): void { this.showPassword = !this.showPassword; }

  get email()    { return this.loginForm.get('email');    }
  get password() { return this.loginForm.get('password'); }
}
