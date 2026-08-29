// src/app/admin/merit/admin-merit-allocation.component.ts
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../core/admin/admin.service';

export interface MeritCandidate {
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
  meritScore?: number;
  rank?: number;
  allocatedHostel?: string;
}

@Component({
  selector: 'app-admin-merit-allocation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule
  ],
  template: `
    <div class="merit-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">Merit & Allocation</h2>
          <p class="page-subtitle">Execute eligibility checks, generate merit rankings, and allocate dormitory rooms</p>
        </div>
      </div>

      <!-- Action & Operations Card -->
      <div class="operations-card">
        <div class="card-header-bar">
          <mat-icon class="header-icon">auto_awesome</mat-icon>
          <span>Allocation Workflow Operations</span>
        </div>
        
        <div class="actions-grid">
          <button class="btn-op btn-eligibility" (click)="runEligibility()" [disabled]="loading">
            <mat-icon>verified_user</mat-icon>
            <span>Run Eligibility Check</span>
          </button>

          <button class="btn-op btn-merit" (click)="generateMerit()" [disabled]="loading">
            <mat-icon>format_list_numbered</mat-icon>
            <span>Generate Merit List</span>
          </button>

          <button class="btn-op btn-allocate" (click)="allocate()" [disabled]="loading">
            <mat-icon>meeting_room</mat-icon>
            <span>Allocate Rooms</span>
          </button>

          <button class="btn-op btn-second-round" (click)="secondRound()" [disabled]="loading">
            <mat-icon>autorenew</mat-icon>
            <span>Start Second Round</span>
          </button>

          <button class="btn-op btn-refresh" (click)="loadEligibleCandidates()" [disabled]="loading">
            <mat-icon>refresh</mat-icon>
            <span>Reload Results</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-bar" *ngIf="loading">
        <div class="loading-bar-inner"></div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && results.length === 0">
        <mat-icon class="empty-icon">assessment</mat-icon>
        <h3>No Eligible Applications Remaining</h3>
        <p>All current applications were filtered out based on active District & Campus eligibility rules.</p>
        <button class="btn-action-primary" (click)="runEligibility()">
          <mat-icon>verified_user</mat-icon>
          Re-run Eligibility Check
        </button>
      </div>

      <!-- Results Table -->
      <div class="table-wrapper" *ngIf="!loading && results.length > 0">
        <div class="table-header-bar">
          <span class="record-count">
            <mat-icon>equalizer</mat-icon>
            {{ results.length }} eligible candidate{{ results.length === 1 ? '' : 's' }} in merit queue
          </span>
        </div>

        <table mat-table [dataSource]="results" class="merit-table">
          <!-- Rank Column -->
          <ng-container matColumnDef="rank">
            <th mat-header-cell *matHeaderCellDef># Rank</th>
            <td mat-cell *matCellDef="let r; let i = index">
              <span class="rank-badge" [class.top-rank]="(r.rank || i + 1) <= 3">
                #{{ r.rank || (i + 1) }}
              </span>
            </td>
          </ng-container>

          <!-- Candidate Name & Roll No Column -->
          <ng-container matColumnDef="candidate">
            <th mat-header-cell *matHeaderCellDef>Candidate Details</th>
            <td mat-cell *matCellDef="let r">
              <div class="student-cell">
                <span class="student-avatar">{{ r.name?.charAt(0) || 'S' }}</span>
                <div>
                  <div class="candidate-name">{{ r.name }}</div>
                  <div class="candidate-roll">{{ r.rollNo }} • CNIC: {{ r.cnic }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <!-- Department & Campus Column -->
          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department & Campus</th>
            <td mat-cell *matCellDef="let r">
              <div class="dept-text">{{ r.department }}</div>
              <div class="sub-text">{{ r.campus || 'Main Campus' }}</div>
            </td>
          </ng-container>

          <!-- District Column -->
          <ng-container matColumnDef="district">
            <th mat-header-cell *matHeaderCellDef>District</th>
            <td mat-cell *matCellDef="let r">
              <span class="district-chip">{{ r.district }}</span>
            </td>
          </ng-container>

          <!-- Merit Score Column -->
          <ng-container matColumnDef="meritScore">
            <th mat-header-cell *matHeaderCellDef>Merit Score</th>
            <td mat-cell *matCellDef="let r">
              <div class="score-cell">
                <span class="score-number">{{ (r.meritScore || 82.5) | number:'1.1-2' }}</span>
                <div class="score-bar-bg">
                  <div class="score-bar-fill" [style.width.%]="r.meritScore || 82.5"></div>
                </div>
              </div>
            </td>
          </ng-container>

          <!-- Allocated Hostel Column -->
          <ng-container matColumnDef="allocatedHostel">
            <th mat-header-cell *matHeaderCellDef>Allocated Hostel</th>
            <td mat-cell *matCellDef="let r">
              <span class="hostel-badge" [class.allocated]="r.allocatedHostel" [class.unallocated]="!r.allocatedHostel">
                <mat-icon class="badge-icon">{{ r.allocatedHostel ? 'domain' : 'hourglass_empty' }}</mat-icon>
                {{ r.allocatedHostel ? r.allocatedHostel : 'Pending Allocation' }}
              </span>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let r">
              <span class="status-chip" [class.status-success]="r.allocatedHostel" [class.status-pending]="!r.allocatedHostel">
                {{ r.allocatedHostel ? 'Allocated' : 'Eligible' }}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayed"></tr>
          <tr mat-row *matRowDef="let row; columns: displayed;" class="data-row"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .merit-page {
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

    /* ── Operations Card ── */
    .operations-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }

    .card-header-bar {
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

    .header-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #015C3A;
    }

    .actions-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      align-items: center;
    }

    .btn-op {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      font-size: 0.88rem;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn-op mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .btn-op:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .btn-op:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      transform: none;
    }

    /* Operations Button Variations */
    .btn-eligibility {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(1, 92, 58, 0.2);
    }

    .btn-eligibility:hover:not(:disabled) {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.35);
    }

    .btn-merit {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.2);
    }

    .btn-merit:hover:not(:disabled) {
      background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
    }

    .btn-allocate {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(217, 119, 6, 0.2);
    }

    .btn-allocate:hover:not(:disabled) {
      background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
    }

    .btn-second-round {
      background: #ffffff;
      color: #015C3A;
      border: 1.5px solid #015C3A;
    }

    .btn-second-round:hover:not(:disabled) {
      background: #f0faf4;
      box-shadow: 0 2px 8px rgba(1, 92, 58, 0.15);
    }

    .btn-refresh {
      background: #f7fafc;
      color: #4a5568;
      border: 1.5px solid #cbd5e0;
    }

    .btn-refresh:hover:not(:disabled) {
      background: #edf2f7;
      color: #2d3748;
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
      padding: 3.5rem 1.5rem;
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
      margin: 0 0 1.5rem;
      color: #718096;
      font-size: 0.9rem;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }

    .btn-action-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.65rem 1.4rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn-action-primary:hover {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3);
    }

    /* ── Table Wrapper ── */
    .table-wrapper {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      background: #ffffff;
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

    .merit-table {
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
      padding-top: 0.65rem;
      padding-bottom: 0.65rem;
    }

    .data-row {
      transition: background 0.15s ease;
    }

    :host ::ng-deep .data-row:hover {
      background: #f0faf4 !important;
    }

    /* ── Rank Badge ── */
    .rank-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.82rem;
      background: #edf2f7;
      color: #4a5568;
    }

    .rank-badge.top-rank {
      background: #fefcbf;
      color: #975a16;
      border: 1px solid #f6e05e;
    }

    /* ── Candidate Details Cell ── */
    .student-cell {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .student-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828, #015C3A);
      color: #D4AF37;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .candidate-name {
      font-weight: 600;
      color: #1a202c;
    }

    .candidate-roll {
      font-size: 0.76rem;
      color: #718096;
      font-family: monospace;
    }

    .dept-text {
      font-weight: 600;
      color: #2d3748;
    }

    .sub-text {
      font-size: 0.76rem;
      color: #718096;
    }

    .district-chip {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      background: #e2e8f0;
      color: #2d3748;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    /* ── Score Cell ── */
    .score-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      max-width: 180px;
    }

    .score-number {
      font-weight: 700;
      color: #013828;
      min-width: 36px;
    }

    .score-bar-bg {
      flex: 1;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .score-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #015C3A, #D4AF37);
      border-radius: 3px;
    }

    /* ── Hostel Badge ── */
    .hostel-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.7rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .hostel-badge.allocated {
      background: #e8f5ef;
      color: #22543d;
    }

    .hostel-badge.unallocated {
      background: #edf2f7;
      color: #718096;
    }

    .badge-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* ── Status Chip ── */
    .status-chip {
      display: inline-block;
      padding: 0.2rem 0.65rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .status-success {
      background: #c6f6d5;
      color: #22543d;
    }

    .status-pending {
      background: #feebc8;
      color: #744210;
    }
  `]
})
export class AdminMeritAllocationComponent implements OnInit {
  private admin = inject(AdminService);
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  results: MeritCandidate[] = [];
  displayed = ['rank', 'candidate', 'department', 'district', 'meritScore', 'allocatedHostel', 'status'];
  loading = false;

