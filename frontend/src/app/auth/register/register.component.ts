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
      margin: 2.5rem auto;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      background: white;
      border: 1px solid #e0e0e0;
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
    label { display: block; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.88rem; color: #333; }
    input, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }
    input:focus { outline: none; border-color: #015C3A; }
    .error { color: #d32f2f; font-size: 0.82rem; margin-top: 0.3rem; }
    .info-note {
      background: #f5f5f5;
      padding: 0.85rem;
      border-radius: 6px;
      font-size: 0.86rem;
      color: #555;
      border-left: 4px solid #015C3A;
      margin-bottom: 1.5rem;
    }
    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      background: #015C3A;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: #01432A; }
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
    .login-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #666; }
    .login-link a { color: #015C3A; font-weight: 600; text-decoration: none; }
    .login-link a:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

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
