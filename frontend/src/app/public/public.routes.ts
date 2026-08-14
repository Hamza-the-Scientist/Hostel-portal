// public/public.routes.ts
import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
      { path: 'hostels', loadComponent: () => import('./hostels/hostels.component').then(m => m.HostelsComponent) },
      { path: 'reviews', loadComponent: () => import('./reviews/reviews.component').then(m => m.ReviewsComponent) },
      { path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },
      { path: 'hostel/:id', loadComponent: () => import('./hostel-detail/hostel-detail.component').then(m => m.HostelDetailComponent) }
    ],
  },
];
