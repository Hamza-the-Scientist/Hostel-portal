import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../core/admin/admin.service';
import { ApplicationDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-admin-application-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatSelectModule, MatButtonModule],
  template: `
    <h2>Student Applications</h2>
    <form [formGroup]="filterForm" (ngSubmit)="load()" class="filter-form">
      <select matNativeControl formControlName="status">
        <option value="">All statuses</option>
        <option value="Submitted">Submitted</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
      <button mat-raised-button color="primary" type="submit">Filter</button>
    </form>
    <table mat-table [dataSource]="applications" class="mat-elevation-z2">
      <ng-container matColumnDef="studentId"><th mat-header-cell *matHeaderCellDef>Student ID</th><td mat-cell *matCellDef="let a">{{a.studentId}}</td></ng-container>
      <ng-container matColumnDef="hostelId"><th mat-header-cell *matHeaderCellDef>Hostel</th><td mat-cell *matCellDef="let a">{{a.hostelId}}</td></ng-container>
      <ng-container matColumnDef="preferenceOrder"><th mat-header-cell *matHeaderCellDef>Preference</th><td mat-cell *matCellDef="let a">{{a.preferenceOrder}}</td></ng-container>
      <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let a">{{a.status}}</td></ng-container>
      <tr mat-header-row *matHeaderRowDef="displayed"></tr>
      <tr mat-row *matRowDef="let row; columns: displayed;"></tr>
    </table>
  `,
  styles: [`.filter-form { display: flex; gap: .5rem; margin-bottom: 1rem; }`]
})
export class AdminApplicationViewComponent implements OnInit {
  private admin = inject(AdminService);
  private fb = inject(FormBuilder);

  filterForm = this.fb.group({ status: [''] });
  applications: ApplicationDto[] = [];
  displayed = ['studentId', 'hostelId', 'preferenceOrder', 'status'];

  ngOnInit() { this.load(); }
  

  load() {
    const params = this.filterForm.value;
    this.admin.getApplications(params).subscribe(data => this.applications = data);
  }
}
