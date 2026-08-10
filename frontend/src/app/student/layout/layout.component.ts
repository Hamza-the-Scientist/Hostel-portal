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

  sidebarCollapsed = false;

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

  /** Show Room Change link only for existing residents */
  readonly showRoomChange = computed(() => {
    const r = this.residency();
    return r?.isExistingResident ?? false;
  });

  /** Show Apply link only for non-residents (or if admin has unlocked fresh application) */
  readonly showApply = computed(() => {
    const r = this.residency();
    if (!r) return true; // default: show until we know status
    return !r.isExistingResident || r.allowFreshApplication;
  });

  readonly pageTitle = computed(() => {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Dashboard';
    if (url.includes('room-change')) return 'Room Change Request';
    if (url.includes('profile')) return 'My Profile';
    if (url.includes('apply')) return 'Apply for Hostel';
    return 'Student Portal';
  });

  timeOfDay(): string {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  }

  constructor() {
    // Load residency status to determine which nav links to show
    this.residencyService.getResidencyStatus().subscribe(r => this.residency.set(r));
  }

  logout(): void {
    this.authService.logout();
  }
}
