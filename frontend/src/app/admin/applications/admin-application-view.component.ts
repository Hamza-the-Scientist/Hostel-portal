import { Component, inject, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AdminService } from '../../core/admin/admin.service';
import { getUniformApplicationsDtos } from '../../core/models/uniform-data';

interface ApplicationViewDto {
  id: number;
  cnic: string;
  name: string;
  rollNo: string;
  department: string;
  province: string;
  district: string;
  campus: string;
  batch: string;
  status: string;
  eligibilityReason?: string;
}

@Component({
  selector: 'app-admin-application-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="student-dialog">
      <div class="dialog-header">
        <div class="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h2>Application Details</h2>
        <p class="header-subtitle">Complete student & application information</p>
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
            <span class="value cnic-text">{{data.cnic}}</span>
          </div>
          <div class="detail-item">
            <span class="label">
              <mat-icon class="detail-icon">tag</mat-icon>
              Roll Number
            </span>
            <span class="value">{{data.rollNo}}</span>
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
              <mat-icon class="detail-icon">account_balance</mat-icon>
              Campus
            </span>
            <span class="value">{{data.campus || 'Allama I.I. Kazi Campus (Main Campus)'}}</span>
          </div>
          <div class="detail-item">
            <span class="label">
              <mat-icon class="detail-icon">calendar_today</mat-icon>
              University Year / Batch
            </span>
            <span class="value">{{data.batch}}</span>
          </div>
          <div class="detail-item">
            <span class="label">
              <mat-icon class="detail-icon">map</mat-icon>
              Province
            </span>
            <span class="value">{{data.province}}</span>
          </div>
          <div class="detail-item">
            <span class="label">
              <mat-icon class="detail-icon">location_on</mat-icon>
              District
            </span>
            <span class="value">{{data.district}}</span>
          </div>
          <div class="detail-item" *ngIf="data.eligibilityReason">
            <span class="label">
              <mat-icon class="detail-icon">verified_user</mat-icon>
              Eligibility Details
            </span>
            <span class="value reason-text">{{data.eligibilityReason}}</span>
          </div>
          <div class="detail-item">
            <span class="label">
              <mat-icon class="detail-icon">info</mat-icon>
              Status
            </span>
            <span class="value">
              <span class="status-badge" [ngClass]="getBadgeClass(data.status)">{{ data.status }}</span>
            </span>
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

    .cnic-text {
      font-family: monospace;
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
    
    /* ── Status Badge Styles inside modal ── */
    .status-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; white-space: nowrap; }
    .badge-neutral { background: #edf2f7; color: #4a5568; }
    .badge-info { background: #ebf8ff; color: #2b6cb0; }
    .badge-warning { background: #fef3c7; color: #b45309; }
    .badge-success { background: #e6ffed; color: #22543d; }
    .badge-danger { background: #fff5f5; color: #c53030; }
  `]
})
export class AdminApplicationDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ApplicationViewDto) { }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Not Processed': return 'badge-neutral';
      case 'In Processing': return 'badge-info';
      case 'Ineligible': return 'badge-danger';
      case 'Room Allocated': return 'badge-warning';
      case 'Allocation Complete': return 'badge-success';
      case 'Room Not Assigned': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }
}

@Component({
  selector: 'app-admin-application-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatIconModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="hostel-page">
      <div class="page-header">
        <div>
          <h2 class="page-title">Applications</h2>
          <p class="page-subtitle">Manage and process student hostel applications</p>
        </div>
      </div>

      <div class="controls-container">
        <div class="search-box">
          <mat-icon class="search-icon">search</mat-icon>
          <input type="text" [formControl]="searchControl" placeholder="Search by CNIC, Name, Roll No or Department..." />
        </div>
        <div class="filter-box">
          <select [formControl]="statusControl" class="status-select">
            <option value="All Statuses">All Statuses</option>
            <option value="In Processing">In Processing</option>
            <option value="Not Processed">Not Processed</option>
            <option value="Ineligible">Ineligible</option>
            <option value="Room Allocated">Room Allocated</option>
            <option value="Allocation Complete">Allocation Complete</option>
            <option value="Room Not Assigned">Room Not Assigned</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table mat-table [dataSource]="filteredApplications()" class="hostel-table">
          <ng-container matColumnDef="cnic">
            <th mat-header-cell *matHeaderCellDef>Student CNIC</th>
            <td mat-cell *matCellDef="let app">
              <span class="cnic-text">{{ app.cnic }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let app">
              <div class="hostel-name-cell">
                <span class="hostel-avatar">{{ app.name?.charAt(0) || 'U' }}</span>
                <span>{{ app.name }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="rollNo">
            <th mat-header-cell *matHeaderCellDef>Roll No</th>
            <td mat-cell *matCellDef="let app">{{ app.rollNo }}</td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let app">{{ app.department }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let app">
              <span class="status-badge" [ngClass]="getBadgeClass(app.status)">
                {{ app.status }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let app">
              <button class="action-btn view-btn" title="View" (click)="viewApplication(app)">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayed"></tr>
          <tr mat-row *matRowDef="let row; columns: displayed;" class="data-row"></tr>
        </table>
        
        <div class="empty-state" *ngIf="filteredApplications().length === 0">
           <mat-icon class="empty-icon">search_off</mat-icon>
           <h3>No Applications Found</h3>
           <p>Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hostel-page {
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* ── Header ── */
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

    /* ── Controls ── */
    .controls-container {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 300px;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      color: #718096;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .search-box input {
      width: 100%;
      padding: 0.6rem 1rem 0.6rem 2.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      color: #2d3748;
      background: #fff;
      transition: all 0.2s;
    }

    .search-box input:focus {
      outline: none;
      border-color: #015C3A;
      box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.1);
    }

    .filter-box {
      min-width: 200px;
    }

    .status-select {
      width: 100%;
      padding: 0.6rem 2rem 0.6rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      color: #2d3748;
      background: #fff;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23718096%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
      background-repeat: no-repeat;
      background-position: right 0.7rem top 50%;
      background-size: 0.65rem auto;
      transition: all 0.2s;
    }

    .status-select:focus {
      outline: none;
      border-color: #015C3A;
      box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.1);
    }

    /* ── Empty State ── */
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      background: #f7fafc;
      border-top: 1px solid #e2e8f0;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #a0aec0;
      margin-bottom: 0.5rem;
    }

    .empty-state h3 {
      margin: 0.5rem 0 0.25rem;
      color: #2d3748;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0;
      color: #718096;
      font-size: 0.9rem;
    }

    /* ── Table ── */
    .table-wrapper {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      background: #fff;
    }

    .hostel-table {
      width: 100%;
    }

    :host ::ng-deep .mat-mdc-header-row {
      background:linear-gradient(135deg, #013828, #015C3A) !important;
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
    .hostel-name-cell {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .hostel-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828, #015C3A);
      color: #D4AF37;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .cnic-text {
      font-family: monospace;
      color: #4a5568;
      background: #f1f5f9;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    /* ── Status Badge ── */
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .badge-neutral { background: #edf2f7; color: #4a5568; }
    .badge-info { background: #ebf8ff; color: #2b6cb0; }
    .badge-warning { background: #fef3c7; color: #b45309; }
    .badge-success { background: #e6ffed; color: #22543d; }
    .badge-danger { background: #fff5f5; color: #c53030; }

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

    @media (max-width: 768px) {
      .controls-container {
        flex-direction: column;
        align-items: stretch;
      }
      .search-box, .filter-box {
        width: 100%;
      }
      .table-wrapper {
        overflow-x: auto;
      }
    }
  `]
})
export class AdminApplicationViewComponent implements OnInit {
  private admin = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  searchControl = new FormControl('');
  statusControl = new FormControl('All Statuses');

  searchQuery = signal('');
  statusQuery = signal('All Statuses');

  allApplications = signal<ApplicationViewDto[]>([]);
  displayed = ['cnic', 'name', 'rollNo', 'department', 'status', 'actions'];

  ngOnInit() {
    this.loadApplications();

    this.searchControl.valueChanges.subscribe(val => {
      this.searchQuery.set(val || '');
    });
    this.statusControl.valueChanges.subscribe(val => {
      this.statusQuery.set(val || 'All Statuses');
    });
  }

  loadApplications() {
    try {
      const stored = localStorage.getItem('sdp_all_applications');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 30) {
          this.allApplications.set(parsed);
          return;
        }
      }
    } catch (e) {}

    const fresh = this.getMockApplications();
    try {
      localStorage.setItem('sdp_all_applications', JSON.stringify(fresh));
    } catch (e) {}
    this.allApplications.set(fresh);
  }

  filteredApplications = computed(() => {
    let list = this.allApplications();
    const search = this.searchQuery().toLowerCase().trim();
    const status = this.statusQuery();

    if (status !== 'All Statuses') {
      list = list.filter(app => app.status === status);
    }

    if (search) {
      list = list.filter(app =>
        app.cnic.toLowerCase().includes(search) ||
        app.name.toLowerCase().includes(search) ||
        app.rollNo.toLowerCase().includes(search) ||
        app.department.toLowerCase().includes(search)
      );
    }

    return list;
  });

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Not Processed': return 'badge-neutral';
      case 'In Processing': return 'badge-info';
      case 'Ineligible': return 'badge-danger';
      case 'Room Allocated': return 'badge-warning';
      case 'Allocation Complete': return 'badge-success';
      case 'Room Not Assigned': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }

  viewApplication(app: ApplicationViewDto) {
    this.dialog.open(AdminApplicationDetailDialogComponent, {
      data: app,
      width: '480px'
    });
  }

  private getMockApplications(): ApplicationViewDto[] {
    return getUniformApplicationsDtos();
  }
}