  ngOnInit() {
    this.loadEligibleCandidates();
  }

  loadEligibleCandidates() {
    this.loading = true;
    let apps = this.getStoredApplications();

    if (apps.length === 0) {
      apps = this.generateInitialApplications();
      this.saveStoredApplications(apps);
    }

    // Evaluate eligibility for all applications & update status
    const updatedApps = apps.map(app => {
      if (app.status === 'In Processing' || app.status === 'Ineligible') {
        const eligible = this.isApplicationEligible(app);
        return {
          ...app,
          status: eligible ? 'In Processing' : 'Ineligible'
        };
      }
      return app;
    });

    this.saveStoredApplications(updatedApps);

    // Keep ONLY eligible candidates on Merit & Allocation page
    const eligibleQueue = updatedApps.filter(a =>
      a.status !== 'Ineligible' &&
      a.status !== 'Not Processed' &&
      a.status !== 'Room Not Assigned'
    );

    eligibleQueue.forEach((app) => {
      if (!app.meritScore) {
        const score = 98.5 - ((app.id * 37) % 33.5);
        app.meritScore = parseFloat(score.toFixed(2));
      }
    });

    eligibleQueue.sort((a, b) => (b.meritScore || 0) - (a.meritScore || 0));
    eligibleQueue.forEach((app, idx) => {
      app.rank = idx + 1;
    });

    this.results = eligibleQueue;
    this.loading = false;
    this.cdr.detectChanges();
  }

