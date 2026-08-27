// src/app/admin/students/student-management.component.ts
import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../core/admin/admin.service';
import { StudentDto } from '../../core/models/admin.model';

/** Dialog component for displaying student details */
@Component({
  selector: 'app-student-view-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">Student Details</h2>
    <mat-dialog-content class="dialog-content">
      <div class="detail-grid">
        <div class="detail-item">
          <span class="label">Name:</span>
          <span class="value">{{data.name}}</span>
        </div>
        <div class="detail-item">
          <span class="label">CNIC:</span>
          <span class="value">{{data.cnic}}</span>
        </div>
        <div class="detail-item">
          <span class="label">Roll No.:</span>
          <span class="value">{{data.rollNumber}}</span>
        </div>
        <div class="detail-item">
          <span class="label">Department:</span>
          <span class="value">{{data.department}}</span>
        </div>
        <div class="detail-item">
          <span class="label">Year:</span>
          <span class="value">{{data.academicYear}}</span>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close class="close-btn">Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `.dialog-title { 
      padding-left: 30px;
      color: var(--primary-color, #006400); 
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem; 
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }`,
    `.dialog-content { 
      padding: 1rem 0; 
      overflow: hidden;
    }`,
    `.detail-grid {
      padding-left: 20px;
      padding-right: 30px;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }`,
    `.detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 0.8rem;
      background: #f8fafc;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }`,
    `.label {
      font-weight: 600;
      color: #4a5568;
      font-size: 0.9rem;
    }`,
    `.value {
      color: #1a202c;
      font-weight: 500;
      font-size: 0.9rem;
      text-align: right;
    }`,
    `.dialog-actions {
      padding-top: 0.5rem;
      margin-bottom: 0;
    }`,
    `.close-btn { 
      background: #ffffff;
      border: 1.5px solid var(--primary-color, #006400); 
      border-radius: 6px;
      color: var(--primary-color, #006400);
      padding: 0.4rem 1.2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease-in-out;
      cursor: pointer;
    }`,
    `.close-btn:hover { 
      background: var(--primary-color, #006400); 
      color: #ffffff;
      border-color: #004d00;
      box-shadow: 0 4px 8px rgba(0, 100, 0, 0.2);
    }`
  ]
})
export class StudentViewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: StudentDto) { }
}

/** Main component for student management */
@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 class="page-title">Student Management</h2>
    <form [formGroup]="filterForm" (ngSubmit)="search()" class="filter-form">
      <input matInput placeholder="Name" formControlName="name" />
      <input matInput placeholder="CNIC" formControlName="cnic" />
      <input matInput placeholder="Roll No." formControlName="rollNumber" />
      <button mat-raised-button color="primary" type="submit">Search</button>
    </form>
    <table mat-table [dataSource]="students" class="mat-elevation-z2" matSort>
      <ng-container matColumnDef="cnic">
        <th mat-header-cell *matHeaderCellDef>CNIC</th>
        <td mat-cell *matCellDef="let s">{{s.cnic}}</td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let s">
          <span class="avatar"></span>{{s.name}}
        </td>
      </ng-container>
      <ng-container matColumnDef="department">
        <th mat-header-cell *matHeaderCellDef>Dept.</th>
        <td mat-cell *matCellDef="let s">{{s.department}}</td>
      </ng-container>
      <ng-container matColumnDef="academicYear">
        <th mat-header-cell *matHeaderCellDef>Year</th>
        <td mat-cell *matCellDef="let s">{{s.academicYear}}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let s">
          <button mat-button class="view-btn" (click)="view(s)">View</button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayed"></tr>
      <tr mat-row *matRowDef="let row; columns: displayed;" class="table-row"></tr>
    </table>
  `,
  styles: [
    `.filter-form { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 1rem; }`,
    `.page-title { color: var(--primary-color, #006400); margin-bottom: 1rem; }`,
    `.mat-header-cell { background: #e0f2e9; font-weight: bold; }`,
    `.table-row:hover { background: #f5f5f5; }`,
    `.view-btn { color: var(--primary-color, #006400); border: 1px solid var(--primary-color, #006400); border-radius: 4px; padding: 2px 8px; font-size: .875rem; }`,
    `.avatar { display:inline-block; width:24px; height:24px; background:#bbb; border-radius:50%; margin-right:4px; vertical-align:middle; }`
  ]
})
export class StudentManagementComponent implements OnInit {
  private admin = inject(AdminService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  filterForm = this.fb.group({
    name: [''],
    cnic: [''],
    rollNumber: ['']
  });

  students: StudentDto[] = [];
  displayed = ['cnic', 'name', 'department', 'academicYear', 'actions'];

  ngOnInit() {
    this.search(); // load all students on component init
  }

  search() {
    this.admin.searchStudents(this.filterForm.value).subscribe(data => {
      console.log('Students API Raw Response:', data);
      this.students = [...data];
    }, err => {
      console.error('Failed to load students', err);
      this.snack.open('Failed to load students', 'Dismiss', { duration: 3000 });
    });
  }

  view(student: StudentDto) {
    this.dialog.open(StudentViewDialogComponent, {
      width: '520px',
      data: student
    });
  }
}