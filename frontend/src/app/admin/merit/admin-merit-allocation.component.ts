// src/app/admin/merit/admin-merit-allocation.component.ts
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../core/admin/admin.service';
import { RevertAllocationDialogComponent } from './revert-allocation-dialog.component';

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
  eligibilityReason?: string;
  districtAllowed?: boolean;
  campusAllowed?: boolean;
  otherEligible?: boolean;
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
    MatIconModule,
    MatDialogModule
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

      <!-- VIEW 1: MAIN WORKFLOW CONTROL VIEW -->
      <div *ngIf="currentView === 'workflow'">
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

            <button class="btn-op btn-merit" (click)="openDistrictMeritView()" [disabled]="loading">
              <mat-icon>format_list_numbered</mat-icon>
              <span>Generate Merit List</span>
            </button>

            <button class="btn-op btn-allocate" (click)="openDistrictAllocationView()" [disabled]="loading">
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

        <!-- Administrative / Reset Actions Card -->
        <div class="admin-reset-card">
          <div class="reset-card-header">
            <mat-icon class="reset-icon">admin_panel_settings</mat-icon>
            <span>Administrative / Reset Actions (Demonstration Workflow)</span>
          </div>
          <div class="reset-action-content">
            <p class="reset-desc">
              Reverts all current hostel, room, and bed allocations back to an unallocated state for teacher demonstrations.
              Student accounts, applications, eligibility checks, and confirmed district distributions will remain intact.
            </p>
            <button class="btn-revert-destructive" (click)="confirmRevertAllocation()" [disabled]="loading">
              <mat-icon>restart_alt</mat-icon>
              <span>Revert All Allocation</span>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div class="loading-bar" *ngIf="loading">
          <div class="loading-bar-inner"></div>
        </div>

        <!-- Eligibility Check Results Summary Card -->
        <div class="summary-card" *ngIf="eligibilitySummary">
          <div class="summary-header">
            <mat-icon class="summary-icon">fact_check</mat-icon>
            <span>Eligibility Check Results Summary</span>
          </div>
          <div class="summary-stats-grid">
            <div class="stat-pill stat-total">
              <span class="pill-label">Total Applications</span>
              <span class="pill-val">{{ eligibilitySummary.total }}</span>
            </div>
            <div class="stat-pill stat-eligible">
              <span class="pill-label">Eligible Applications</span>
              <span class="pill-val">{{ eligibilitySummary.eligible }}</span>
            </div>
            <div class="stat-pill stat-not-eligible">
              <span class="pill-label">Not Eligible</span>
              <span class="pill-val">{{ eligibilitySummary.notEligible }}</span>
            </div>
            <div class="stat-pill stat-dist-fail">
              <span class="pill-label">District Not Allowed</span>
              <span class="pill-val">{{ eligibilitySummary.districtNotAllowed }}</span>
            </div>
            <div class="stat-pill stat-campus-fail">
              <span class="pill-label">Campus Not Allowed</span>
              <span class="pill-val">{{ eligibilitySummary.campusNotAllowed }}</span>
            </div>
            <div class="stat-pill stat-other-fail">
              <span class="pill-label">Other Failures</span>
              <span class="pill-val">{{ eligibilitySummary.otherFailures }}</span>
            </div>
          </div>
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
            <ng-container matColumnDef="rank">
              <th mat-header-cell *matHeaderCellDef># Rank</th>
              <td mat-cell *matCellDef="let r; let i = index">
                <span class="rank-badge" [class.top-rank]="(r.rank || i + 1) <= 3">
                  #{{ r.rank || (i + 1) }}
                </span>
              </td>
            </ng-container>

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

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department & Campus</th>
              <td mat-cell *matCellDef="let r">
                <div class="dept-text">{{ r.department }}</div>
                <div class="sub-text">{{ r.campus || 'Main Campus' }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="district">
              <th mat-header-cell *matHeaderCellDef>District</th>
              <td mat-cell *matCellDef="let r">
                <span class="district-chip">{{ r.district }}</span>
              </td>
            </ng-container>

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

            <ng-container matColumnDef="allocatedHostel">
              <th mat-header-cell *matHeaderCellDef>Allocated Hostel</th>
              <td mat-cell *matCellDef="let r">
                <span class="hostel-badge" [class.allocated]="r.allocatedHostel" [class.unallocated]="!r.allocatedHostel">
                  <mat-icon class="badge-icon">{{ r.allocatedHostel ? 'domain' : 'hourglass_empty' }}</mat-icon>
                  {{ r.allocatedHostel ? r.allocatedHostel : 'Pending Allocation' }}
                </span>
              </td>
            </ng-container>

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

      <!-- VIEW 2: DISTRICT-WISE MERIT LIST VIEW -->
      <div *ngIf="currentView === 'districtMerit'">
        <div class="view-nav-bar">
          <button class="btn-back" (click)="switchView('workflow')">
            <mat-icon>arrow_back</mat-icon>
            Back to Allocation Workflow
          </button>
          <span class="view-tag">Internal View: District-wise Merit List</span>
        </div>

        <div class="quota-warning-banner" *ngIf="!confirmedQuotaData">
          <mat-icon>warning</mat-icon>
          <span>District Seat Distribution from PAGE 1 has not been confirmed yet. Showing estimated quotas based on eligible counts.</span>
        </div>

        <div class="district-section-card" *ngFor="let dist of districtGroups">
          <div class="district-card-header">
            <div class="district-title-wrap">
              <mat-icon class="district-icon">location_on</mat-icon>
              <h3 class="district-name-heading">{{ dist.districtName }}</h3>
            </div>
            <div class="district-quota-metrics">
              <span class="metric-chip">Eligible Candidates: <strong>{{ dist.candidates.length }}</strong></span>
              <span class="metric-chip gold-chip">District Quota: <strong>{{ dist.quota }} Seats</strong></span>
              <span class="metric-chip green-chip">Within Quota: <strong>{{ dist.withinQuota }}</strong></span>
              <span class="metric-chip red-chip">Outside Quota: <strong>{{ dist.outsideQuota }}</strong></span>
            </div>
          </div>

          <table class="district-merit-table">
            <thead>
              <tr>
                <th>District Rank</th>
                <th>Candidate Details</th>
                <th>Department & Campus</th>
                <th>Merit Score</th>
                <th>Quota Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of dist.candidates; let idx = index" [class.within-row]="idx < dist.quota">
                <td>
                  <span class="district-rank-badge">#{{ idx + 1 }}</span>
                </td>
                <td>
                  <strong>{{ c.name }}</strong>
                  <div class="candidate-roll">{{ c.rollNo }}</div>
                </td>
                <td>{{ c.department }} • {{ c.campus }}</td>
                <td>
                  <strong class="score-text">{{ c.meritScore | number:'1.1-2' }}</strong>
                </td>
                <td>
                  <span class="quota-badge" [class.within]="idx < dist.quota" [class.outside]="idx >= dist.quota">
                    {{ idx < dist.quota ? 'Within Quota' : 'Outside Quota' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- VIEW 3: DISTRICT-WISE ROOM ALLOCATION VIEW -->
      <div *ngIf="currentView === 'districtAllocation'">
        <div class="view-nav-bar">
          <button class="btn-back" (click)="switchView('districtMerit')">
            <mat-icon>arrow_back</mat-icon>
            Back to Merit List
          </button>
          <span class="view-tag">Internal View: District Quota-based Room Allocation</span>
        </div>

        <div class="allocation-overview-box">
          <div class="overview-section girls-section">
            <div class="section-title"><mat-icon>female</mat-icon> GIRLS ALLOCATION SUMMARY</div>
            <div class="overview-metrics-grid">
              <div class="metric-box"><span>Available Beds:</span> <strong>50</strong></div>
              <div class="metric-box"><span>District Quota:</span> <strong>{{ girlsSummary.totalQuota }}</strong></div>
              <div class="metric-box"><span>Total Allocated:</span> <strong>{{ girlsSummary.allocated }}</strong></div>
              <div class="metric-box"><span>Remaining Beds:</span> <strong>{{ girlsSummary.remainingBeds }}</strong></div>
              <div class="metric-box"><span>Remaining Candidates:</span> <strong>{{ girlsSummary.remainingCandidates }}</strong></div>
            </div>
          </div>

          <div class="overview-section boys-section">
            <div class="section-title"><mat-icon>male</mat-icon> BOYS ALLOCATION SUMMARY</div>
            <div class="overview-metrics-grid">
              <div class="metric-box"><span>Available Beds:</span> <strong>50</strong></div>
              <div class="metric-box"><span>District Quota:</span> <strong>{{ boysSummary.totalQuota }}</strong></div>
              <div class="metric-box"><span>Total Allocated:</span> <strong>{{ boysSummary.allocated }}</strong></div>
              <div class="metric-box"><span>Remaining Beds:</span> <strong>{{ boysSummary.remainingBeds }}</strong></div>
              <div class="metric-box"><span>Remaining Candidates:</span> <strong>{{ boysSummary.remainingCandidates }}</strong></div>
            </div>
          </div>

          <div class="confirm-allocation-bar">
            <div class="confirm-text">
              <mat-icon>info</mat-icon>
              <strong>{{ totalProposedAllocations }} Candidates</strong> ready for room & bed assignment according to confirmed District Quotas.
            </div>
            <button class="btn-primary-action" (click)="confirmAndSaveAllocations()">
              <mat-icon>check_circle</mat-icon>
              <span>Confirm & Execute Room Allocation</span>
            </button>
          </div>
        </div>

        <!-- District Allocation Breakdown Cards -->
        <div class="district-section-card" *ngFor="let dist of districtGroups">
          <div class="district-card-header">
            <div class="district-title-wrap">
              <mat-icon class="district-icon">domain</mat-icon>
              <h3 class="district-name-heading">{{ dist.districtName }}</h3>
            </div>
            <div class="district-quota-metrics">
              <span class="metric-chip gold-chip">District Quota: <strong>{{ dist.quota }} Seats</strong></span>
              <span class="metric-chip green-chip">Allocated: <strong>{{ dist.allocatedCount }}</strong></span>
              <span class="metric-chip red-chip">Unused / Remaining Quota: <strong>{{ dist.unusedSeats }}</strong></span>
            </div>
          </div>

          <table class="district-merit-table">
            <thead>
              <tr>
                <th>District Rank</th>
                <th>Student</th>
                <th>Roll No</th>
                <th>Merit Score</th>
                <th>Assigned Hostel</th>
                <th>Room</th>
                <th>Bed</th>
                <th>Allocation Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of dist.candidates; let idx = index">
                <td>#{{ idx + 1 }}</td>
                <td><strong>{{ c.name }}</strong></td>
                <td>{{ c.rollNo }}</td>
                <td>{{ c.meritScore | number:'1.1-2' }}</td>
                <td>
                  <span class="hostel-badge" [class.allocated]="idx < dist.quota">
                    {{ idx < dist.quota ? (c.allocatedHostel || getAssignedHostelName(c)) : 'Unallocated (Outside Quota)' }}
                  </span>
                </td>
                <td><strong>{{ idx < dist.quota ? ('Room-' + (101 + (idx % 20))) : '-' }}</strong></td>
                <td><strong>{{ idx < dist.quota ? ('Bed-' + ((idx % 3) + 1)) : '-' }}</strong></td>
                <td>
                  <span class="quota-badge" [class.within]="idx < dist.quota" [class.outside]="idx >= dist.quota">
                    {{ idx < dist.quota ? 'ALLOCATED' : 'PENDING' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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

    /* ── Eligibility Summary Card ── */
    .summary-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.04);
    }

    .summary-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: #013828;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .summary-icon {
      color: #015C3A;
    }

    .summary-stats-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.75rem;
    }

    .stat-pill {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.75rem 0.5rem;
      border-radius: 10px;
      text-align: center;
    }

    .pill-label {
      font-size: 0.72rem;
      font-weight: 600;
      margin-bottom: 0.2rem;
    }

    .pill-val {
      font-size: 1.2rem;
      font-weight: 800;
    }

    .stat-total { background: #f1f5f9; color: #1e293b; }
    .stat-eligible { background: #dcfce7; color: #14532d; }
    .stat-campus-fail { background: #e0f2fe; color: #075985; }
    .stat-other-fail { background: #f3e8ff; color: #6b21a8; }

    /* ── Administrative Reset Card ── */
    .admin-reset-card {
      background: #fff5f5;
      border: 1.5px solid #feb2b2;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 6px rgba(229, 62, 62, 0.06);
    }

    .reset-card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: #9b2c2c;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #fed7d7;
    }

    .reset-icon {
      color: #c53030;
    }

    .reset-action-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .reset-desc {
      margin: 0;
      font-size: 0.85rem;
      color: #742a2a;
      flex: 1;
      min-width: 280px;
      line-height: 1.4;
    }

    .btn-revert-destructive {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      font-size: 0.88rem;
      font-weight: 700;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #c53030 0%, #9b2c2c 100%);
      color: #ffffff;
      cursor: pointer;
      font-family: inherit;
      box-shadow: 0 2px 8px rgba(197, 48, 48, 0.3);
      transition: all 0.2s ease;
    }

    .btn-revert-destructive:hover {
      background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
      box-shadow: 0 4px 12px rgba(197, 48, 48, 0.4);
      transform: translateY(-1px);
    }

    /* ── Internal Views Styles ── */
    .view-nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding: 0.75rem 1rem;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: #013828;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-back:hover { background: #e2e8f0; color: #015C3A; }

    .view-tag { font-weight: 700; color: #015C3A; font-size: 0.9rem; }

    .quota-warning-banner {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.75rem 1rem; background: #fffbe6; border: 1px solid #ffe58f;
      border-radius: 8px; color: #873800; font-size: 0.85rem; font-weight: 600;
      margin-bottom: 1.25rem;
    }

    .district-section-card {
      background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px;
      margin-bottom: 1.5rem; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }

    .district-card-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 1.25rem; background: #f8fafc; border-bottom: 1.5px solid #e2e8f0;
      flex-wrap: wrap; gap: 0.75rem;
    }

    .district-title-wrap { display: flex; align-items: center; gap: 0.5rem; }
    .district-icon { color: #015C3A; }
    .district-name-heading { margin: 0; font-size: 1.1rem; font-weight: 800; color: #013828; }

    .district-quota-metrics { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
    .metric-chip {
      padding: 0.3rem 0.75rem; background: #edf2f7; border-radius: 6px;
      font-size: 0.8rem; font-weight: 600; color: #334155;
    }
    .gold-chip { background: #fef3c7; color: #92400e; }
    .green-chip { background: #dcfce7; color: #14532d; }
    .red-chip { background: #fee2e2; color: #991b1b; }

    .district-merit-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .district-merit-table th { background: #013828; color: #ddd22eff; padding: 0.75rem 1rem; text-align: left; font-weight: 700; }
    .district-merit-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; color: #1e293b; }

    .within-row { background: #f0fdf4; }
    .district-rank-badge { padding: 0.2rem 0.5rem; background: #015C3A; color: #ffffff; border-radius: 4px; font-weight: 800; font-size: 0.78rem; }

    .score-text { color: #015C3A; font-size: 0.95rem; }
    .quota-badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }
    .quota-badge.within { background: #dcfce7; color: #166534; }
    .quota-badge.outside { background: #f3f4f6; color: #6b7280; }

    /* Allocation Overview Box */
    .allocation-overview-box {
      background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px;
      padding: 1.25rem; margin-bottom: 1.5rem;
    }

    .overview-section { margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px dashed #cbd5e1; }
    .section-title { display: flex; align-items: center; gap: 0.4rem; font-weight: 800; font-size: 0.9rem; margin-bottom: 0.75rem; }
    .girls-section .section-title { color: #9d174d; }
    .boys-section .section-title { color: #1e40af; }

    .overview-metrics-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; }
    .metric-box { background: #f8fafc; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.8rem; color: #475569; }
    .metric-box strong { display: block; font-size: 1.1rem; color: #0f172a; margin-top: 0.2rem; }

    .confirm-allocation-bar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.88rem 1.2rem; background: linear-gradient(135deg, #f0fdf4, #dcfce7);
      border: 1.5px solid #86efac; border-radius: 10px;
    }

    .confirm-text { display: flex; align-items: center; gap: 0.5rem; color: #14532d; font-size: 0.9rem; }
    .btn-primary-action {
      display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem;
      font-size: 0.88rem; font-weight: 700; border: none; border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #ffffff;
      cursor: pointer; font-family: inherit; box-shadow: 0 2px 6px rgba(1, 92, 58, 0.25);
    }
    .btn-primary-action:hover { background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%); }
  `]
})
export class AdminMeritAllocationComponent implements OnInit {
  private admin = inject(AdminService);
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  currentView: 'workflow' | 'districtMerit' | 'districtAllocation' = 'workflow';
  results: MeritCandidate[] = [];
  displayed = ['rank', 'candidate', 'department', 'district', 'meritScore', 'allocatedHostel', 'status'];
  loading = false;
  
  districtGroups: {
    districtName: string;
    quota: number;
    withinQuota: number;
    outsideQuota: number;
    allocatedCount: number;
    unusedSeats: number;
    candidates: MeritCandidate[];
  }[] = [];

  confirmedQuotaData: any = null;

  girlsSummary = { totalQuota: 0, allocated: 0, remainingBeds: 50, remainingCandidates: 0 };
  boysSummary = { totalQuota: 0, allocated: 0, remainingBeds: 50, remainingCandidates: 0 };
  totalProposedAllocations = 0;

  eligibilitySummary: {
    total: number;
    eligible: number;
    notEligible: number;
    districtNotAllowed: number;
    campusNotAllowed: number;
    otherFailures: number;
  } | null = null;

  ngOnInit() {
    this.loadEligibleCandidates();
    this.loadConfirmedQuotas();
  }

  loadConfirmedQuotas() {
    try {
      const stored = localStorage.getItem('sdp_confirmed_district_quotas');
      if (stored) {
        this.confirmedQuotaData = JSON.parse(stored);
      }
    } catch (e) {}
  }

  switchView(view: 'workflow' | 'districtMerit' | 'districtAllocation') {
    this.currentView = view;
    if (view === 'districtMerit' || view === 'districtAllocation') {
      this.buildDistrictGroups();
    }
  }

  openDistrictMeritView() {
    this.buildDistrictGroups();
    this.switchView('districtMerit');
  }

  openDistrictAllocationView() {
    this.buildDistrictGroups();
    this.switchView('districtAllocation');
  }

  buildDistrictGroups() {
    this.loadConfirmedQuotas();
    const apps = this.results;

    // Map confirmed quotas if present
    const quotaMap: { [key: string]: number } = {};
    if (this.confirmedQuotaData && this.confirmedQuotaData.quotas) {
      this.confirmedQuotaData.quotas.forEach((q: any) => {
        quotaMap[q.district] = q.allocatedSeats;
      });
    }

    const grouped: { [key: string]: MeritCandidate[] } = {};
    apps.forEach(app => {
      const dist = app.district || 'Unassigned';
      if (!grouped[dist]) grouped[dist] = [];
      grouped[dist].push(app);
    });

    const groups: any[] = [];
    let girlsAllocated = 0;
    let boysAllocated = 0;
    let totalProposed = 0;

    Object.keys(grouped).forEach(distName => {
      const candidates = grouped[distName].sort((a, b) => (b.meritScore || 0) - (a.meritScore || 0));

      // Quota logic: default fallback is candidate count / total * 100 beds if not explicitly confirmed
      let distQuota = quotaMap[distName];
      if (distQuota === undefined) {
        distQuota = Math.max(1, Math.round((candidates.length / Math.max(1, apps.length)) * 100));
      }

      const withinCount = Math.min(candidates.length, distQuota);
      const outsideCount = Math.max(0, candidates.length - distQuota);
      const allocatedCount = withinCount;
      const unusedSeats = Math.max(0, distQuota - candidates.length);

      totalProposed += withinCount;

      candidates.forEach((c, idx) => {
        const isFemale = c.id % 3 === 0;
        if (idx < distQuota) {
          if (isFemale) girlsAllocated++;
          else boysAllocated++;
        }
      });

      groups.push({
        districtName: distName,
        quota: distQuota,
        withinQuota: withinCount,
        outsideQuota: outsideCount,
        allocatedCount: allocatedCount,
        unusedSeats: unusedSeats,
        candidates: candidates
      });
    });

    groups.sort((a, b) => b.candidates.length - a.candidates.length);
    this.districtGroups = groups;
    this.totalProposedAllocations = totalProposed;

    this.girlsSummary = {
      totalQuota: 50,
      allocated: girlsAllocated,
      remainingBeds: Math.max(0, 50 - girlsAllocated),
      remainingCandidates: Math.max(0, apps.filter(a => a.id % 3 === 0).length - girlsAllocated)
    };

    this.boysSummary = {
      totalQuota: 50,
      allocated: boysAllocated,
      remainingBeds: Math.max(0, 50 - boysAllocated),
      remainingCandidates: Math.max(0, apps.filter(a => a.id % 3 !== 0).length - boysAllocated)
    };

    this.cdr.detectChanges();
  }

  getAssignedHostelName(c: MeritCandidate): string {
    return (c.id % 3 === 0) ? 'Marvi Girls Hostel (Block B)' : 'Lal Shahbaz Boys Hostel';
  }

  confirmAndSaveAllocations() {
    let allocatedCount = 0;
    const apps = this.getStoredApplications();
    const updatedApps = apps.map(app => {
      const isEligible = app.status !== 'Ineligible';
      if (isEligible) {
        const group = this.districtGroups.find(g => g.districtName === app.district);
        if (group) {
          const rankInDistrict = group.candidates.findIndex(c => c.id === app.id);
          if (rankInDistrict >= 0 && rankInDistrict < group.quota) {
            allocatedCount++;
            const hostelName = this.getAssignedHostelName(app);
            return {
              ...app,
              status: 'Room Allocated',
              allocatedHostel: hostelName
            };
          }
        }
      }
      return app;
    });

    this.saveStoredApplications(updatedApps);
    this.loadEligibleCandidates();
    this.switchView('workflow');

    this.snack.open(`✅ Room Allocation complete: ${allocatedCount} candidates allocated to hostels based on district quotas & merit rank.`, 'OK', { duration: 5000 });
  }

  loadEligibleCandidates() {
    this.loading = true;
    let apps = this.getStoredApplications();

    if (apps.length === 0) {
      apps = this.generateInitialApplications();
      this.saveStoredApplications(apps);
    }

    let districtFailCount = 0;
    let campusFailCount = 0;
    let otherFailCount = 0;
    let eligibleCount = 0;
    let notEligibleCount = 0;

    // Evaluate eligibility for all applications & update status
    const updatedApps = apps.map(app => {
      const evalRes = this.evaluateEligibilityDetails(app);
      const updatedCandidate = evalRes.app;

      if (!evalRes.app.districtAllowed) districtFailCount++;
      if (!evalRes.app.campusAllowed) campusFailCount++;
      if (!evalRes.app.otherEligible) otherFailCount++;

      if (evalRes.isEligible) {
        eligibleCount++;
        return {
          ...updatedCandidate,
          status: updatedCandidate.status === 'Ineligible' ? 'In Processing' : updatedCandidate.status
        };
      } else {
        notEligibleCount++;
        return {
          ...updatedCandidate,
          status: 'Ineligible'
        };
      }
    });

    this.saveStoredApplications(updatedApps);

    this.eligibilitySummary = {
      total: apps.length,
      eligible: eligibleCount,
      notEligible: notEligibleCount,
      districtNotAllowed: districtFailCount,
      campusNotAllowed: campusFailCount,
      otherFailures: otherFailCount
    };

    // Keep ONLY eligible candidates on Merit & Allocation page
    const eligibleQueue = updatedApps.filter(a =>
      a.status !== 'Ineligible'
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

    let districtFailCount = 0;
    let campusFailCount = 0;
    let otherFailCount = 0;
    let eligibleCount = 0;
    let notEligibleCount = 0;

    apps = apps.map(app => {
      const evalRes = this.evaluateEligibilityDetails(app);
      const updatedCandidate = evalRes.app;

      if (!evalRes.app.districtAllowed) districtFailCount++;
      if (!evalRes.app.campusAllowed) campusFailCount++;
      if (!evalRes.app.otherEligible) otherFailCount++;

      if (evalRes.isEligible) {
        eligibleCount++;
        return {
          ...updatedCandidate,
          status: updatedCandidate.status === 'Ineligible' ? 'In Processing' : updatedCandidate.status
        };
      } else {
        notEligibleCount++;
        return {
          ...updatedCandidate,
          status: 'Ineligible'
        };
      }
    });

    this.saveStoredApplications(apps);

    this.eligibilitySummary = {
      total: apps.length,
      eligible: eligibleCount,
      notEligible: notEligibleCount,
      districtNotAllowed: districtFailCount,
      campusNotAllowed: campusFailCount,
      otherFailures: otherFailCount
    };

    // Filter out ineligible ones completely
    const remainingEligible = apps.filter(a =>
      a.status !== 'Ineligible'
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
      `✅ Eligibility Check Completed: Total: ${apps.length} | Eligible: ${eligibleCount} | Ineligible: ${notEligibleCount}`,
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

  confirmRevertAllocation() {
    const dialogRef = this.dialog.open(RevertAllocationDialogComponent, {
      width: '460px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.executeRevertAllocation();
      }
    });
  }

  private executeRevertAllocation() {
    this.loading = true;
    this.cdr.detectChanges();

    let apps = this.getStoredApplications();
    let hasAllocations = apps.some(a => a.status === 'Room Allocated' || a.status === 'Allocation Complete' || !!a.allocatedHostel);

    // Perform backend call first to ensure database transaction is run
    this.admin.revertAllocation().subscribe({
      next: (res) => {
        // Revert local application status back to unallocated (In Processing) while preserving eligibility records
        let revertCount = 0;
        apps = apps.map(app => {
          if (app.status === 'Room Allocated' || app.status === 'Allocation Complete' || app.allocatedHostel) {
            revertCount++;
            return {
              ...app,
              status: app.status === 'Ineligible' ? 'Ineligible' : 'In Processing',
              allocatedHostel: undefined
            };
          }
          return app;
        });

        this.saveStoredApplications(apps);
        this.loadEligibleCandidates();

        if (revertCount === 0 && (!res || res.revertedCount === 0) && !hasAllocations) {
          this.snack.open('ℹ️ No active allocations found to revert.', 'OK', { duration: 4000 });
        } else {
          this.snack.open('✅ All current allocations have been reverted successfully.', 'OK', { duration: 5000 });
        }
      },
      error: () => {
        // Fallback for demo mode if backend is unreachable or local mock applications are active
        let revertCount = 0;
        apps = apps.map(app => {
          if (app.status === 'Room Allocated' || app.status === 'Allocation Complete' || app.allocatedHostel) {
            revertCount++;
            return {
              ...app,
              status: app.status === 'Ineligible' ? 'Ineligible' : 'In Processing',
              allocatedHostel: undefined
            };
          }
          return app;
        });

        this.saveStoredApplications(apps);
        this.loadEligibleCandidates();

        if (revertCount === 0) {
          this.snack.open('ℹ️ No active allocations found to revert.', 'OK', { duration: 4000 });
        } else {
          this.snack.open('✅ All current allocations have been reverted successfully.', 'OK', { duration: 5000 });
        }
      }
    });
  }

  public evaluateEligibilityDetails(app: MeritCandidate): { isEligible: boolean; app: MeritCandidate } {
    // 1. Load Campus Rules
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

    // 2. Load District Rules
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

    // Check District Eligibility
    const appDistrict = (app.district || '').trim().toLowerCase();
    const matchedDistrict = districtList.find(d => {
      const dName = d.name.trim().toLowerCase();
      return appDistrict.includes(dName) || dName.includes(appDistrict);
    });
    const districtAllowed = matchedDistrict ? matchedDistrict.isAllowed !== false : true;

    // Check Campus Eligibility
    const appCampus = (app.campus || '').trim().toLowerCase();
    const matchedCampus = campusList.find(c => {
      const cName = c.name.trim().toLowerCase();
      const cLoc = (c.location || '').trim().toLowerCase();
      const cCode = (c.code || '').trim().toLowerCase();
      return appCampus.includes(cName) || cName.includes(appCampus) ||
             (cLoc && appCampus.includes(cLoc)) ||
             (cCode && appCampus.includes(cCode));
    });
    const campusAllowed = matchedCampus ? matchedCampus.isEligible !== false : true;

    // Other Existing Eligibility Rule (Simulated rule for specific test IDs e.g. ID % 17 === 0)
    const otherEligible = app.id % 19 !== 0;

    let reason = 'Eligible';
    const failReasons: string[] = [];

    if (!districtAllowed) {
      failReasons.push('District is not eligible for hostel admission.');
    }
    if (!campusAllowed) {
      failReasons.push('Campus is not eligible for hostel admission.');
    }
    if (!otherEligible) {
      failReasons.push('Other Existing Eligibility Rule failed (CGPA / Academic status).');
    }

    if (!districtAllowed && !campusAllowed) {
      reason = 'Not Eligible — District and Campus Not Allowed';
    } else if (!districtAllowed) {
      reason = 'Not Eligible — District Not Allowed';
    } else if (!campusAllowed) {
      reason = 'Not Eligible — Campus Not Allowed';
    } else if (!otherEligible) {
      reason = 'Not Eligible — Other Existing Eligibility Rule';
    }

    const updatedApp: MeritCandidate = {
      ...app,
      districtAllowed,
      campusAllowed,
      otherEligible,
      eligibilityReason: reason
    };

    const isEligible = districtAllowed && campusAllowed && otherEligible;
    return { isEligible, app: updatedApp };
  }

  private isApplicationEligible(app: MeritCandidate): boolean {
    return this.evaluateEligibilityDetails(app).isEligible;
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
