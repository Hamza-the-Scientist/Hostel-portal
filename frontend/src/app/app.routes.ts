// ============================================================
// app.routes.ts — Root Application Routes
// ============================================================
import { Routes } from '@angular/router';
import { studentGuard } from './guards/student.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // ---- Public Area ----
  {
    path: '',
    loadChildren: () =>
      import('./public/public.routes').then((m) => m.PUBLIC_ROUTES),
  },

  // ---- Auth Area ----
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // ---- Student Portal (requires authentication + student role) ----
  {
    path: 'student',
    canActivate: [studentGuard],
    loadChildren: () =>
      import('./student/student.routes').then((m) => m.STUDENT_ROUTES),
  },

  // ---- Admin Portal (requires authentication + admin role) ----
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // ---- Wildcard ----
  {
    path: '**',
    redirectTo: '',
  },
];
