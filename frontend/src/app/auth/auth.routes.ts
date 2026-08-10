// auth/auth.routes.ts
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'student-login', loadComponent: () => import('./student-login/student-login.component').then(m => m.StudentLoginComponent) },
      { path: 'admin-login', loadComponent: () => import('./admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
      { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'student-login', pathMatch: 'full' }
    ],
  },
];
