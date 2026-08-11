// src/app/admin/rooms/room-form.component.ts
import { Component, inject, OnInit, Input } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../core/admin/admin.service';
import { RoomDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data?.room ? 'Edit' : 'Create' }} Room</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>
        <div class="field"><label>Block</label><input matInput formControlName="block"></div>
        <div class="field"><label>Floor</label><input type="number" matInput formControlName="floor"></div>
        <div class="field"><label>Room Number</label><input matInput formControlName="number"></div>
        <div class="field"><label>Total Beds</label><input type="number" matInput formControlName="totalBeds"></div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`.field { margin-bottom: .8rem; }`]
})
export class RoomFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private admin = inject(AdminService);
  private dialogRef = inject(MatDialogRef<RoomFormComponent>);
  @Input() data?: { room?: RoomDto; hostelId?: number };

  form = this.fb.group({
    block: ['', Validators.required],
    floor: [1, [Validators.required, Validators.min(0)]],
    number: ['', Validators.required],
    totalBeds: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    if (this.data?.room) this.form.patchValue(this.data.room);
  }

  save() {
    if (this.form.invalid || !this.data?.hostelId) return;
    const payload = this.form.value as RoomDto;
    const req = this.data.room
      ? this.admin.updateRoom(this.data.hostelId, this.data.room.roomId!, payload)
      : this.admin.createRoom(this.data.hostelId, payload);
    req.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: unknown) => console.error('Room save failed', err)
    });
  }
}
