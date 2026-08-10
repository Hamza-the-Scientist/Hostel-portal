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
        path: 'hostel',
        loadComponent: () =>
          import('./views/hostel-view.component').then((m) => m.HostelViewComponent),
      },
      {
        path: 'room-change',
        loadComponent: () =>
          import('./room-change/room-change.component').then((m) => m.RoomChangeComponent),
      },
      {
        path: 'merit-result',
        loadComponent: () =>
          import('./merit-result/merit-result.component').then((m) => m.MeritResultComponent),
      },
      {
        path: 'challans',
        loadComponent: () =>
          import('./views/challans-view.component').then((m) => m.ChallansViewComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./views/notifications-view.component').then((m) => m.NotificationsViewComponent),
      },
      {
        path: 'complaints',
        loadComponent: () =>
          import('./views/complaints-view.component').then((m) => m.ComplaintsViewComponent),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('./views/feedback-view.component').then((m) => m.FeedbackViewComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./views/settings-view.component').then((m) => m.SettingsViewComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
