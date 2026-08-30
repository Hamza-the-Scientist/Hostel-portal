// src/app/admin/merit/district-distribution.component.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MeritCandidate } from './admin-merit-allocation.component';

export interface DistrictQuotaRow {
  district: string;
  eligibleCount: number;
  percentage: number;
  calculatedQuota: number;
  allocatedSeats: number;
}

@Component({
  selector: 'app-district-distribution',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    FormsModule
  ],
  template: `
    <div class="distribution-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">District Seat Distribution</h2>
          <p class="page-subtitle">Calculated dynamically based on verified Eligible Applications after District & Campus filtering</p>
        </div>
        <button class="btn-primary-action" (click)="confirmDistribution()">
          <mat-icon>check_circle</mat-icon>
          <span>Confirm District Distribution</span>
        </button>
      </div>

      <!-- Overview Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon bg-blue"><mat-icon>assignment</mat-icon></div>
          <div>
            <div class="stat-val">{{ totalSubmittedApps }}</div>
            <div class="stat-lbl">Total Submitted Applications</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-red"><mat-icon>block</mat-icon></div>
          <div>
            <div class="stat-val">{{ rejectedAppsCount }}</div>
            <div class="stat-lbl">Excluded (Ineligible)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-green"><mat-icon>verified</mat-icon></div>
          <div>
            <div class="stat-val">{{ totalEligibleApps }}</div>
            <div class="stat-lbl">Source Eligible Applications</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-gold"><mat-icon>king_bed</mat-icon></div>
          <div class="beds-control">
            <div class="stat-val">{{ availableBeds }}</div>
            <div class="stat-lbl">Available Dormitory Beds</div>
          </div>
        </div>
      </div>

      <!-- Controls bar -->
      <div class="card-box flex-bar">
        <div class="beds-input-wrap">
          <label for="bedsInput"><mat-icon>hotel</mat-icon> Total Capacity Beds:</label>
          <input id="bedsInput" type="number" [(ngModel)]="availableBeds" (change)="recalculateQuotas()" class="beds-input" min="1" />
        </div>
        <button class="btn-secondary" (click)="calculateDistribution()">
          <mat-icon>refresh</mat-icon>
          Recalculate Distribution
        </button>
      </div>

      <!-- Distribution Table -->
      <div class="card-box table-container">
        <div class="card-title-bar">
          <mat-icon>pie_chart</mat-icon>
          <span>District Percentage & Quota Breakdown</span>
        </div>

        <table mat-table [dataSource]="districtRows" class="dist-table">
          <!-- District Name -->
          <ng-container matColumnDef="district">
            <th mat-header-cell *matHeaderCellDef>District Name</th>
            <td mat-cell *matCellDef="let r">
              <strong class="dist-name">{{ r.district }}</strong>
            </td>
          </ng-container>

          <!-- Eligible Count -->
          <ng-container matColumnDef="eligibleCount">
            <th mat-header-cell *matHeaderCellDef>Eligible Applications</th>
            <td mat-cell *matCellDef="let r">
              <span class="count-badge">{{ r.eligibleCount }}</span>
            </td>
          </ng-container>

          <!-- Percentage -->
          <ng-container matColumnDef="percentage">
            <th mat-header-cell *matHeaderCellDef>Percentage Share</th>
            <td mat-cell *matCellDef="let r">
              <div class="pct-cell">
                <span class="pct-num">{{ r.percentage | number:'1.2-2' }}%</span>
                <div class="pct-bar-bg">
                  <div class="pct-bar-fill" [style.width.%]="r.percentage"></div>
                </div>
              </div>
            </td>
          </ng-container>

          <!-- Calculated Quota -->
          <ng-container matColumnDef="calculatedQuota">
            <th mat-header-cell *matHeaderCellDef>Quota Beds (Exact)</th>
            <td mat-cell *matCellDef="let r">
              <span class="quota-val">{{ r.calculatedQuota | number:'1.1-2' }}</span>
            </td>
          </ng-container>

          <!-- Allocated Seats -->
          <ng-container matColumnDef="allocatedSeats">
            <th mat-header-cell *matHeaderCellDef>Allocated Seats (Rounded)</th>
            <td mat-cell *matCellDef="let r">
              <span class="seats-badge">{{ r.allocatedSeats }} Seats</span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        </table>

        <!-- Summary Footer -->
        <div class="summary-footer">
          <div>Total Eligible: <strong>{{ totalEligibleApps }}</strong></div>
          <div>Total Quota Allocated: <strong>{{ totalAllocatedSeats }} / {{ availableBeds }} Seats</strong></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .distribution-page { font-family: 'Inter', sans-serif; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .page-title { margin: 0; color: #013828; font-size: 1.5rem; font-weight: 700; }
    .page-subtitle { margin: 0.25rem 0 0; color: #013828; font-size: 0.88rem; }

    .btn-primary-action {
      display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.4rem;
      font-size: 0.88rem; font-weight: 700; border: none; border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #ffffff;
      cursor: pointer; font-family: inherit; box-shadow: 0 2px 6px rgba(1, 92, 58, 0.25);
    }
    .btn-primary-action:hover { background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%); }

    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 1.5rem; }
    .stat-card {
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;
      padding: 1.25rem; display: flex; align-items: center; gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .stat-icon {
      width: 48px; height: 48px; border-radius: 10px; display: flex;
      align-items: center; justify-content: center; color: #ffffff; flex-shrink: 0;
    }
    .bg-blue { background: #0284c7; }
    .bg-red { background: #e11d48; }
    .bg-green { background: #059669; }
    .bg-gold { background: #d97706; }

    .stat-val { font-size: 1.5rem; font-weight: 800; color: #0f172a; line-height: 1.2; }
    .stat-lbl { font-size: 0.78rem; font-weight: 600; color: #64748b; margin-top: 0.15rem; }

    /* Card Box */
    .card-box {
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 1.25rem; margin-bottom: 1.5rem;
    }
    .flex-bar { display: flex; justify-content: space-between; align-items: center; }

    .beds-input-wrap { display: flex; align-items: center; gap: 0.6rem; font-weight: 600; color: #013828; font-size: 0.9rem; }
    .beds-input-wrap mat-icon { color: #015C3A; font-size: 20px; width: 20px; height: 20px; }
    .beds-input { width: 100px; padding: 0.4rem 0.6rem; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 0.95rem; font-weight: 700; color: #0f172a; }

    .btn-secondary {
      display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1rem;
      font-size: 0.85rem; font-weight: 600; border: 1.5px solid #cbd5e0; border-radius: 8px;
      background: #ffffff; color: #475569; cursor: pointer; font-family: inherit;
    }
    .btn-secondary:hover { background: #f1f5f9; color: #015C3A; }

    .card-title-bar {
      display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #013828;
      font-size: 0.95rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9;
    }
    .card-title-bar mat-icon { color: #015C3A; }

    /* Table */
    .dist-table { width: 100%; }
    :host ::ng-deep .mat-mdc-header-row { background: linear-gradient(135deg, #013828, #015C3A) !important; }
    :host ::ng-deep .mat-mdc-header-cell { color: #ddd22eff !important; font-weight: 700 !important; font-size: 0.85rem !important; }
    
    .dist-name { color: #0f172a; font-size: 0.9rem; }
    .count-badge { padding: 0.2rem 0.6rem; background: #edf2f7; border-radius: 12px; font-weight: 700; color: #334155; font-size: 0.82rem; }

    .pct-cell { display: flex; align-items: center; gap: 0.75rem; max-width: 180px; }
    .pct-num { font-weight: 700; color: #013828; min-width: 50px; font-size: 0.85rem; }
    .pct-bar-bg { flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
    .pct-bar-fill { height: 100%; background: linear-gradient(90deg, #015C3A, #D4AF37); border-radius: 3px; }

    .quota-val { font-family: monospace; font-weight: 600; color: #475569; }
    .seats-badge { padding: 0.25rem 0.75rem; background: #dcfce7; color: #14532d; font-weight: 700; border-radius: 6px; font-size: 0.85rem; }

    .summary-footer {
      display: flex; justify-content: space-between; padding-top: 1rem; margin-top: 1rem;
      border-top: 2px solid #e2e8f0; font-size: 0.9rem; color: #475569;
    }
  `]
})
export class DistrictDistributionComponent implements OnInit {
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  totalSubmittedApps = 0;
  totalEligibleApps = 0;
  rejectedAppsCount = 0;
  availableBeds = 100;