  runEligibility() {
    this.loading = true;
    this.cdr.detectChanges();

    let apps = this.getStoredApplications();
    if (apps.length === 0) {
      apps = this.generateInitialApplications();
    }

    let ineligibleCount = 0;

    apps = apps.map(app => {
      if (app.status === 'In Processing' || app.status === 'Ineligible') {
        const eligible = this.isApplicationEligible(app);
        if (eligible) {
          return { ...app, status: 'In Processing' };
        } else {
          ineligibleCount++;
          return { ...app, status: 'Ineligible' };
        }
      }
      return app;
    });

    this.saveStoredApplications(apps);

    // Filter out ineligible ones completely
    const remainingEligible = apps.filter(a =>
      a.status !== 'Ineligible' &&
      a.status !== 'Not Processed' &&
      a.status !== 'Room Not Assigned'
    );

    remainingEligible.forEach((app) => {
      if (!app.meritScore) {
        const score = 98.5 - ((app.id * 37) % 33.5);
        app.meritScore = parseFloat(score.toFixed(2));
      }
    });

    remainingEligible.sort((a, b) => (b.meritScore || 0) - (a.meritScore || 0));
    remainingEligible.forEach((app, idx) => {
      app.rank = idx + 1;
    });

    this.results = remainingEligible;
    this.loading = false;
    this.cdr.detectChanges();

    this.snack.open(
      `✅ Eligibility Check Completed: ${remainingEligible.length} eligible applications remaining. ${ineligibleCount} ineligible applications removed.`,
      'OK',
      { duration: 5000 }
    );
  }

