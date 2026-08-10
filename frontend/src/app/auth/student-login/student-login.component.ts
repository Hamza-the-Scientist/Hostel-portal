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
    .login-container { max-width: 400px; margin: 4rem auto; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); background: white; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .error { color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem; }
    button { width: 100%; padding: 0.75rem; background: #0056b3; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    .server-error { color: #dc3545; text-align: center; margin-bottom: 1rem; font-weight: 500; }
  `]
})
export class StudentLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

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
        this.router.navigate(['/student']);
      },
      error: (err) => {
        this.serverError = err.error?.message || 'Login failed. Please check your credentials.';
        this.isLoading = false;
      }
    });
  }
}
