import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/admin/admin.service';
import { DashboardStats, AllocationStatusDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DatePipe, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="grid">
      <mat-card class="card primary" *ngIf="stats as s">
        <h3>Total Students</h3><p>{{s.totalStudents}}</p>
      </mat-card>
      <mat-card class="card primary" *ngIf="stats as s">
        <h3>Total Residents</h3><p>{{s.totalResidents}}</p>
      </mat-card>
      <mat-card class="card primary" *ngIf="stats as s">
        <h3>Total Applicants</h3><p>{{s.totalApplicants}}</p>
      </mat-card>
      <mat-card class="card primary" *ngIf="stats as s">
        <h3>Available Seats</h3><p>{{s.availableSeats}}</p>
      </mat-card>

      <mat-card class="card secondary" *ngIf="stats as s">
        <h3>Pending Applications</h3><p>{{s.pendingApplications}}</p>
      </mat-card>
      <mat-card class="card secondary" *ngIf="stats as s">
        <h3>Pending Payments</h3><p>{{s.pendingPayments}}</p>
      </mat-card>
      <mat-card class="card secondary" *ngIf="stats as s">
        <h3>Room Change Requests</h3><p>{{s.roomChangeRequests}}</p>
      </mat-card>
      <mat-card class="card secondary" *ngIf="stats as s">
        <h3>Open Complaints</h3><p>{{s.openComplaints}}</p>
      </mat-card>
    </div>

    <div class="allocation-switch" *ngIf="allocationStatus$ | async as status">
      <h4>Global Allocation Status</h4>
      <p>
        <span [class]="status.open ? 'open' : 'closed'">
          {{ status.open ? '🟢 OPEN' : '🔴 CLOSED' }}
        </span>
        <small *ngIf="status.deadline"> – deadline: {{ status.deadline | date:'short' }}</small>
      </p>
      <button mat-raised-button color="primary" (click)="toggle(true)" *ngIf="!status.open">Open Allocation</button>
      <button mat-raised-button color="warn" (click)="toggle(false)" *ngIf="status.open">Close Allocation</button>
      <mat-spinner *ngIf="loading" diameter="30"></mat-spinner>
    </div>
  `,
  styles: [`
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
    .card { text-align: center; }
    .primary { background: #e3f2fd; }
    .secondary { background: #f1f8e9; }
    .allocation-switch { margin-top: 2rem; text-align: center; }
    .open { color: green; font-weight: 600; }
    .closed { color: red; font-weight: 600; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private admin = inject(AdminService);
  private snack = inject(MatSnackBar);

  stats?: DashboardStats;
  loading = false;
  allocationStatus$ = this.admin.getAllocationStatus();

  ngOnInit() {
    this.admin.getDashboardStats().subscribe({
      next: s => this.stats = s,
      error: err => this.snack.open('Failed to load stats: ' + err.message, 'Close')
    });
  }

  toggle(open: boolean) {
    this.loading = true;
    this.admin.setAllocationStatus(open).subscribe({
      next: () => {
        this.snack.open(`Allocation ${open ? 'opened' : 'closed'}`, 'OK', { duration: 3000 });
        this.allocationStatus$ = this.admin.getAllocationStatus();
        this.loading = false;
      },
      error: err => {
        this.snack.open('Error: ' + err.message, 'Close');
        this.loading = false;
      }
    });
  }
}
