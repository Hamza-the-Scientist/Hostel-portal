import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
  <mat-sidenav-container class="admin-shell">
    <mat-sidenav mode="side" opened class="admin-sidebar">
      <div class="sidebar-brand">
        <h2>SDP Admin</h2>
      </div>
      <mat-nav-list>
        <a mat-list-item routerLink="dashboard" routerLinkActive="active-link"><mat-icon>dashboard</mat-icon><span>Dashboard</span></a>
        <a mat-list-item routerLink="students" routerLinkActive="active-link"><mat-icon>people</mat-icon><span>Students</span></a>
        <a mat-list-item routerLink="hostels" routerLinkActive="active-link"><mat-icon>home</mat-icon><span>Hostels</span></a>
        <a mat-list-item routerLink="rooms" routerLinkActive="active-link"><mat-icon>meeting_room</mat-icon><span>Rooms</span></a>
        <a mat-list-item routerLink="applications" routerLinkActive="active-link"><mat-icon>assignment</mat-icon><span>Applications</span></a>
        <a mat-list-item routerLink="eligibility" routerLinkActive="active-link"><mat-icon>rule</mat-icon><span>Eligibility</span></a>
        <a mat-list-item routerLink="merit" routerLinkActive="active-link"><mat-icon>star</mat-icon><span>Merit & Allocation</span></a>
        <a mat-list-item routerLink="residents" routerLinkActive="active-link"><mat-icon>person</mat-icon><span>Residents</span></a>
        <a mat-list-item routerLink="settings" routerLinkActive="active-link"><mat-icon>settings</mat-icon><span>Settings</span></a>
        <a mat-list-item (click)="logout()" class="logout"><mat-icon>logout</mat-icon><span>Logout</span></a>
      </mat-nav-list>
    </mat-sidenav>

    <mat-sidenav-content>
      <mat-toolbar color="primary" class="admin-header">
        <span class="breadcrumb">Sindh Dormitory Portal Admin</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">Logout</button>
      </mat-toolbar>

      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  private router = inject(Router);
  logout() { window.location.href = '/auth/admin-login'; }
}
