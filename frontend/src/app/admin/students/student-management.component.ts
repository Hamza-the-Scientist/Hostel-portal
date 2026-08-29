// src/app/admin/students/student-management.component.ts
import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../core/admin/admin.service';
import { StudentDto } from '../../core/models/admin.model';

/** Dialog component for displaying student details */
@Component({
  selector: 'app-student-view-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="student-dialog">
      <div class="dialog-header">
        <div class="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h2>Student Details</h2>
        <p class="header-subtitle">Complete student information</p>
      </div>

      <div class="dialog-body">
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">
              <mat-icon class="detail-icon">person</mat-icon>
              Full Name
            </span>
            <span class="value">{{data.name}}</span>
          </div>
          <div class="detail-item">
            <span class="label">
              <mat-icon class="detail-icon">badge</mat-icon>
              CNIC
            </span>
            <span class="value">{{data.cnic}}</span>
          </div>
          <div class="detail-item">
            <span class="label">
              <mat-icon class="detail-icon">tag</mat-icon>
              Roll Number
            </span>
            <span class="value">{{data.rollNumber}}</span>
          </div>
          <div class="detail-item">
            <span class="label">
              <mat-icon class="detail-icon">school</mat-icon>
              Department
            </span>
            <span class="value">{{data.department}}</span>
          </div>
          <div class="detail-item">
            <span class="label">
              <mat-icon class="detail-icon">calendar_today</mat-icon>
              Academic Year
            </span>
            <span class="value">{{data.academicYear}}</span>
          </div>
          <div class="detail-item" *ngIf="data.gender">
            <span class="label">
              <mat-icon class="detail-icon">wc</mat-icon>
              Gender
            </span>
            <span class="value">{{data.gender}}</span>
          </div>
          <div class="detail-item" *ngIf="data.district">
            <span class="label">
              <mat-icon class="detail-icon">location_on</mat-icon>
              District
            </span>
            <span class="value">{{data.district}}</span>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="btn-close" mat-dialog-close>Close</button>
      </div>
    </div>
  `,
  styles: [`
    .student-dialog {
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* ── Header ── */
    .dialog-header {
      background: linear-gradient(135deg, #013828 0%, #015C3A 60%, #017A4A 100%);
      padding: 2.5rem 1.75rem 1.25rem;
      margin: -24px 0 0;
      border-radius: 4px 4px 0 0;
      text-align: center;
    }

    .header-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(212, 175, 55, 0.2);
      color: #D4AF37;
      margin-bottom: 0.5rem;
    }

    .dialog-header h2 {
      margin: 0;
      color: #FFFFFF;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .header-subtitle {
      margin: 0.25rem 0 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.82rem;
      font-weight: 400;
    }

    /* ── Body ── */
    .dialog-body {
      padding: 1.5rem 1.5rem 0.5rem;
    }

    .detail-grid {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.65rem 0.9rem;
      background: #f7fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      transition: background 0.15s ease;
    }

    .detail-item:hover {
      background: #f0faf4;
    }

    .label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #4a5568;
      font-size: 0.88rem;
    }

    .detail-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #015C3A;
    }

    .value {
      color: #1a202c;
      font-weight: 500;
      font-size: 0.88rem;
      text-align: right;
    }

    /* ── Footer ── */
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      padding: 1rem 1.5rem 0.25rem;
      border-top: 1px solid #e2e8f0;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .btn-close {
      padding: 0.6rem 1.4rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: 1.5px solid #015C3A;
      border-radius: 8px;
      background: #ffffff;
      color: #015C3A;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn-close:hover {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.25);
    }
  `]
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
    MatDialogModule,
    MatIconModule
  ],
  template: `
    <div class="student-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">Student Management</h2>
          <p class="page-subtitle">Search and manage registered students</p>
        </div>
      </div>

      <!-- Search Card -->
      <div class="search-card">
        <div class="search-card-header">
          <mat-icon class="search-card-icon">search</mat-icon>
          <span>Search Students</span>
        </div>
        <form [formGroup]="filterForm" (ngSubmit)="search()" class="filter-form">
          <div class="input-group">
            <label for="searchName">Name</label>
            <input id="searchName" type="text" formControlName="name" placeholder="Search by name..." />
          </div>
          <div class="input-group">
            <label for="searchCnic">CNIC</label>
            <input id="searchCnic" type="text" formControlName="cnic" placeholder="e.g. 42101-1234567-8" />
          </div>
          <div class="input-group">
            <label for="searchRoll">Roll No.</label>
            <input id="searchRoll" type="text" formControlName="rollNumber" placeholder="e.g. 2k20/CS/01" />
          </div>
          <button type="submit" class="btn-search" [disabled]="loading">
            <mat-icon>search</mat-icon>
            {{ loading ? 'Searching...' : 'Search' }}
          </button>
        </form>
      </div>

      <!-- Loading state -->
      <div class="loading-bar" *ngIf="loading">
        <div class="loading-bar-inner"></div>
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading && students.length === 0 && searched">
        <mat-icon class="empty-icon">person_search</mat-icon>
        <h3>No Students Found</h3>
        <p>Try adjusting your search filters or clear filters to view all students.</p>
        <button class="btn-clear" (click)="clearFilters()">
          <mat-icon>refresh</mat-icon>
          Clear Filters & Reload
        </button>
      </div>

      <!-- Table Card -->
      <div class="table-wrapper" *ngIf="!loading && students.length > 0">
        <div class="table-header-bar">
          <span class="record-count">
            <mat-icon>people</mat-icon>
            {{ students.length }} student{{ students.length === 1 ? '' : 's' }} found
          </span>
        </div>
        <table mat-table [dataSource]="students" class="student-table">
          <ng-container matColumnDef="cnic">
            <th mat-header-cell *matHeaderCellDef>CNIC</th>
            <td mat-cell *matCellDef="let s">
              <span class="cnic-text">{{s.cnic}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let s">
              <div class="name-cell">
                <span class="student-avatar">{{ s.name?.charAt(0) || 'S' }}</span>
                <span class="student-name">{{s.name}}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let s">
              <span class="dept-badge">{{s.department}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="academicYear">
            <th mat-header-cell *matHeaderCellDef>Year</th>
            <td mat-cell *matCellDef="let s">{{s.academicYear}}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let s">
              <button class="action-btn view-btn" title="View Details" (click)="view(s)">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayed"></tr>
          <tr mat-row *matRowDef="let row; columns: displayed;" class="data-row"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .student-page {
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* ── Page Header ── */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .page-title {
      margin: 0;
      color: #013828;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .page-subtitle {
      margin: 0.25rem 0 0;
      color: #013828;
      font-size: 0.88rem;
    }

    /* ── Search Card ── */
    .search-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }

    .search-card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: #013828;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .search-card-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #015C3A;
    }

    .filter-form {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: flex-end;
    }

    .input-group {
      flex: 1;
      min-width: 160px;
    }

    .input-group label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 0.3rem;
    }

    .input-group input {
      width: 100%;
      padding: 0.6rem 0.85rem;
      font-size: 0.88rem;
      color: #1a202c;
      background: #f7fafc;
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      box-sizing: border-box;
      font-family: inherit;
    }

    .input-group input:focus {
      border-color: #015C3A;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.12);
    }

    .input-group input::placeholder {
      color: #a0aec0;
    }

    .btn-search {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1.3rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      height: fit-content;
    }

    .btn-search:hover:not(:disabled) {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3);
      transform: translateY(-1px);
    }

    .btn-search:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      transform: none;
    }

    .btn-search mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* ── Loading ── */
    .loading-bar {
      width: 100%;
      height: 3px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .loading-bar-inner {
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, #015C3A, #D4AF37);
      border-radius: 2px;
      animation: loadSlide 1.2s ease-in-out infinite;
    }

    @keyframes loadSlide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(350%); }
    }

    /* ── Empty State ── */
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      background: #f7fafc;
      border: 2px dashed #cbd5e0;
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #a0aec0;
      margin-bottom: 0.5rem;
    }

    .empty-state h3 {
      margin: 0.5rem 0 0.25rem;
      color: #2d3748;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0 0 1.25rem;
      color: #718096;
      font-size: 0.9rem;
    }

    .btn-clear {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1.3rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: 1.5px solid #015C3A;
      border-radius: 8px;
      background: #ffffff;
      color: #015C3A;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn-clear:hover {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.25);
    }

    .btn-clear mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* ── Table ── */
    .table-wrapper {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    }

    .table-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background: #f7fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .record-count {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.82rem;
      font-weight: 600;
      color: #4a5568;
    }

    .record-count mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #015C3A;
    }

    .student-table {
      width: 100%;
    }

    :host ::ng-deep .mat-mdc-header-row {
      background: linear-gradient(135deg, #013828, #015C3A) !important;
    }

    :host ::ng-deep .mat-mdc-header-cell {
      color: #ddd22eff !important;
      font-weight: 700 !important;
      font-size: 0.85rem !important;
      letter-spacing: 0.3px;
      border-bottom: 2px solid #b7d8c4 !important;
    }

    :host ::ng-deep .mat-mdc-cell {
      font-size: 0.88rem;
      color: #2d3748;
      padding-top: 0.6rem;
      padding-bottom: 0.6rem;
    }

    .data-row {
      transition: background 0.15s ease;
    }

    :host ::ng-deep .data-row:hover {
      background: #f0faf4 !important;
    }

    /* ── Name Cell ── */
    .name-cell {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .student-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #013828, #015C3A);
      color: #D4AF37;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .student-name {
      font-weight: 500;
    }

    /* ── CNIC ── */
    .cnic-text {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.84rem;
      color: #4a5568;
      letter-spacing: 0.3px;
    }

    /* ── Dept Badge ── */
    .dept-badge {
      display: inline-block;
      padding: 0.2rem 0.7rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      background: #e8f5ef;
      color: #22543d;
    }

    /* ── Action Buttons ── */
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .view-btn {
      background: #ebf8ff;
      color: #2b6cb0;
    }

    .view-btn:hover {
      background: #bee3f8;
      color: #2c5282;
      box-shadow: 0 2px 6px rgba(43, 108, 176, 0.2);
    }
  `]
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
  loading = false;
  searched = false;

  ngOnInit() {
    this.search(); // load all students on component init
  }

  search() {
    this.loading = true;
    this.admin.searchStudents(this.filterForm.value).subscribe({
      next: (data) => {
        console.log('Students API Raw Response:', data);
        this.students = [...data];
        this.loading = false;
        this.searched = true;
      },
      error: (err) => {
        console.error('Failed to load students', err);
        this.loading = false;
        this.searched = true;
        this.snack.open('Failed to load students', 'Dismiss', { duration: 3000 });
      }
    });
  }

  clearFilters() {
    this.filterForm.reset({ name: '', cnic: '', rollNumber: '' });
    this.search();
  }

  view(student: StudentDto) {
    this.dialog.open(StudentViewDialogComponent, {
      width: '520px',
      data: student
    });
  }
}