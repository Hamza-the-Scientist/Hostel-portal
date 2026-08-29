import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EligibilityService, EligibilityRule } from '../../core/admin/eligibility.service';
import { Inject } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';

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

    // Reset values if they don't match the new options
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
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatSelectModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule],
  template: `
    <div class="hostel-page">
      <div class="page-header">
        <div>
          <h2 class="page-title">Eligibility Rules</h2>
          <p class="page-subtitle">Configure hostel eligibility criteria without changing system code.</p>
        </div>
        <button class="btn-add" (click)="openRuleForm()" *ngIf="selectedHostel()">
          <mat-icon>add</mat-icon>
          Add Eligibility Rule
        </button>
      </div>

      <div class="selection-card">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Select Hostel</mat-label>
          <mat-select [value]="selectedHostel()" (selectionChange)="onHostelChange($event.value)" placeholder="Choose a hostel to configure rules">
            <mat-option *ngFor="let h of hostels()" [value]="h.hostelId">{{ h.name }}</mat-option>
          </mat-select>
        </mat-form-field>
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
        <p>This hostel currently has no active restrictions. All students are eligible.</p>
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
  `,
  styles: [`
    .hostel-page { font-family: 'Inter', 'Segoe UI', sans-serif; }
    
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .page-title { margin: 0; color: #013828; font-size: 1.5rem; font-weight: 700; }
    .page-subtitle { margin: 0.25rem 0 0; color: #013828; font-size: 0.88rem; }
    
    .selection-card { background: white; padding: 1.5rem; padding-bottom: 0.5rem; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .full-width { width: 100%; }
    
    .btn-add { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.3rem; font-size: 0.88rem; font-weight: 600; border: none; border-radius: 8px; background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #ffffff; cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
    .btn-add:hover { background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%); box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3); transform: translateY(-1px); }
    
    .loading-bar { width: 100%; height: 3px; background: #e2e8f0; border-radius: 2px; overflow: hidden; margin-bottom: 1rem; }
    .loading-bar-inner { width: 40%; height: 100%; background: linear-gradient(90deg, #015C3A, #D4AF37); border-radius: 2px; animation: loadSlide 1.2s ease-in-out infinite; }
    @keyframes loadSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
    
    .empty-state { text-align: center; padding: 3rem 1rem; background: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 12px; margin-bottom: 1.5rem; }
    .empty-icon { font-size: 56px; width: 56px; height: 56px; color: #a0aec0; margin-bottom: 0.5rem; }
    .empty-state h3 { margin: 0.5rem 0 0.25rem; color: #2d3748; font-weight: 600; }
    .empty-state p { margin: 0 0 1.25rem; color: #718096; font-size: 0.9rem; }
    
    .table-wrapper { border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .hostel-table { width: 100%; }
    
    :host ::ng-deep .mat-mdc-header-row { background: linear-gradient(135deg, #013828, #015C3A) !important; }
    :host ::ng-deep .mat-mdc-header-cell { color: #ddd22eff !important; font-weight: 700 !important; font-size: 0.85rem !important; letter-spacing: 0.3px; border-bottom: 2px solid #b7d8c4 !important; }
    :host ::ng-deep .mat-mdc-cell { font-size: 0.88rem; color: #2d3748; padding-top: 0.6rem; padding-bottom: 0.6rem; border-bottom: 1px solid #e2e8f0 !important; }
    .data-row:hover { background-color: #f0faf4 !important; transition: background-color 0.2s; }
    
    .mode-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .mode-badge.include { background: #e6ffed; color: #22543d; border: 1px solid #c6f6d5; }
    .mode-badge.exclude { background: #fff5f5; color: #c53030; border: 1px solid #fed7d7; }
    
    .status-badge { display: inline-block; padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .status-badge.active { background: #e6ffed; color: #22543d; }
    .status-badge.inactive { background: #edf2f7; color: #4a5568; }
    
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

  hostels = signal<any[]>([]);
  selectedHostel = signal<number | null>(null);
  rules = signal<EligibilityRule[]>([]);
  loading = signal(false);
  displayed = ['ruleId', 'ruleType', 'mode', 'values', 'isActive', 'actions'];

  ngOnInit() {
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
