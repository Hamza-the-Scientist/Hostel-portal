// src/app/admin/hostels/hostel-form.component.ts
import { Component, inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../core/admin/admin.service';
import { HostelDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-hostel-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Create' }} Hostel</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>
        <div class="field"><label>Name</label><input matInput formControlName="name"></div>
        <div class="field"><label>Gender</label>
          <select matNativeControl formControlName="gender">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="field"><label>Location</label><input matInput formControlName="address"></div>
        <div class="field"><label>Description</label><textarea matInput formControlName="description"></textarea></div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`.field { margin-bottom: .8rem; }`]
})
export class HostelFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private admin = inject(AdminService);
  private dialogRef = inject(MatDialogRef<HostelFormComponent>);
  @Input() data?: HostelDto;
  form = this.fb.group({
    name: ['', Validators.required],
    gender: ['Male', Validators.required],
    address: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    if (this.data) this.form.patchValue(this.data);
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.value as HostelDto;
    const req = this.data
      ? this.admin.updateHostel(this.data.hostelId!, payload)
      : this.admin.createHostel(payload);
    req.subscribe(() => this.dialogRef.close());
  }
}