  generateMerit() {
    this.loading = true;
    this.cdr.detectChanges();

    let apps = this.getStoredApplications();
    const eligible = apps.filter(a => a.status === 'In Processing' || a.status === 'Room Allocated' || a.status === 'Allocation Complete');

    if (eligible.length === 0) {
      this.snack.open('No eligible applications found to rank.', 'OK', { duration: 3000 });
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    eligible.forEach(app => {
      const score = 98.5 - ((app.id * 37) % 33.5);
      app.meritScore = parseFloat(score.toFixed(2));
    });

    eligible.sort((a, b) => (b.meritScore || 0) - (a.meritScore || 0));
    eligible.forEach((r, idx) => {
      r.rank = idx + 1;
    });

    this.results = eligible;
    this.saveStoredApplications(apps);
    this.loading = false;
    this.cdr.detectChanges();

    this.snack.open(`✅ Merit List generated successfully: ${eligible.length} candidates ranked.`, 'OK', { duration: 4000 });
  }

  allocate() {
    this.loading = true;
    this.cdr.detectChanges();

    let apps = this.getStoredApplications();
    const hostelsList = [
      'Marvi Girls Hostel', 'Lal Shahbaz Hostel', 'Post Graduate (P.G) Girls Hostel',
      'Under Graduate (U.G) Girls Hostel', 'Allama Iqbal Hostel', 'Blocks Hostel',
      'Shaheed Benazir Bhutto International Hostel', 'Government Federal Hostel'
    ];

    let allocatedCount = 0;
    apps = apps.map(app => {
      if (app.status === 'In Processing') {
        const matchingResult = this.results.find(r => r.id === app.id);
        const rank = matchingResult?.rank || 999;
        if (rank <= 90) {
          allocatedCount++;
          const hostelName = hostelsList[(app.id - 1) % hostelsList.length];
          return {
            ...app,
            status: 'Room Allocated',
            allocatedHostel: hostelName
          };
        }
      }
      return app;
    });

    this.saveStoredApplications(apps);
    this.loadEligibleCandidates();

    this.snack.open(`✅ Room Allocation complete: ${allocatedCount} candidates allocated to hostels based on merit rank.`, 'OK', { duration: 4000 });
  }

  secondRound() {
    this.snack.open('✅ Second round allocation process initiated.', 'OK', { duration: 3000 });
  }

  private isApplicationEligible(app: MeritCandidate): boolean {
    // 1. Load Campus Rules (fallback to default 7 campuses)
    let campusList: any[] = [];
    try {
      const stored = localStorage.getItem('sdp_campuses_eligibility');
      if (stored) campusList = JSON.parse(stored);
    } catch (e) {}

    if (!campusList || campusList.length === 0) {
      campusList = [
        { campusId: 1, name: 'Allama I.I. Kazi Campus (Main Campus)', code: 'MAIN-JAM', isEligible: true, location: 'Jamshoro' },
        { campusId: 2, name: 'Elsa Kazi Campus (Old Campus)', code: 'OLD-HYD', isEligible: true, location: 'Hyderabad' },
        { campusId: 3, name: 'Laar Campus (Badin)', code: 'LAAR-BDN', isEligible: true, location: 'Badin' },
        { campusId: 4, name: 'Mohtarma Benazir Bhutto Shaheed Campus (Dadu)', code: 'MBBS-DAD', isEligible: true, location: 'Dadu' },
        { campusId: 5, name: 'Khan Bahadur Syed Allahndo Shah Campus (Naushahro Feroze)', code: 'KBSAS-NF', isEligible: true, location: 'Naushahro Feroze' },
        { campusId: 6, name: 'Thatta Campus (Thatta)', code: 'TTA-TTA', isEligible: true, location: 'Thatta' },
        { campusId: 7, name: 'Thar Campus (Tharparkar)', code: 'THAR-THAR', isEligible: true, location: 'Tharparkar' }
      ];
    }

    // 2. Load District Rules (fallback to default districts)
    let districtList: any[] = [];
    try {
      const stored = localStorage.getItem('sdp_districts_eligibility');
      if (stored) districtList = JSON.parse(stored);
    } catch (e) {}

    if (!districtList || districtList.length === 0) {
      districtList = [
        { districtId: 1, name: 'Hyderabad', province: 'Sindh', isAllowed: true },
        { districtId: 2, name: 'Jamshoro', province: 'Sindh', isAllowed: true },
        { districtId: 3, name: 'Sukkur', province: 'Sindh', isAllowed: true },
        { districtId: 4, name: 'Larkana', province: 'Sindh', isAllowed: true },
        { districtId: 5, name: 'Badin', province: 'Sindh', isAllowed: true },
        { districtId: 6, name: 'Dadu', province: 'Sindh', isAllowed: true },
        { districtId: 7, name: 'Naushahro Feroze', province: 'Sindh', isAllowed: true },
        { districtId: 8, name: 'Thatta', province: 'Sindh', isAllowed: true },
        { districtId: 9, name: 'Tharparkar', province: 'Sindh', isAllowed: true },
        { districtId: 10, name: 'Mirpurkhas', province: 'Sindh', isAllowed: true },
        { districtId: 11, name: 'Nawabshah', province: 'Sindh', isAllowed: true },
        { districtId: 12, name: 'Khairpur', province: 'Sindh', isAllowed: true },
        { districtId: 13, name: 'Sanghar', province: 'Sindh', isAllowed: true },
        { districtId: 14, name: 'Shikarpur', province: 'Sindh', isAllowed: true },
        { districtId: 15, name: 'Jacobabad', province: 'Sindh', isAllowed: true },
        { districtId: 16, name: 'Ghotki', province: 'Sindh', isAllowed: true },
        { districtId: 17, name: 'Kashmore', province: 'Sindh', isAllowed: true },
        { districtId: 18, name: 'Umerkot', province: 'Sindh', isAllowed: true },
        { districtId: 19, name: 'Tando Allahyar', province: 'Sindh', isAllowed: true },
        { districtId: 20, name: 'Tando Muhammad Khan', province: 'Sindh', isAllowed: true },
        { districtId: 21, name: 'Matiari', province: 'Sindh', isAllowed: true },
        { districtId: 22, name: 'Karachi', province: 'Sindh', isAllowed: true }
      ];
    }

    // Check Campus Rule
    const appCampus = (app.campus || '').trim().toLowerCase();
    const matchedCampus = campusList.find(c => {
      const cName = c.name.trim().toLowerCase();
      const cLoc = (c.location || '').trim().toLowerCase();
      const cCode = (c.code || '').trim().toLowerCase();
      return appCampus.includes(cName) || cName.includes(appCampus) ||
             (cLoc && appCampus.includes(cLoc)) ||
             (cCode && appCampus.includes(cCode));
    });

    if (matchedCampus && matchedCampus.isEligible === false) {
      return false; // Deselected Campus -> Ineligible
    }

    // Check District Rule
    const appDistrict = (app.district || '').trim().toLowerCase();
    const matchedDistrict = districtList.find(d => {
      const dName = d.name.trim().toLowerCase();
      return appDistrict.includes(dName) || dName.includes(appDistrict);
    });

    if (matchedDistrict && matchedDistrict.isAllowed === false) {
      return false; // Disallowed District -> Ineligible
    }

    return true;
  }

  private getStoredApplications(): MeritCandidate[] {
    try {
      const stored = localStorage.getItem('sdp_all_applications');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return [];
  }

  private saveStoredApplications(apps: MeritCandidate[]): void {
    try {
      localStorage.setItem('sdp_all_applications', JSON.stringify(apps));
    } catch (e) {}
  }

  private generateInitialApplications(): MeritCandidate[] {
    const maleFirst = ['Ali', 'Muhammad', 'Zubair', 'Bilal', 'Usman', 'Hamza', 'Tariq', 'Ahmed', 'Fahad', 'Saad', 'Asad', 'Owais', 'Shahzaib', 'Noman', 'Rashid', 'Waqas', 'Hassan', 'Hussain', 'Zayan', 'Danish', 'Sheraz', 'Kashif', 'Farhan', 'Imran', 'Kamran', 'Zahir', 'Adeel', 'Waseem', 'Saeed', 'Shoaib'];
    const femaleFirst = ['Sara', 'Fatima', 'Ayesha', 'Zainab', 'Mariam', 'Sana', 'Hira', 'Laiba', 'Anum', 'Khadija', 'Dua', 'Iqra', 'Mehreen', 'Bisma', 'Nimra', 'Mahnoor', 'Sadia', 'Syeda', 'Sidra', 'Tayyaba', 'Areeba', 'Bushra', 'Kinza', 'Nida', 'Sobiah', 'Mona', 'Sumaira', 'Mehwish', 'Samina', 'Amber'];
    const lastNames = ['Raza', 'Khan', 'Ali', 'Ahmed', 'Tariq', 'Bibi', 'Hassan', 'Shah', 'Sheikh', 'Soomro', 'Junejo', 'Talpur', 'Kalhoro', 'Mangi', 'Syed', 'Solangi', 'Abro', 'Mahar', 'Chandio', 'Bhutto', 'Larik', 'Khoso', 'Buriro', 'Memon'];

    const departments = [
      { name: 'Computer Science', code: 'CS' },
      { name: 'Software Engineering', code: 'SWE' },
      { name: 'Information Technology', code: 'IT' },
      { name: 'Business Administration', code: 'BBA' },
      { name: 'Electrical Engineering', code: 'EE' },
      { name: 'Civil Engineering', code: 'CE' },
      { name: 'Physics', code: 'PHY' },
      { name: 'Chemistry', code: 'CHEM' },
      { name: 'English Literature', code: 'ENG' },
      { name: 'Economics', code: 'ECO' },
      { name: 'Law', code: 'LAW' },
      { name: 'Pharmacy', code: 'PHARM' },
      { name: 'Medicine', code: 'MBBS' }
    ];

    const campuses = [
      'Allama I.I. Kazi Campus (Main Campus)',
      'Elsa Kazi Campus (Old Campus)',
      'Laar Campus (Badin)',
      'Mohtarma Benazir Bhutto Shaheed Campus (Dadu)',
      'Khan Bahadur Syed Allahndo Shah Campus (Naushahro Feroze)',
      'Thatta Campus (Thatta)',
      'Thar Campus (Tharparkar)'
    ];

    const districts = [
      'Hyderabad', 'Jamshoro', 'Sukkur', 'Larkana', 'Badin', 'Dadu',
      'Naushahro Feroze', 'Thatta', 'Tharparkar', 'Mirpurkhas', 'Nawabshah',
      'Khairpur', 'Sanghar', 'Shikarpur', 'Jacobabad', 'Ghotki', 'Kashmore',
      'Umerkot', 'Tando Allahyar', 'Tando Muhammad Khan', 'Matiari', 'Karachi'
    ];

    const list: MeritCandidate[] = [];
    const statuses = [
      'In Processing', 'In Processing', 'In Processing', 'In Processing', 'In Processing',
      'Not Processed', 'Room Allocated', 'Allocation Complete', 'Room Not Assigned'
    ];

    for (let i = 1; i <= 207; i++) {
      const isFemale = i % 3 === 0;
      const firstName = isFemale ? femaleFirst[(i - 1) % femaleFirst.length] : maleFirst[(i - 1) % maleFirst.length];
      const lastName = lastNames[(i * 7) % lastNames.length];
      const dept = departments[(i - 1) % departments.length];
      const dist = districts[(i * 3) % districts.length];
      const camp = campuses[(i - 1) % campuses.length];
      const batchYear = 2020 + (i % 5);
      const rollSeq = String(1 + ((i * 5) % 99)).padStart(3, '0');
      const status = statuses[(i - 1) % statuses.length];

      list.push({
        id: i,
        cnic: `41304-${1000000 + i * 11111}-${(i % 9) + 1}`,
        name: `${firstName} ${lastName}`,
        rollNo: `${dept.code}-${String(batchYear).slice(2)}-${rollSeq}`,
        department: dept.name,
        province: 'Sindh',
        district: dist,
        campus: camp,
        batch: `${batchYear}`,
        status: status
      });
    }

    return list;
  }
}
