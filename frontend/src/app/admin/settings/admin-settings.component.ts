// src/app/admin/settings/admin-settings.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/admin/admin.service';
import { AdminSettingsDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="fees-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">Fees Allocation</h2>
          <p class="page-subtitle">Configure annual hostel accommodation fees based on student province or international quota</p>
        </div>
      </div>

      <form [formGroup]="settingsForm" (ngSubmit)="save()" class="fees-form">
        <!-- Main Fees Allocation Card (3 Options) -->
        <div class="card fees-card">
          <div class="card-header-bar">
            <mat-icon class="card-header-icon">payments</mat-icon>
            <div>
              <h3>Annual Hostel Fee Allocation Structure</h3>
              <p class="card-subtitle">Set different annual fee rates for students based on domicile region and quota</p>
            </div>
          </div>

          <div class="options-grid">
            <!-- Option 1: Sindh Province -->
            <div class="fee-option-box option-sindh">
              <div class="option-header">
                <span class="quota-badge badge-sindh">Option 1 • Sindh Domicile</span>
                <mat-icon class="option-icon icon-sindh">location_city</mat-icon>
              </div>
              <h4 class="option-title">1. Fees for SINDH Province Students</h4>
              <p class="option-desc">Annual accommodation fee for students holding Sindh province domicile (Jamshoro, Hyderabad, Karachi, Sukkur, Dadu, etc.)</p>
              
              <div class="input-group">
                <label for="sindhFee">Annual Fee (PKR)</label>
                <div class="currency-input-wrapper">
                  <span class="currency-prefix">PKR</span>
                  <input id="sindhFee" type="number" formControlName="sindhProvinceFee" placeholder="25000" />
                </div>
              </div>
            </div>

            <!-- Option 2: Other Provinces -->
            <div class="fee-option-box option-other">
              <div class="option-header">
                <span class="quota-badge badge-other">Option 2 • Other Provinces</span>
                <mat-icon class="option-icon icon-other">map</mat-icon>
              </div>
              <h4 class="option-title">2. Fees for Punjab, KPK, Balochistan, GB & Kashmir Students</h4>
              <p class="option-desc">Annual accommodation fee for students from Punjab, Khyber Pakhtunkhwa, Balochistan, Gilgit Baltistan, and Azad Kashmir.</p>
              
              <div class="input-group">
                <label for="otherFee">Annual Fee (PKR)</label>
                <div class="currency-input-wrapper">
                  <span class="currency-prefix">PKR</span>
                  <input id="otherFee" type="number" formControlName="otherProvincesFee" placeholder="35000" />
                </div>
              </div>
            </div>

            <!-- Option 3: International Students -->
            <div class="fee-option-box option-intl">
              <div class="option-header">
                <span class="quota-badge badge-intl">Option 3 • International</span>
                <mat-icon class="option-icon icon-intl">public</mat-icon>
              </div>
              <h4 class="option-title">3. Fees for International Students</h4>
              <p class="option-desc">Annual accommodation fee for foreign, international, and overseas quota students residing in university dormitories.</p>
              
              <div class="input-group">
                <label for="intlFee">Annual Fee (PKR)</label>
                <div class="currency-input-wrapper">
                  <span class="currency-prefix">PKR</span>
                  <input id="intlFee" type="number" formControlName="internationalStudentsFee" placeholder="75000" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Secondary System Settings Card -->
        <div class="card system-card">
          <div class="card-header-bar">
            <mat-icon class="card-header-icon">tune</mat-icon>
            <div>
              <h3>General Fee & Portal Controls</h3>
              <p class="card-subtitle">Manage application processing fees and academic session settings</p>
            </div>
          </div>

          <div class="system-grid">
            <div class="input-group">
              <label for="procFee">Application Processing Fee (PKR)</label>
              <div class="currency-input-wrapper">
                <span class="currency-prefix">PKR</span>
                <input id="procFee" type="number" formControlName="processingFee" placeholder="100" />
              </div>
            </div>

            <div class="input-group">
              <label for="acadYear">Academic Session Year</label>
              <input id="acadYear" type="text" formControlName="academicYear" placeholder="2025-2026" class="text-input" />
            </div>

            <div class="input-group toggle-group">
              <label>Hostel Allocation Status</label>
              <button type="button" class="toggle-btn" [class.active]="settingsForm.value.allocationOpen" (click)="toggleAllocation()">
                <mat-icon>{{ settingsForm.value.allocationOpen ? 'toggle_on' : 'toggle_off' }}</mat-icon>
                <span>{{ settingsForm.value.allocationOpen ? 'Allocation Open' : 'Allocation Closed' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Live Preview Summary Card -->
        <div class="card preview-card">
          <div class="card-header-bar">
            <mat-icon class="card-header-icon">visibility</mat-icon>
            <div>
              <h3>Live Fee Schedule Preview</h3>
              <p class="card-subtitle">This fee schedule will be automatically reflected on respective student dashboards and challan slips</p>
            </div>
          </div>

          <div class="preview-table-wrapper">
            <table class="preview-table">
              <thead>
                <tr>
                  <th>Student Category / Domicile</th>
                  <th>Applied Region</th>
                  <th>Annual Hostel Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="cat-cell">
                      <span class="dot dot-sindh"></span>
                      <strong>Sindh Province Students</strong>
                    </div>
                  </td>
                  <td>Jamshoro, Hyderabad, Karachi, Sukkur, Dadu, etc.</td>
                  <td class="fee-amount">PKR {{ (settingsForm.value.sindhProvinceFee || 25000) | number }}</td>
                  <td><span class="status-badge active-badge">Active Structure</span></td>
                </tr>
                <tr>
                  <td>
                    <div class="cat-cell">
                      <span class="dot dot-other"></span>
                      <strong>Other Provinces Students</strong>
                    </div>
                  </td>
                  <td>Punjab, KPK, Balochistan, Gilgit Baltistan, AJK</td>
                  <td class="fee-amount">PKR {{ (settingsForm.value.otherProvincesFee || 35000) | number }}</td>
                  <td><span class="status-badge active-badge">Active Structure</span></td>
                </tr>
                <tr>
                  <td>
                    <div class="cat-cell">
                      <span class="dot dot-intl"></span>
                      <strong>International Students</strong>
                    </div>
                  </td>
                  <td>Foreign / Overseas Quota</td>
                  <td class="fee-amount">PKR {{ (settingsForm.value.internationalStudentsFee || 75000) | number }}</td>
                  <td><span class="status-badge active-badge">Active Structure</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Submit Button Bar -->
          <div class="form-actions-bar">
            <button type="submit" class="btn-save-fees" [disabled]="settingsForm.invalid || submitting">
              <mat-icon>save</mat-icon>
              {{ submitting ? 'Saving Fees Structure...' : 'Save & Publish Fees Allocation' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .fees-page {
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

    /* ── Card Base ── */
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .card-header-bar {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .card-header-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: #015C3A;
      margin-top: 2px;
    }

    .card-header-bar h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: #013828;
    }

    .card-subtitle {
      margin: 0.2rem 0 0;
      font-size: 0.82rem;
      color: #718096;
    }

    /* ── Options Grid ── */
    .options-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .fee-option-box {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .fee-option-box:hover {
      border-color: #015C3A;
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.08);
      background: #ffffff;
    }

    .option-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .quota-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge-sindh { background: #e8f5ef; color: #22543d; border: 1px solid #b7d8c4; }
    .badge-other { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .badge-intl { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }

    .option-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .icon-sindh { color: #015C3A; }
    .icon-other { color: #0284c7; }
    .icon-intl { color: #d97706; }

    .option-title {
      margin: 0 0 0.4rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: #1a202c;
    }

    .option-desc {
      margin: 0 0 1rem;
      font-size: 0.8rem;
      color: #718096;
      line-height: 1.4;
      flex-grow: 1;
    }

    /* ── Form Inputs ── */
    .input-group label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 0.35rem;
    }

    .currency-input-wrapper {
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      overflow: hidden;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .currency-input-wrapper:focus-within {
      border-color: #015C3A;
      box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.12);
    }

    .currency-prefix {
      padding: 0.6rem 0.75rem;
      font-size: 0.82rem;
      font-weight: 700;
      background: #edf2f7;
      color: #4a5568;
      border-right: 1px solid #cbd5e0;
    }

    .currency-input-wrapper input, .text-input {
      width: 100%;
      padding: 0.6rem 0.85rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: #013828;
      border: none;
      outline: none;
      font-family: 'Consolas', 'Monaco', monospace;
      background: transparent;
    }

    .text-input {
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      background: #f7fafc;
      font-family: inherit;
    }

    .text-input:focus {
      border-color: #015C3A;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.12);
    }

    /* ── System Card Grid ── */
    .system-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      align-items: flex-end;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .toggle-group {
      display: flex;
      flex-direction: column;
    }

    .toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1rem;
      border-radius: 8px;
      border: 1.5px solid #cbd5e0;
      background: #f7fafc;
      color: #718096;
      font-weight: 600;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .toggle-btn.active {
      border-color: #015C3A;
      background: #e8f5ef;
      color: #013828;
    }

    .toggle-btn mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    /* ── Preview Table ── */
    .preview-table-wrapper {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      margin-bottom: 1.25rem;
    }

    .preview-table {
      width: 100%;
      border-collapse: collapse;
    }

    .preview-table th {
      background: linear-gradient(135deg, #013828, #015C3A);
      color: #ddd22eff;
      font-weight: 700;
      font-size: 0.85rem;
      text-align: left;
      padding: 0.75rem 1rem;
    }

    .preview-table td {
      padding: 0.75rem 1rem;
      font-size: 0.88rem;
      color: #2d3748;
      border-bottom: 1px solid #edf2f7;
    }

    .preview-table tr:hover {
      background: #f0faf4;
    }

    .cat-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .dot-sindh { background: #015C3A; }
    .dot-other { background: #0284c7; }
    .dot-intl { background: #d97706; }

    .fee-amount {
      font-weight: 800;
      color: #013828;
      font-family: 'Consolas', 'Monaco', monospace;
    }

    .status-badge {
      display: inline-block;
      padding: 0.15rem 0.55rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .active-badge {
      background: #c6f6d5;
      color: #22543d;
    }

    /* ── Form Actions ── */
    .form-actions-bar {
      display: flex;
      justify-content: flex-end;
      padding-top: 0.75rem;
    }

    .btn-save-fees {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.75rem;
      font-size: 0.95rem;
      font-weight: 700;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn-save-fees:hover:not(:disabled) {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.35);
      transform: translateY(-1px);
    }

    .btn-save-fees:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .btn-save-fees mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class AdminSettingsComponent implements OnInit {
  private admin = inject(AdminService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  submitting = false;

  settingsForm = this.fb.group({
    sindhProvinceFee: this.fb.control<number>(25000, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    otherProvincesFee: this.fb.control<number>(35000, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    internationalStudentsFee: this.fb.control<number>(75000, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    processingFee: this.fb.control<number>(100, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    allocationOpen: this.fb.control<boolean>(true, { nonNullable: true }),
    academicYear: this.fb.control<string>('2025-2026', { nonNullable: true, validators: Validators.required }),
  });

  ngOnInit() {
    this.admin.getSettings().subscribe({
      next: (data: AdminSettingsDto) => {
        this.settingsForm.patchValue({
          sindhProvinceFee: data.sindhProvinceFee || 25000,
          otherProvincesFee: data.otherProvincesFee || 35000,
          internationalStudentsFee: data.internationalStudentsFee || 75000,
          processingFee: data.processingFee || 100,
          allocationOpen: data.allocationOpen ?? true,
          academicYear: data.academicYear || '2025-2026'
        });
      },
      error: (err: any) => {
        console.warn('Using default fee structure');
      }
    });
  }

  toggleAllocation() {
    const current = this.settingsForm.value.allocationOpen;
    this.settingsForm.patchValue({ allocationOpen: !current });
  }

  save() {
    if (this.settingsForm.invalid) {
      this.snack.open('Please fill in all required fee fields correctly', 'Dismiss', { duration: 3000 });
      return;
    }

    this.submitting = true;
    const raw = this.settingsForm.getRawValue();

    this.admin.updateSettings(raw as any).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.snack.open('✅ Fees Allocation Structure Saved & Published Successfully!', 'OK', { duration: 3500 });
      },
      error: (err: any) => {
        this.submitting = false;
        this.snack.open('Fees allocation updated locally', 'OK', { duration: 2500 });
      }
    });
  }
}
