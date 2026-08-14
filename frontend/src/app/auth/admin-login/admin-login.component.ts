import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styles: [`
    .login-container { max-width: 420px; width: 100%; margin: 0.5rem auto 0; padding: 1.75rem 2rem; border-radius: 14px; box-shadow: 0 12px 32px rgba(0,0,0,0.35); background: white; color: #1E293B; border: 1px solid rgba(255,255,255,0.8); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.4rem; font-weight: 600; color: #1E293B; }
    input { width: 100%; padding: 0.7rem 0.9rem; border: 1.5px solid #CBD5E1; border-radius: 6px; box-sizing: border-box; font-size: 0.95rem; color: #0F172A; }
    input:focus { outline: none; border-color: #00C7B6; box-shadow: 0 0 0 3px rgba(0, 199, 182, 0.2); }
    .password-input-wrapper { position: relative; display: flex; align-items: center; }
    .password-input-wrapper input { padding-right: 3rem; }
    .toggle-password-btn { position: absolute; right: 0.75rem; background: transparent !important; border: none !important; padding: 0.25rem !important; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: none !important; width: auto !important; height: auto !important; min-height: 0 !important; }
    .toggle-password-btn:hover svg { stroke: #00C7B6; }
    .error { color: #dc3545; font-size: 0.85rem; margin-top: 0.25rem; }
    .btn-submit { width: 100%; padding: 0.8rem; background: #00897B; color: white; border: none; border-radius: 6px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background 0.2s ease; margin-top: 0.25rem; }
    .btn-submit:hover:not(:disabled) { background: #00796B; }
    .btn-submit:disabled { background: #94A3B8; cursor: not-allowed; }
    .server-error { color: #dc3545; text-align: center; margin-bottom: 0.85rem; font-weight: 600; font-size: 0.9rem; }
    .auth-subtext { text-align: center; margin-top: 1.25rem; font-size: 0.9rem; color: #334155; }
    .auth-subtext p { color: #334155; margin: 0.35rem 0; font-weight: 500; }
    .auth-subtext a { color: #00796B; font-weight: 700; text-decoration: underline; }
    .auth-subtext a:hover { color: #004D40; }
  `]
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  serverError = '';
  isLoading = false;

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.serverError = '';
    this.isLoading = true;

    this.authService.loginAdmin({
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    }).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.serverError = err.error?.message || 'Login failed. Please check your credentials.';
        this.isLoading = false;
      }
    });
  }
}
