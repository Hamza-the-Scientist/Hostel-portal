// student/student.routes.ts
import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'apply',
        loadComponent: () =>
          import('./application-wizard/application-wizard.component').then(
            (m) => m.ApplicationWizardComponent
          ),
      },
      {
        path: 'room-change',
        loadComponent: () =>
          import('./room-change/room-change.component').then((m) => m.RoomChangeComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
