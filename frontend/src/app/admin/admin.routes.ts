// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { HostelListComponent } from './hostels/hostel-list.component';
import { RoomListComponent } from './rooms/room-list.component';
import { EligibilityComponent } from './eligibility/eligibility.component';
import { StudentManagementComponent } from './students/student-management.component';
import { ResidentManagementComponent } from './residents/resident-management.component';
import { AdminApplicationViewComponent } from './applications/admin-application-view.component';
import { AdminMeritAllocationComponent } from './merit/admin-merit-allocation.component';
import { DistrictDistributionComponent } from './merit/district-distribution.component';
import { AdminSettingsComponent } from './settings/admin-settings.component';
import { AdminControlsComponent } from './controls/admin-controls.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'hostels', component: HostelListComponent },
      { path: 'rooms', component: RoomListComponent },
      { path: 'eligibility', component: EligibilityComponent },
      { path: 'students', component: StudentManagementComponent },
      { path: 'residents', component: ResidentManagementComponent },
      { path: 'applications', component: AdminApplicationViewComponent },
      { path: 'merit', component: AdminMeritAllocationComponent },
      { path: 'district-distribution', component: DistrictDistributionComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: 'controls', component: AdminControlsComponent }
    ]
  }
];
