// src/app/admin/hostels/hostel-form.component.ts
import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../core/admin/admin.service';
import { HostelDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-hostel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="hostel-dialog">
      <div class="dialog-header">
        <div class="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <h2>{{ data ? 'Edit Hostel' : 'Create New Hostel' }}</h2>
        <p class="header-subtitle">{{ data ? 'Update hostel information below' : 'Fill in the details to register a new hostel' }}</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="dialog-body">
          <div class="form-group">
            <label for="hostelName">Hostel Name <span class="required">*</span></label>
            <input id="hostelName" type="text" formControlName="name" placeholder="e.g. Boys Hostel Block A">
            <span class="error-hint" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">Name is required</span>
          </div>

          <div class="form-group">
            <label for="hostelGender">Gender <span class="required">*</span></label>
            <select id="hostelGender" formControlName="gender">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div class="form-group">
            <label for="hostelAddress">Location / Address <span class="required">*</span></label>
            <input id="hostelAddress" type="text" formControlName="address" placeholder="e.g. University of Sindh, Jamshoro">
            <span class="error-hint" *ngIf="form.get('address')?.touched && form.get('address')?.invalid">Address is required</span>
          </div>

          <div class="form-group">
            <label for="hostelDescription">Description</label>
            <textarea id="hostelDescription" formControlName="description" rows="3" placeholder="Brief description of the hostel..."></textarea>
          </div>
        </div>

        <div class="dialog-footer">
          <button type="button" class="btn-cancel" (click)="onCancel()">Cancel</button>
          <button type="submit" class="btn-save" [disabled]="form.invalid || saving">
            <span *ngIf="saving" class="spinner"></span>
            {{ saving ? 'Saving...' : (data ? 'Update Hostel' : 'Create Hostel') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .hostel-dialog {
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* ── Header ── */
    .dialog-header {
      background: linear-gradient(135deg, #013828 0%, #015C3A 60%, #017A4A 100%);
      padding: 2.5rem 1.75rem 1.25rem;
      margin: -24px 0px 0;
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

    .form-group {
      margin-bottom: 1.1rem;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 0.35rem;
    }

    .required {
      color: #e53e3e;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.65rem 0.85rem;
      font-size: 0.9rem;
      color: #1a202c;
      background: #f7fafc;
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      box-sizing: border-box;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #015C3A;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.12);
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
      color: #a0aec0;
    }

    .form-group select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23718096' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      padding-right: 2rem;
    }

    .form-group textarea {
      resize: vertical;
      min-height: 70px;
    }

    .error-hint {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.78rem;
      color: #e53e3e;
      font-weight: 500;
    }

    /* ── Footer ── */
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 0.5rem 0.25rem;
      border-top: 1px solid #e2e8f0;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .btn-cancel {
      padding: 0.6rem 1.4rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      background: #ffffff;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn-cancel:hover {
      background: #f7fafc;
      border-color: #a0aec0;
      color: #2d3748;
    }

    .btn-save {
      padding: 0.6rem 1.6rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-family: inherit;
    }

    .btn-save:hover:not(:disabled) {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3);
      transform: translateY(-1px);
    }

    .btn-save:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      transform: none;
    }

    /* ── Spinner ── */
    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class HostelFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private admin = inject(AdminService);
  private dialogRef = inject(MatDialogRef<HostelFormComponent>);
  saving = false;

  data: HostelDto | null;

  form = this.fb.group({
    name: ['', Validators.required],
    gender: ['Male', Validators.required],
    address: ['', Validators.required],
    description: ['']
  });

  constructor(@Inject(MAT_DIALOG_DATA) data: HostelDto | null) {
    this.data = data;
  }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const payload = this.form.value as HostelDto;
    const req = this.data
      ? this.admin.updateHostel(this.data.hostelId!, payload)
      : this.admin.createHostel(payload);
    req.subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        console.error('Failed to save hostel:', err);
        this.dialogRef.close(false);
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
