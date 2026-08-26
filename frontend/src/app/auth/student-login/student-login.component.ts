import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-login.component.html',
  styles: [`
    .login-container { max-width: 420px; width: 100%; margin: 0.5rem auto 0; padding: 1.75rem 2rem; border-radius: var(--radius-card); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12); background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); color: var(--color-text-main); border: 1px solid rgba(255, 255, 255, 0.8); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.4rem; font-weight: 600; color: var(--color-text-main); }
    input { width: 100%; padding: 0.7rem 0.9rem; border: 1.5px solid var(--color-border); border-radius: var(--radius-btn); box-sizing: border-box; font-size: 0.95rem; color: var(--color-text-main); }
    input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.15); }
    .password-input-wrapper { position: relative; display: flex; align-items: center; }
    .password-input-wrapper input { padding-right: 3rem; }
    .toggle-password-btn { position: absolute; right: 0.75rem; background: transparent !important; border: none !important; padding: 0.25rem !important; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: none !important; width: auto !important; height: auto !important; min-height: 0 !important; }
    .toggle-password-btn:hover svg { stroke: var(--color-primary); }
    .error { color: #dc3545; font-size: 0.85rem; margin-top: 0.25rem; }
    .btn-submit { width: 100%; padding: 0.8rem; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-btn); font-size: 1rem; font-weight: 700; cursor: pointer; transition: background 0.2s ease; margin-top: 0.25rem; box-shadow: var(--shadow-sm); }
    .btn-submit:hover:not(:disabled) { background: var(--color-primary-dark); }
    .btn-submit:disabled { background: #94A3B8; cursor: not-allowed; }
    .server-error { color: #dc3545; text-align: center; margin-bottom: 0.85rem; font-weight: 600; font-size: 0.9rem; }
    .auth-subtext { text-align: center; margin-top: 1.25rem; font-size: 0.9rem; color: var(--color-text-muted); }
    .auth-subtext p { color: var(--color-text-muted); margin: 0.35rem 0; font-weight: 500; }
    .auth-subtext a { color: var(--color-primary); font-weight: 700; text-decoration: underline; }
    .auth-subtext a:hover { color: var(--color-primary-dark); }
  `]
})
export class StudentLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;

  loginForm = this.fb.group({
    cnic: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
    password: ['', [Validators.required]]
  });

  serverError = '';
  isLoading = false;

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.serverError = '';
    this.isLoading = true;

    this.authService.loginStudent({
      cnic: this.loginForm.value.cnic!,
      password: this.loginForm.value.password!
    }).subscribe({
      next: () => {
        this.router.navigate(['/student/dashboard']);
      },
      error: (err) => {
        this.serverError = err.error?.message || 'Login failed. Please check your credentials.';
        this.isLoading = false;
      }
    });
  }
}
