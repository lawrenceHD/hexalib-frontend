import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.warning('Veuillez remplir correctement tous les champs', 'Formulaire invalide');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          const user = response.data.user;
          
          // Notification de succès
          this.toastr.success(
            `Bienvenue ${user.nomComplet} !`, 
            'Connexion réussie'
          );

          // Redirection selon le rôle
          setTimeout(() => {
            if (user.role === 'ADMIN') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }, 500);
        }
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        
        this.errorMessage = error.message || 'Email ou mot de passe incorrect';
        
        // Notification d'erreur
        this.toastr.error(
          this.errorMessage, 
          'Échec de connexion'
        );
        
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}