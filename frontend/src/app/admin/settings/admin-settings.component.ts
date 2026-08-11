// src/app/admin/settings/admin-settings.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  template: `
    <h2>Admin Settings</h2>
    <form [formGroup]="settingsForm" (ngSubmit)="save()" class="settings-form">
      <mat-form-field appearance="fill">
        <mat-label>Processing Fee</mat-label>
        <input matInput type="number" formControlName="processingFee" />
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Hostel Fee</mat-label>
        <input matInput type="number" formControlName="hostelFee" />
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Application Deadline</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="applicationDeadline" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <mat-slide-toggle formControlName="allocationOpen">Allocation Open</mat-slide-toggle>

      <mat-form-field appearance="fill">
        <mat-label>Academic Year</mat-label>
        <input matInput formControlName="academicYear" />
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Merit Rules (JSON)</mat-label>
        <textarea matInput rows="4" formControlName="meritRules"></textarea>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Notification Settings (JSON)</mat-label>
        <textarea matInput rows="4" formControlName="notificationSettings"></textarea>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Email Configuration (JSON)</mat-label>
        <textarea matInput rows="4" formControlName="emailConfig"></textarea>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="settingsForm.invalid">Save Settings</button>
    </form>
  `,
  styles: [`.settings-form { display: flex; flex-direction: column; gap: 1rem; max-width: 500px; }`]
})
export class AdminSettingsComponent implements OnInit {
  private admin = inject(AdminService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  settingsForm = this.fb.group({
    processingFee: this.fb.control<number>(0, { nonNullable: true, validators: Validators.required }),
    hostelFee: this.fb.control<number>(0, { nonNullable: true, validators: Validators.required }),
    applicationDeadline: this.fb.control<Date | null>(null, Validators.required),
    allocationOpen: this.fb.control<boolean>(false, { nonNullable: true }),
    academicYear: this.fb.control<string>('', { nonNullable: true, validators: Validators.required }),
    meritRules: this.fb.control<string>('{}', { nonNullable: true }),
    notificationSettings: this.fb.control<string>('{}', { nonNullable: true }),
    emailConfig: this.fb.control<string>('{}', { nonNullable: true })
  });

  ngOnInit() {
    this.admin.getSettings().subscribe((data: AdminSettingsDto) => {
      this.settingsForm.patchValue({
        processingFee: data.processingFee,
        hostelFee: data.hostelFee,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
        allocationOpen: data.allocationOpen,
        academicYear: data.academicYear,
        meritRules: JSON.stringify(data.meritRules, null, 2),
        notificationSettings: JSON.stringify(data.notificationSettings, null, 2),
        emailConfig: JSON.stringify(data.emailConfig, null, 2)
      });
    });
  }

  save() {
    if (this.settingsForm.invalid) return;
    const raw = this.settingsForm.getRawValue();
    const payload: AdminSettingsDto = {
      processingFee: raw.processingFee,
      hostelFee: raw.hostelFee,
      applicationDeadline: raw.applicationDeadline ? raw.applicationDeadline.toISOString() : null,
      allocationOpen: raw.allocationOpen,
      academicYear: raw.academicYear,
      meritRules: JSON.parse(raw.meritRules),
      notificationSettings: JSON.parse(raw.notificationSettings),
      emailConfig: JSON.parse(raw.emailConfig)
    } as any;
    this.admin.updateSettings(payload).subscribe({
      next: () => this.snack.open('Settings saved', 'OK', { duration: 2000 }),
      error: (err: any) => this.snack.open('Error: ' + err.message, 'Close')
    });
  }
}
