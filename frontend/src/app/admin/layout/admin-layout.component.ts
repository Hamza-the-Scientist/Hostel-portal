// src/app/admin/layout/admin-layout.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
  <mat-sidenav-container class="admin-shell">
    <mat-sidenav mode="side" opened class="admin-sidebar">
      <mat-nav-list>
        <a mat-list-item routerLink="dashboard"><mat-icon>dashboard</mat-icon>Dashboard</a>
        <a mat-list-item routerLink="students"><mat-icon>people</mat-icon>Students</a>
        <a mat-list-item routerLink="hostels"><mat-icon>home</mat-icon>Hostels</a>
        <a mat-list-item routerLink="rooms"><mat-icon>meeting_room</mat-icon>Rooms</a>
        <a mat-list-item routerLink="applications"><mat-icon>assignment</mat-icon>Applications</a>
        <a mat-list-item routerLink="eligibility"><mat-icon>rule</mat-icon>Eligibility</a>
        <a mat-list-item routerLink="merit"><mat-icon>star</mat-icon>Merit & Allocation</a>
        <a mat-list-item routerLink="residents"><mat-icon>person</mat-icon>Residents</a>
        <a mat-list-item routerLink="settings"><mat-icon>settings</mat-icon>Settings</a>
        <a mat-list-item (click)="logout()" class="logout"><mat-icon>logout</mat-icon>Logout</a>
      </mat-nav-list>
    </mat-sidenav>

    <mat-sidenav-content>
      <mat-toolbar color="primary" class="admin-header">
        <span class="breadcrumb">Admin Panel</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">Logout</button>
      </mat-toolbar>

      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
  styles: [`
    .admin-shell { height: 100vh; }
    .admin-sidebar { width: 240px; }
    .admin-header { position: sticky; top: 0; z-index: 10; }
    .breadcrumb { font-weight: 500; }
    .spacer { flex: 1; }
    .admin-content { padding: 1rem; }
    .logout { margin-top: auto; }
  `]
})
export class AdminLayoutComponent {
  private router = inject(RouterLink);
  logout() { window.location.href = '/auth/admin-login'; }
}