  districtRows: DistrictQuotaRow[] = [];
  displayedColumns = ['district', 'eligibleCount', 'percentage', 'calculatedQuota', 'allocatedSeats'];

  ngOnInit() {
    this.calculateDistribution();
  }

  calculateDistribution() {
    const apps: MeritCandidate[] = this.getStoredApplications();
    this.totalSubmittedApps = apps.length;

    // Filter ONLY applications that pass status check
    const eligibleApps = apps.filter(a =>
      a.status !== 'Ineligible'
    );

    this.totalEligibleApps = eligibleApps.length;
    this.rejectedAppsCount = this.totalSubmittedApps - this.totalEligibleApps;

    if (this.totalEligibleApps === 0) {
      this.districtRows = [];
      this.cdr.detectChanges();
      return;
    }

    // Group eligible apps by district
    const districtCounts: { [key: string]: number } = {};
    eligibleApps.forEach(app => {
      const d = app.district || 'Unassigned';
      districtCounts[d] = (districtCounts[d] || 0) + 1;
    });

    const rows: DistrictQuotaRow[] = [];
    Object.keys(districtCounts).forEach(districtName => {
      const count = districtCounts[districtName];
      const pct = (count / this.totalEligibleApps) * 100;
      const exactQuota = (this.availableBeds * pct) / 100;
      const roundedSeats = Math.round(exactQuota);

      rows.push({
        district: districtName,
        eligibleCount: count,
        percentage: pct,
        calculatedQuota: parseFloat(exactQuota.toFixed(2)),
        allocatedSeats: roundedSeats
      });
    });

    rows.sort((a, b) => b.eligibleCount - a.eligibleCount);
    this.districtRows = rows;
    this.cdr.detectChanges();
  }

  recalculateQuotas() {
    if (this.availableBeds < 1) this.availableBeds = 1;
    this.calculateDistribution();
  }

  get totalAllocatedSeats(): number {
    return this.districtRows.reduce((acc, r) => acc + r.allocatedSeats, 0);
  }

  confirmDistribution() {
    try {
      localStorage.setItem('sdp_confirmed_district_quotas', JSON.stringify({
        confirmedAt: new Date().toISOString(),
        availableBeds: this.availableBeds,
        totalEligible: this.totalEligibleApps,
        quotas: this.districtRows
      }));
    } catch (e) {}

    this.snack.open(
      `✅ District Quota Distribution confirmed based on ${this.totalEligibleApps} Eligible Applications (${this.availableBeds} beds total).`,
      'OK',
      { duration: 4000 }
    );
  }

  private getStoredApplications(): MeritCandidate[] {
    try {
      const stored = localStorage.getItem('sdp_all_applications');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return [];
  }
}
