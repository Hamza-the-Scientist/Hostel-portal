// public/public.routes.ts
import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
      { path: 'hostels', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
      { path: 'hostel/:id', loadComponent: () => import('./hostel-detail/hostel-detail.component').then(m => m.HostelDetailComponent) }
    ],
  },
];
