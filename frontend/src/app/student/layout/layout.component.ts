// student/layout/layout.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ResidencyService, StudentResidencyDto } from '../residency.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private residencyService = inject(ResidencyService);
  private router = inject(Router);

  sidebarCollapsed = signal(false);
  mobileMenuOpen   = signal(false);

  private residency = signal<StudentResidencyDto | null>(null);

  readonly userName = computed(() => {
    const u = this.authService.currentUser();
    return u ? `${u.firstName} ${u.lastName}` : 'Student';
  });

  readonly firstName = computed(() => {
    return this.authService.currentUser()?.firstName ?? 'Student';
  });

  readonly userInitials = computed(() => {
    const u = this.authService.currentUser();
    if (!u) return 'S';
    return `${u.firstName?.charAt(0) ?? ''}${u.lastName?.charAt(0) ?? ''}`.toUpperCase();
  });

  /** Show Room Change link for residents */
  readonly isResident = computed(() => {
    return this.residency()?.isExistingResident ?? false;
  });

  readonly pageTitle = computed(() => {
    const url = this.router.url;
    if (url.includes('dashboard'))    return 'Dashboard';
    if (url.includes('profile'))      return 'My Profile';
    if (url.includes('apply'))        return 'Hostel Application';
    if (url.includes('hostel'))       return 'My Hostel';
    if (url.includes('room-change'))  return 'Room Change Request';
    if (url.includes('merit-result')) return 'Merit Result';
    if (url.includes('challans'))     return 'Challans & Payments';
    if (url.includes('notifications'))return 'Notifications';
    if (url.includes('complaints'))   return 'Complaints & Support';
    if (url.includes('feedback'))     return 'Feedback';
    if (url.includes('settings'))     return 'Settings';
    return 'Student Portal';
  });

  timeOfDay(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    return 'Evening';
  }

  constructor() {
    this.residencyService.getResidencyStatus().subscribe(r => this.residency.set(r));
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
