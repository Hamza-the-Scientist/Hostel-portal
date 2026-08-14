import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styles: [`
    .register-container {
      max-width: 620px;
      margin: 0.5rem auto 0;
      padding: 1.75rem 2rem;
      border-radius: 14px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.35);
      background: white;
      border: 1px solid rgba(255,255,255,0.8);
    }
    .header-box { text-align: center; margin-bottom: 2rem; }
    .verify-badge {
      display: inline-block;
      background: #e8f5e9;
      color: #015C3A;
      padding: 0.35rem 0.9rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }
    .subtitle { color: #666; font-size: 0.92rem; margin-top: 0.5rem; }
    .form-row { display: flex; gap: 1rem; margin-bottom: 1.25rem; }
    .form-group { flex: 1; }
    .form-group.full { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.88rem; color: #1E293B; }
    input, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 0.95rem;
      color: #0F172A;
      transition: border-color 0.2s;
    }
    input:focus { outline: none; border-color: #00897B; }
    .password-input-wrapper { position: relative; display: flex; align-items: center; }
    .password-input-wrapper input { padding-right: 3rem; }
    .toggle-password-btn { position: absolute; right: 0.75rem; background: transparent !important; border: none !important; padding: 0.25rem !important; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: none !important; width: auto !important; height: auto !important; min-height: 0 !important; }
    .toggle-password-btn:hover svg { stroke: #00C7B6; }
    .error { color: #d32f2f; font-size: 0.82rem; margin-top: 0.3rem; }
    .info-note {
      background: #f5f5f5;
      padding: 0.85rem;
      border-radius: 6px;
      font-size: 0.86rem;
      color: #475569;
      border-left: 4px solid #00897B;
      margin-bottom: 1.5rem;
    }
    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      background: #00897B;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: #00796B; }
    .btn-submit:disabled { background: #9e9e9e; cursor: not-allowed; }
    .server-error {
      background: #ffebee;
      color: #c62828;
      padding: 0.85rem;
      border-radius: 6px;
      text-align: center;
      margin-bottom: 1.5rem;
      font-weight: 500;
      font-size: 0.9rem;
      border: 1px solid #ffcdd2;
    }
    .login-link { text-align: center; margin-top: 1.5rem; font-size: 0.95rem; color: #475569; font-weight: 500; }
    .login-link a { color: #00897B; font-weight: 700; text-decoration: underline; }
    .login-link a:hover { color: #004D40; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;

  registerForm = this.fb.group({
    cnic: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
    registrationNumber: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  serverError = '';
  isLoading = false;

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.serverError = '';
    this.isLoading = true;

    const data = this.registerForm.value;

    this.authService.registerStudent({
      firstName: '', // Handled server-side via verification
      lastName: '',  // Handled server-side via verification
      email: data.email!,
      password: data.password!,
      phoneNumber: data.phoneNumber!,
      registrationNumber: data.registrationNumber!,
      cnic: data.cnic!,
      gender: 0,
      dateOfBirth: '2000-01-01'
    }).subscribe({
      next: () => {
        this.router.navigate(['/student/profile']);
      },
      error: (err) => {
        this.serverError = err.error?.message || 'Verification or registration failed. Please check your CNIC and Roll Number.';
        this.isLoading = false;
      }
    });
  }
}
