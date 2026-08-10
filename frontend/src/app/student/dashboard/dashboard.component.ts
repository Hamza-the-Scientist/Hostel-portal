// student/dashboard/dashboard.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { forkJoin, of, catchError } from 'rxjs';
import { ResidencyService, StudentResidencyDto } from '../residency.service';
import { ApplicationWorkflowService, ApplicationDto } from '../application-workflow.service';
import { MeritService, MeritResultDto } from '../merit-result/merit.service';
import { AuthService } from '../../core/auth.service';
import { ResidentDashboardComponent } from './resident-dashboard/resident-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ResidentDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private residencyService = inject(ResidencyService);
  private applicationService = inject(ApplicationWorkflowService);
  private meritService = inject(MeritService);
  private authService = inject(AuthService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly residency = signal<StudentResidencyDto | null>(null);
  readonly application = signal<ApplicationDto | null>(null);
  readonly meritResult = signal<MeritResultDto | null>(null);

  // Time aware greeting
  readonly greetingTime = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  });

  readonly studentName = computed(() => {
    const user = this.authService.currentUser();
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ''}`.trim();
    }
    return 'Student';
  });

  // Card 1: Application Status
  readonly cardAppStatus = computed(() => {
    const res = this.residency();
    const app = this.application();
    const merit = this.meritResult();

    if (res?.isExistingResident) {
      return {
        title: 'Application Status',
        value: 'Active Resident',
        sub: `Hostel: ${res.hostelName}`,
        badgeClass: 'badge-success',
        icon: '📋'
      };
    }

    if (merit?.allocationStatus === 'Allocated') {
      return {
        title: 'Application Status',
        value: 'Room Allocated',
        sub: merit.allocatedHostel || 'Allocation confirmed',
        badgeClass: 'badge-success',
        icon: '🏠'
      };
    }

    if (app?.displayStatus || app?.status) {
      return {
        title: 'Application Status',
        value: app.displayStatus || app.status,
        sub: app.submittedAt ? `Submitted on ${new Date(app.submittedAt).toLocaleDateString()}` : 'In progress',
        badgeClass: 'badge-info',
        icon: '📋'
      };
    }

    return {
      title: 'Application Status',
      value: 'Not Applied',
      sub: 'Start application wizard below',
      badgeClass: 'badge-warning',
      icon: '📋'
    };
  });

  // Card 2: Current Hostel
  readonly cardHostel = computed(() => {
    const res = this.residency();
    const merit = this.meritResult();
    const app = this.application();

    if (res?.isExistingResident) {
      return {
        title: 'Current Hostel',
        value: res.hostelName || 'Assigned',
        sub: res.blockName ? `${res.blockName}` : 'Main Campus',
        icon: '🏢'
      };
    }

    if (merit?.allocatedHostel) {
      return {
        title: 'Allocated Hostel',
        value: merit.allocatedHostel,
        sub: 'Merit allocation',
        icon: '🏢'
      };
    }

    if (app?.preferences && app.preferences.length > 0) {
      const topPref = app.preferences[0]?.name;
      return {
        title: 'Hostel Preference',
        value: topPref || 'Pending',
        sub: '1st Choice Selected',
        icon: '🏢'
      };
    }

    return {
      title: 'Current Hostel',
      value: 'None Assigned',
      sub: 'Application required',
      icon: '🏢'
    };
  });

  // Card 3: Current Room
  readonly cardRoom = computed(() => {
    const res = this.residency();
    const merit = this.meritResult();

    if (res?.isExistingResident) {
      return {
        title: 'Current Room',
        value: `Room ${res.roomNumber}`,
        sub: `${res.bedLabel}`,
        icon: '🛏️'
      };
    }

    if (merit?.allocatedRoom) {
      return {
        title: 'Allocated Room',
        value: `Room ${merit.allocatedRoom}`,
        sub: merit.allocatedBed || 'Bed assigned',
        icon: '🛏️'
      };
    }

    return {
      title: 'Current Room',
      value: 'Unassigned',
      sub: 'Awaiting allocation',
      icon: '🛏️'
    };
  });

  // Card 4: Merit / CPN
  readonly cardMerit = computed(() => {
    const merit = this.meritResult();

    if (merit) {
      const rankText = merit.meritRank ? `#${merit.meritRank} Rank` : 'Scored';
      return {
        title: 'Merit / CPN',
        value: `CPN: ${merit.cpn.toFixed(1)}`,
        sub: `${rankText} (${merit.allocationStatus || 'Processed'})`,
        icon: '📊'
      };
    }

    return {
      title: 'Merit / CPN',
      value: 'Pending Run',
      sub: 'Merit engine pending',
      icon: '📊'
    };
  });

  readonly applicationSteps = [
    { title: 'Verify Identity', desc: 'Confirm your university registration and CNIC details.' },
    { title: 'Check Eligibility', desc: 'System checks CGPA, semester, and district criteria.' },
    { title: 'Pay Processing Fee', desc: 'Generate and pay a one-time processing fee challan.' },
    { title: 'Select Preferences', desc: 'Rank your preferred hostels in order of priority.' },
    { title: 'Submit & Wait', desc: 'Merit list is generated. Top candidates are allocated rooms.' },
  ];

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      residency: this.residencyService.getResidencyStatus().pipe(catchError(() => of(null))),
      application: this.applicationService.getActiveApplication().pipe(catchError(() => of(null))),
      merit: this.meritService.getMeritResult().pipe(catchError(() => of(null)))
    }).subscribe({
      next: ({ residency, application, merit }) => {
        if (residency) this.residency.set(residency);
        if (application) this.application.set(application);
        if (merit) this.meritResult.set(merit);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Could not load dashboard data. Please try again.');
        this.loading.set(false);
      }
    });
  }

  reload(): void {
    this.loadAllData();
  }

  onResidencyChange(updated: StudentResidencyDto): void {
    this.residency.set(updated);
  }
}
