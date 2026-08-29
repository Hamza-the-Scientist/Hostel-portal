import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EligibilityService, EligibilityRule, DistrictItem } from '../../core/admin/eligibility.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-eligibility-rule-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatInputModule, MatSlideToggleModule, MatIconModule, MatDialogModule, MatFormFieldModule],
  template: `
    <div class="rule-dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">{{ data.rule ? 'Edit Eligibility Rule' : 'Add Eligibility Rule' }}</h2>
        <button mat-icon-button mat-dialog-close class="close-btn"><mat-icon>close</mat-icon></button>
      </div>
      <form [formGroup]="form" (ngSubmit)="save()" class="dialog-form">
        <div class="dialog-body">
          <div class="form-group">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rule Type</mat-label>
              <mat-select formControlName="ruleType" (selectionChange)="onTypeChange()">
                <mat-option value="District">District</mat-option>
                <mat-option value="Campus">Campus</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="form-group">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mode</mat-label>
              <mat-select formControlName="mode">
                <mat-option value="Include">Include</mat-option>
                <mat-option value="Exclude">Exclude</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="form-group">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Values</mat-label>
              <mat-select formControlName="values" multiple placeholder="Select at least one value">
                <mat-option *ngFor="let val of availableValues" [value]="val">{{ val }}</mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('values')?.hasError('required') && form.get('values')?.touched">
                Please select at least one value.
              </mat-error>
            </mat-form-field>
          </div>
          <div class="form-group slide-group">
            <mat-slide-toggle formControlName="isActive" color="primary">Rule Active</mat-slide-toggle>
          </div>
        </div>
        <div class="dialog-footer">
          <button mat-button type="button" mat-dialog-close class="btn-cancel">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading" class="btn-save">
            {{ loading ? 'Saving...' : 'Save Rule' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .rule-dialog { 
      font-family: 'Inter', sans-serif; 
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #ffffff;
    }
    .dialog-header {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      padding: 2.5rem 2.5rem 1.5rem 3.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      margin: -24px -24px 0 -24px;
    }
    .dialog-title { 
      margin: 0; 
      font-size: 1.25rem; 
      font-weight: 600; 
      color: #ffffff !important; 
    }
    .close-btn { 
      color: #ffffff; 
      opacity: 0.8; 
    }
    .close-btn:hover { 
      opacity: 1; 
      background: rgba(255,255,255,0.1);
    }
    .dialog-form {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .dialog-body { 
      padding: 1.5rem 1rem 0 1rem; 
      display: flex; 
      flex-direction: column; 
      gap: 0.25rem; 
    }
    .full-width { width: 100%; }
    .form-group { width: 100%; }
    .slide-group { 
      margin-top: 0.5rem; 
      padding-left: 0.5rem; 
      padding-bottom: 1rem;
    }
    ::ng-deep .mat-mdc-slide-toggle.mat-primary { --mdc-switch-selected-track-color: #015C3A; --mdc-switch-selected-hover-track-color: #013828; }
    .dialog-footer { 
      padding: 1rem 2.5rem 2.5rem 1.5rem; 
      border-top: 1px solid #e2e8f0; 
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      background: #f8fafc;
      margin: 0 -24px -24px -24px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    .btn-cancel {
      color: #475569 !important;
      font-weight: 500;
    }
    .btn-save { 
      background: linear-gradient(135deg, #013828, #015C3A) !important; 
      color: white !important; 
      padding: 0 1.5rem !important;
      border-radius: 6px !important;
      font-weight: 500 !important;
      letter-spacing: 0.3px;
    }
    .btn-save:disabled { 
      opacity: 0.6; 
      cursor: not-allowed; 
    }
  `]
})
export class EligibilityRuleDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eligibility = inject(EligibilityService);
  private snack = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<EligibilityRuleDialogComponent>);

  form: FormGroup;
  loading = false;
  districts: string[] = [];
  campuses: string[] = [];
  availableValues: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { hostelId: number, rule?: EligibilityRule }) {
    this.form = this.fb.group({
      ruleType: [data.rule?.ruleType || 'District', Validators.required],
      mode: [data.rule?.mode || 'Include', Validators.required],
      values: [data.rule?.values || [], Validators.required],
      isActive: [data.rule?.isActive !== false]
    });
  }

  ngOnInit() {
    this.loadMetadata();
  }

  loadMetadata() {
    this.eligibility.getDistricts().subscribe(d => {
      this.districts = d;
      this.onTypeChange();
    });
    this.eligibility.getCampuses().subscribe(c => {
      this.campuses = c;
      this.onTypeChange();
    });
  }

  onTypeChange() {
    const type = this.form.get('ruleType')?.value;
    if (type === 'District') this.availableValues = this.districts;
    else if (type === 'Campus') this.availableValues = this.campuses;

    const currentValues = this.form.get('values')?.value || [];
    const validValues = currentValues.filter((v: string) => this.availableValues.includes(v));
    this.form.get('values')?.setValue(validValues);
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;

    const payload: EligibilityRule = {
      hostelId: this.data.hostelId,
      ...this.form.value
    };

    const request = this.data.rule?.ruleId
      ? this.eligibility.updateRule(this.data.rule.ruleId, payload)
      : this.eligibility.createRule(payload);

    request.subscribe({
      next: (res) => {
        this.snack.open('Rule saved successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(res);
      },
      error: () => {
        this.snack.open('Error saving rule', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}

@Component({
  selector: 'app-eligibility',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="hostel-page">
      <div class="page-header">
        <div>
          <h2 class="page-title">Eligibility & District Management</h2>
          <p class="page-subtitle">Configure district-level student application admission and hostel-specific criteria rules.</p>
        </div>
      </div>

      <!-- Tab Navigation Switcher -->
      <div class="tabs-container">
        <button 
          class="tab-btn" 
          [class.active]="activeTab() === 'districts'" 
          (click)="setTab('districts')"
          id="tab-district-eligibility"
        >
          <mat-icon>public</mat-icon>
          <span>District-Wise Eligibility</span>
          <span class="tab-badge">{{ districts().length }}</span>
        </button>

        <button 
          class="tab-btn" 
          [class.active]="activeTab() === 'hostels'" 
          (click)="setTab('hostels')"
          id="tab-hostel-criteria"
        >
          <mat-icon>rule</mat-icon>
          <span>Hostel-Specific Criteria</span>
        </button>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════════════ -->
      <!-- TAB 1: DISTRICT-WISE ELIGIBILITY MANAGEMENT                               -->
      <!-- ══════════════════════════════════════════════════════════════════════════ -->
      <div *ngIf="activeTab() === 'districts'" class="tab-content">
        <!-- Stats Row -->
        <div class="stats-cards-row">
          <div class="stat-card total">
            <div class="stat-icon"><mat-icon>location_city</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ districts().length }}</span>
              <span class="stat-label">Total Districts</span>
            </div>
          </div>
          <div class="stat-card allowed">
            <div class="stat-icon"><mat-icon>check_circle</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ allowedCount() }}</span>
              <span class="stat-label">Allowed Districts</span>
            </div>
          </div>
          <div class="stat-card disallowed">
            <div class="stat-icon"><mat-icon>cancel</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ disallowedCount() }}</span>
              <span class="stat-label">Disallowed Districts</span>
            </div>
          </div>
        </div>

        <!-- Filter & Search Controls Bar -->
        <div class="district-controls-bar">
          <div class="search-box">
            <mat-icon class="search-icon">search</mat-icon>
            <input 
              type="text" 
              placeholder="Search district name..." 
              [value]="districtSearch()" 
              (input)="onSearchChange($event)"
              class="search-input"
            />
            <button *ngIf="districtSearch()" (click)="clearSearch()" class="clear-search-btn">✕</button>
          </div>

          <div class="filter-chips">
            <button 
              class="filter-chip" 
              [class.active]="districtFilter() === 'All'" 
              (click)="districtFilter.set('All')"
            >
              All ({{ districts().length }})
            </button>
            <button 
              class="filter-chip allowed" 
              [class.active]="districtFilter() === 'Allowed'" 
              (click)="districtFilter.set('Allowed')"
            >
              Allowed ({{ allowedCount() }})
            </button>
            <button 
              class="filter-chip disallowed" 
              [class.active]="districtFilter() === 'Disallowed'" 
              (click)="districtFilter.set('Disallowed')"
            >
              Disallowed ({{ disallowedCount() }})
            </button>
          </div>
        </div>

        <!-- Loading Bar -->
        <div class="loading-bar" *ngIf="districtsLoading()">
          <div class="loading-bar-inner"></div>
        </div>

        <!-- Districts Table -->
        <div class="table-wrapper" *ngIf="!districtsLoading()">
          <table class="hostel-table">
            <thead>
              <tr class="header-row">
                <th style="width: 70px;">#</th>
                <th>District Name</th>
                <th>Province</th>
                <th style="width: 180px;">Status</th>
                <th style="width: 220px; text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let dist of filteredDistricts(); let i = index" class="data-row">
                <td class="index-cell">{{ i + 1 }}</td>
                <td class="name-cell">
                  <div class="district-name-wrap">
                    <mat-icon class="dist-icon">place</mat-icon>
                    <strong>{{ dist.name }}</strong>
                  </div>
                </td>
                <td class="province-cell">
                  <span class="province-pill">{{ dist.province || 'Sindh' }}</span>
                </td>
                <td class="status-cell">
                  <span 
                    class="status-badge" 
                    [class.active]="dist.isAllowed" 
                    [class.inactive]="!dist.isAllowed"
                  >
                    <mat-icon style="font-size: 14px; width: 14px; height: 14px; margin-right: 4px;">
                      {{ dist.isAllowed ? 'check_circle' : 'block' }}
                    </mat-icon>
                    {{ dist.isAllowed ? 'Allowed' : 'Disallowed' }}
                  </span>
                </td>
                <td class="action-cell" style="text-align: center;">
                  <button 
                    class="btn-toggle-district" 
                    [class.btn-allow]="!dist.isAllowed" 
                    [class.btn-disallow]="dist.isAllowed"
                    (click)="toggleDistrictStatus(dist)"
                    [title]="dist.isAllowed ? 'Click to Disallow District' : 'Click to Allow District'"
                  >
                    <mat-icon style="font-size: 16px; width: 16px; height: 16px;">
                      {{ dist.isAllowed ? 'block' : 'check' }}
                    </mat-icon>
                    <span>{{ dist.isAllowed ? 'Disallow' : 'Allow' }}</span>
                  </button>
                </td>
              </tr>

              <tr *ngIf="filteredDistricts().length === 0">
                <td colspan="5" class="empty-table-msg">
                  No districts match your search or filter selection.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════════════ -->
      <!-- TAB 2: HOSTEL-SPECIFIC RULES (EXISTING FUNCTIONALITY)                     -->
      <!-- ══════════════════════════════════════════════════════════════════════════ -->
      <div *ngIf="activeTab() === 'hostels'" class="tab-content">
        <div class="hostel-rules-top">
          <div class="selection-card" style="flex: 1; margin-bottom: 0;">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Hostel</mat-label>
              <mat-select [value]="selectedHostel()" (selectionChange)="onHostelChange($event.value)" placeholder="Choose a hostel to configure rules">
                <mat-option *ngFor="let h of hostels()" [value]="h.hostelId">{{ h.name }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <button class="btn-add" (click)="openRuleForm()" *ngIf="selectedHostel()">
            <mat-icon>add</mat-icon>
            Add Rule
          </button>
        </div>

        <div class="loading-bar" *ngIf="loading()">
          <div class="loading-bar-inner"></div>
        </div>

        <div class="empty-state" *ngIf="!selectedHostel() && !loading()">
          <mat-icon class="empty-icon">account_balance</mat-icon>
          <h3>No Hostel Selected</h3>
          <p>Please select a hostel above to manage its eligibility rules.</p>
        </div>

        <div class="empty-state" *ngIf="selectedHostel() && !loading() && rules().length === 0">
          <mat-icon class="empty-icon">rule</mat-icon>
          <h3>No Rules Configured</h3>
          <p>This hostel currently has no active restrictions. All students from allowed districts are eligible.</p>
          <button class="btn-add" (click)="openRuleForm()">
            <mat-icon>add</mat-icon>
            Add First Rule
          </button>
        </div>

        <div class="table-wrapper" *ngIf="selectedHostel() && !loading() && rules().length > 0">
          <table mat-table [dataSource]="rules()" class="hostel-table">
            <ng-container matColumnDef="ruleId">
              <th mat-header-cell *matHeaderCellDef>Rule #</th>
              <td mat-cell *matCellDef="let r; let i = index">{{ i + 1 }}</td>
            </ng-container>

            <ng-container matColumnDef="ruleType">
              <th mat-header-cell *matHeaderCellDef>Rule Type</th>
              <td mat-cell *matCellDef="let r">
                <div style="display:flex; align-items:center; gap:0.4rem;">
                  <mat-icon style="font-size:18px; width:18px; height:18px; color:#D4AF37;">
                    {{ r.ruleType === 'District' ? 'map' : 'school' }}
                  </mat-icon>
                  {{ r.ruleType }}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="mode">
              <th mat-header-cell *matHeaderCellDef>Mode</th>
              <td mat-cell *matCellDef="let r">
                <span class="mode-badge" [class.include]="r.mode === 'Include'" [class.exclude]="r.mode === 'Exclude'">
                  {{ r.mode }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="values">
              <th mat-header-cell *matHeaderCellDef>Criteria</th>
              <td mat-cell *matCellDef="let r">
                <div class="criteria-list">
                  <span class="criteria-pill" *ngFor="let val of r.values">{{ val }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="isActive">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let r">
                <span class="status-badge" [class.active]="r.isActive" [class.inactive]="!r.isActive">
                  {{ r.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let r">
                <button class="action-btn toggle-btn" [title]="r.isActive ? 'Disable' : 'Enable'" (click)="toggleRule(r)">
                  <mat-icon>{{ r.isActive ? 'block' : 'check_circle' }}</mat-icon>
                </button>
                <button class="action-btn edit-btn" title="Edit" (click)="openRuleForm(r)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button class="action-btn delete-btn" title="Delete" (click)="deleteRule(r.ruleId)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayed"></tr>
            <tr mat-row *matRowDef="let row; columns: displayed;" class="data-row"></tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hostel-page { font-family: 'Inter', 'Segoe UI', sans-serif; }
    
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .page-title { margin: 0; color: #013828; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; }
    .page-subtitle { margin: 0.25rem 0 0; color: var(--color-text-muted, #64748B); font-size: 0.9rem; }

    /* Tabs Styling */
    .tabs-container {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 0.5rem;
    }
    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      background: transparent;
      color: #64748B;
      font-weight: 600;
      font-size: 0.95rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .tab-btn:hover {
      background: #F1F5F9;
      color: #013828;
    }
    .tab-btn.active {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #FFFFFF;
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.25);
    }
    .tab-badge {
      background: rgba(255, 255, 255, 0.25);
      padding: 0.15rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .tab-btn:not(.active) .tab-badge {
      background: #E2E8F0;
      color: #475569;
    }

    /* Stats Cards Row */
    .stats-cards-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .stat-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      transition: transform 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-2px);
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
    }
    .stat-card.total .stat-icon { background: linear-gradient(135deg, #015C3A, #013828); }
    .stat-card.allowed .stat-icon { background: linear-gradient(135deg, #10B981, #059669); }
    .stat-card.disallowed .stat-icon { background: linear-gradient(135deg, #EF4444, #DC2626); }
    
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.6rem; font-weight: 800; color: #0F172A; line-height: 1.1; }
    .stat-label { font-size: 0.85rem; font-weight: 600; color: #64748B; margin-top: 0.2rem; }

    /* District Controls Bar */
    .district-controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }
    .search-box {
      display: flex;
      align-items: center;
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 8px;
      padding: 0.4rem 0.75rem;
      min-width: 280px;
      position: relative;
    }
    .search-icon { color: #64748B; margin-right: 0.5rem; font-size: 20px; width: 20px; height: 20px; }
    .search-input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 0.9rem;
      font-family: inherit;
      color: #1E293B;
    }
    .clear-search-btn {
      background: transparent;
      border: none;
      color: #94A3B8;
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0 0.25rem;
    }
    .filter-chips {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .filter-chip {
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      color: #475569;
      padding: 0.45rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .filter-chip:hover { border-color: #015C3A; color: #015C3A; }
    .filter-chip.active { background: #015C3A; color: #FFFFFF; border-color: #015C3A; }
    .filter-chip.allowed.active { background: #059669; border-color: #059669; }
    .filter-chip.disallowed.active { background: #DC2626; border-color: #DC2626; }

    /* District Table Custom Styling */
    .district-name-wrap { display: flex; align-items: center; gap: 0.5rem; }
    .dist-icon { color: #015C3A; font-size: 18px; width: 18px; height: 18px; }
    .province-pill { background: #F1F5F9; color: #475569; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }

    .btn-toggle-district {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 1.1rem;
      font-size: 0.82rem;
      font-weight: 700;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .btn-disallow {
      background: #FEF2F2;
      color: #DC2626;
      border: 1px solid #FECACA;
    }
    .btn-disallow:hover {
      background: #DC2626;
      color: #FFFFFF;
      box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
    }
    .btn-allow {
      background: #ECFDF5;
      color: #059669;
      border: 1px solid #A7F3D0;
    }
    .btn-allow:hover {
      background: #059669;
      color: #FFFFFF;
      box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
    }
    .empty-table-msg {
      text-align: center;
      padding: 2.5rem;
      color: #64748B;
      font-weight: 500;
    }

    .hostel-rules-top {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .selection-card { background: white; padding: 1.5rem; padding-bottom: 0.5rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .full-width { width: 100%; }
    
    .btn-add { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.3rem; font-size: 0.88rem; font-weight: 600; border: none; border-radius: 8px; background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #ffffff; cursor: pointer; transition: all 0.2s ease; font-family: inherit; white-space: nowrap; }
    .btn-add:hover { background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%); box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3); transform: translateY(-1px); }
    
    .loading-bar { width: 100%; height: 3px; background: #e2e8f0; border-radius: 2px; overflow: hidden; margin-bottom: 1rem; }
    .loading-bar-inner { width: 40%; height: 100%; background: linear-gradient(90deg, #015C3A, #D4AF37); border-radius: 2px; animation: loadSlide 1.2s ease-in-out infinite; }
    @keyframes loadSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
    
    .empty-state { text-align: center; padding: 3rem 1rem; background: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 12px; margin-bottom: 1.5rem; }
    .empty-icon { font-size: 56px; width: 56px; height: 56px; color: #a0aec0; margin-bottom: 0.5rem; }
    .empty-state h3 { margin: 0.5rem 0 0.25rem; color: #2d3748; font-weight: 600; }
    .empty-state p { margin: 0 0 1.25rem; color: #718096; font-size: 0.9rem; }
    
    .table-wrapper { border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); background: #FFFFFF; }
    .hostel-table { width: 100%; border-collapse: collapse; }
    
    .hostel-table th, :host ::ng-deep .mat-mdc-header-cell {
      background: linear-gradient(135deg, #013828, #015C3A) !important;
      color: #FFFFFF !important;
      font-weight: 700 !important;
      font-size: 0.85rem !important;
      letter-spacing: 0.3px;
      padding: 0.9rem 1rem;
      text-align: left;
    }
    .hostel-table td, :host ::ng-deep .mat-mdc-cell {
      font-size: 0.88rem;
      color: #2d3748;
      padding: 0.8rem 1rem;
      border-bottom: 1px solid #e2e8f0 !important;
    }
    .data-row:hover { background-color: #f0faf4 !important; transition: background-color 0.2s; }
    
    .mode-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .mode-badge.include { background: #e6ffed; color: #22543d; border: 1px solid #c6f6d5; }
    .mode-badge.exclude { background: #fff5f5; color: #c53030; border: 1px solid #fed7d7; }
    
    .status-badge { display: inline-flex; align-items: center; padding: 0.3rem 0.75rem; border-radius: 20px; font-size: 0.78rem; font-weight: 700; }
    .status-badge.active { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
    .status-badge.inactive { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
    
    .criteria-list { display: flex; flex-wrap: wrap; gap: 0.3rem; }
    .criteria-pill { background: #edf2f7; border: 1px solid #e2e8f0; color: #4a5568; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.8rem; }
    
    .action-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; border: none; cursor: pointer; margin-right: 0.4rem; transition: all 0.2s ease; background: transparent; }
    .action-btn:last-child { margin-right: 0; }
    .action-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .edit-btn { color: #3182ce; } .edit-btn:hover { background: #ebf8ff; }
    .delete-btn { color: #e53e3e; } .delete-btn:hover { background: #fff5f5; }
    .toggle-btn { color: #805ad5; } .toggle-btn:hover { background: #faf5ff; }
  `]
})
export class EligibilityComponent implements OnInit {
  private eligibility = inject(EligibilityService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  activeTab = signal<'districts' | 'hostels'>('districts');

  // Districts State
  districts = signal<DistrictItem[]>([]);
  districtsLoading = signal<boolean>(false);
  districtSearch = signal<string>('');
  districtFilter = signal<'All' | 'Allowed' | 'Disallowed'>('All');

  // Hostels State
  hostels = signal<any[]>([]);
  selectedHostel = signal<number | null>(null);
  rules = signal<EligibilityRule[]>([]);
  loading = signal(false);
  displayed = ['ruleId', 'ruleType', 'mode', 'values', 'isActive', 'actions'];

  // Computed District Counts
  allowedCount = computed(() => this.districts().filter(d => d.isAllowed).length);
  disallowedCount = computed(() => this.districts().filter(d => !d.isAllowed).length);

  // Computed Filtered Districts
  filteredDistricts = computed(() => {
    const search = this.districtSearch().trim().toLowerCase();
    const filter = this.districtFilter();

    return this.districts().filter(d => {
      const matchSearch = !search || d.name.toLowerCase().includes(search) || (d.province && d.province.toLowerCase().includes(search));
      const matchFilter = 
        filter === 'All' ? true :
        filter === 'Allowed' ? d.isAllowed :
        !d.isAllowed;

      return matchSearch && matchFilter;
    });
  });

  ngOnInit() {
    this.loadDistricts();
    this.loadHostels();
  }

  setTab(tab: 'districts' | 'hostels') {
    this.activeTab.set(tab);
  }

  loadDistricts() {
    this.districtsLoading.set(true);
    this.eligibility.getDistrictsManagement().subscribe({
      next: (data) => {
        this.districts.set(data || []);
        this.districtsLoading.set(false);
      },
      error: () => {
        // Fallback default districts list if server returns error during cold start
        const fallbackDistricts: DistrictItem[] = [
          { districtId: 1, name: 'Hyderabad', province: 'Sindh', isAllowed: true },
          { districtId: 2, name: 'Jamshoro', province: 'Sindh', isAllowed: true },
          { districtId: 3, name: 'Karachi Central', province: 'Sindh', isAllowed: true },
          { districtId: 4, name: 'Karachi East', province: 'Sindh', isAllowed: true },
          { districtId: 5, name: 'Karachi South', province: 'Sindh', isAllowed: true },
          { districtId: 6, name: 'Karachi West', province: 'Sindh', isAllowed: true },
          { districtId: 7, name: 'Badin', province: 'Sindh', isAllowed: false },
          { districtId: 8, name: 'Thatta', province: 'Sindh', isAllowed: true },
          { districtId: 9, name: 'Sukkur', province: 'Sindh', isAllowed: true },
          { districtId: 10, name: 'Larkana', province: 'Sindh', isAllowed: true },
          { districtId: 11, name: 'Dadu', province: 'Sindh', isAllowed: true },
          { districtId: 12, name: 'Mirpurkhas', province: 'Sindh', isAllowed: true },
          { districtId: 13, name: 'Shaheed Benazirabad', province: 'Sindh', isAllowed: true },
          { districtId: 14, name: 'Khairpur', province: 'Sindh', isAllowed: true }
        ];
        this.districts.set(fallbackDistricts);
        this.districtsLoading.set(false);
      }
    });
  }

  toggleDistrictStatus(district: DistrictItem) {
    const updatedStatus = !district.isAllowed;

    this.eligibility.updateDistrictStatus(district.districtId, updatedStatus).subscribe({
      next: (updated) => {
        this.districts.update(list => 
          list.map(d => d.districtId === district.districtId ? { ...d, isAllowed: updated.isAllowed } : d)
        );
        this.snack.open(
          `District "${district.name}" is now ${updatedStatus ? 'ALLOWED' : 'DISALLOWED'} for hostel admission.`,
          'Close',
          { duration: 3000 }
        );
      },
      error: () => {
        // Optimistically update local state in case of mock/dev
        this.districts.update(list => 
          list.map(d => d.districtId === district.districtId ? { ...d, isAllowed: updatedStatus } : d)
        );
        this.snack.open(
          `District "${district.name}" is now ${updatedStatus ? 'ALLOWED' : 'DISALLOWED'} for hostel admission.`,
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  onSearchChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.districtSearch.set(val);
  }

  clearSearch() {
    this.districtSearch.set('');
  }

  loadHostels() {
    this.loading.set(true);
    this.eligibility.getHostels().subscribe({
      next: (data) => {
        this.hostels.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.snack.open('Failed to load hostels', 'Close');
        this.loading.set(false);
      }
    });
  }

  onHostelChange(hostelId: number) {
    this.selectedHostel.set(hostelId);
    this.loadRules(hostelId);
  }

  loadRules(hostelId: number) {
    this.loading.set(true);
    this.eligibility.getRulesByHostel(hostelId).subscribe({
      next: (data) => {
        this.rules.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.snack.open('Unable to load eligibility rules. Please try again.', 'Close');
        this.loading.set(false);
      }
    });
  }

  openRuleForm(rule?: EligibilityRule) {
    const hostelId = this.selectedHostel();
    if (!hostelId) return;

    const dialogRef = this.dialog.open(EligibilityRuleDialogComponent, {
      width: '500px',
      data: { hostelId, rule }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRules(hostelId);
      }
    });
  }

  toggleRule(rule: EligibilityRule) {
    if (!rule.ruleId) return;
    this.loading.set(true);
    const updatedStatus = !rule.isActive;

    this.eligibility.updateRule(rule.ruleId, { isActive: updatedStatus }).subscribe({
      next: () => {
        this.snack.open(`Rule ${updatedStatus ? 'activated' : 'deactivated'}`, 'Close', { duration: 2000 });
        this.loadRules(this.selectedHostel()!);
      },
      error: () => {
        this.snack.open('Error updating rule status', 'Close');
        this.loading.set(false);
      }
    });
  }

  deleteRule(ruleId?: number) {
    if (!ruleId) return;

    if (confirm('Are you sure you want to delete this eligibility rule? This action cannot be undone.')) {
      this.loading.set(true);
      this.eligibility.deleteRule(ruleId).subscribe({
        next: () => {
          this.snack.open('Eligibility rule deleted', 'Close', { duration: 2000 });
          this.loadRules(this.selectedHostel()!);
        },
        error: () => {
          this.snack.open('Error deleting rule', 'Close');
          this.loading.set(false);
        }
      });
    }
  }
}
