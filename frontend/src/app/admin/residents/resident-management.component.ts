// src/app/admin/residents/resident-management.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../core/admin/admin.service';
import { ResidentDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-resident-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h2>Current Residents</h2>
    <table mat-table [dataSource]="residents" class="mat-elevation-z2">
      <ng-container matColumnDef="studentId"><th mat-header-cell *matHeaderCellDef>Student ID</th><td mat-cell *matCellDef="let r">{{r.studentId}}</td></ng-container>
      <ng-container matColumnDef="hostel"><th mat-header-cell *matHeaderCellDef>Hostel</th><td mat-cell *matCellDef="let r">{{r.hostelId}}</td></ng-container>
      <ng-container matColumnDef="block"><th mat-header-cell *matHeaderCellDef>Block</th><td mat-cell *matCellDef="let r">{{r.block}}</td></ng-container>
      <ng-container matColumnDef="room"><th mat-header-cell *matHeaderCellDef>Room</th><td mat-cell *matCellDef="let r">{{r.room}}</td></ng-container>
      <ng-container matColumnDef="bed"><th mat-header-cell *matHeaderCellDef>Bed</th><td mat-cell *matCellDef="let r">{{r.bed}}</td></ng-container>
      <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let r"><button mat-button (click)="assignChallan(r)">Assign Challan</button></td></ng-container>
      <tr mat-header-row *matHeaderRowDef="displayed"></tr>
      <tr mat-row *matRowDef="let row; columns: displayed;"></tr>
    </table>
  `,
  styles: [`.mat-table { width: 100%; margin-top: 1rem; }`]
})
export class ResidentManagementComponent implements OnInit {
  private admin = inject(AdminService);
  private snack = inject(MatSnackBar);
  residents: ResidentDto[] = [];
  displayed = ['studentId', 'hostel', 'block', 'room', 'bed', 'actions'];

  ngOnInit() { this.load(); }

  load() {
    this.admin.getResidents().subscribe(data => this.residents = data);
  }

  assignChallan(resident: ResidentDto) {
    const amountStr = prompt('Enter challan amount (numeric)', '0');
    if (amountStr !== null) {
      const amount = Number(amountStr);
      if (!isNaN(amount)) {
        this.admin.assignChallan(resident.residentId!, amount).subscribe({
          next: () => this.snack.open('Challan assigned', 'OK', { duration: 2000 }),
          error: err => this.snack.open('Error: ' + err.message, 'Close')
        });
      }
    }
  }
}
