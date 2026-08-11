// src/app/admin/merit/admin-merit-allocation.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AdminService } from '../../core/admin/admin.service';
import { MeritResultDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-admin-merit-allocation',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, MatTableModule],
  template: `
    <h2>Merit & Allocation</h2>
    <div class="actions">
      <button mat-raised-button color="primary" (click)="runEligibility()">Run Eligibility Check</button>
      <button mat-raised-button color="accent" (click)="generateMerit()">Generate Merit List</button>
      <button mat-raised-button color="warn" (click)="allocate()">Allocate Rooms</button>
      <button mat-raised-button (click)="secondRound()">Start Second Round</button>
    </div>
    <table mat-table [dataSource]="results" class="mat-elevation-z2" *ngIf="results?.length">
      <ng-container matColumnDef="rank"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.rank}}</td></ng-container>
      <ng-container matColumnDef="studentId"><th mat-header-cell *matHeaderCellDef>Student ID</th><td mat-cell *matCellDef="let r">{{r.studentId}}</td></ng-container>
      <ng-container matColumnDef="meritScore"><th mat-header-cell *matHeaderCellDef>Score</th><td mat-cell *matCellDef="let r">{{r.meritScore}}</td></ng-container>
      <ng-container matColumnDef="allocatedHostelId"><th mat-header-cell *matHeaderCellDef>Allocated Hostel</th><td mat-cell *matCellDef="let r">{{r.allocatedHostelId || '-'}}</td></ng-container>
      <tr mat-header-row *matHeaderRowDef="displayed"></tr>
      <tr mat-row *matRowDef="let row; columns: displayed;"></tr>
    </table>
  `,
  styles: [`.actions { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1rem; }`]
})
export class AdminMeritAllocationComponent {
  private admin = inject(AdminService);
  private snack = inject(MatSnackBar);
  results: MeritResultDto[] = [];
  displayed = ['rank', 'studentId', 'meritScore', 'allocatedHostelId'];

  runEligibility() {
    if (!confirm('Run eligibility check now?')) return;
    this.admin.runEligibilityCheck().subscribe({
      next: () => this.snack.open('Eligibility check completed', 'OK', { duration: 2000 })
    });
  }

  generateMerit() {
    if (!confirm('Generate merit list now?')) return;
    this.admin.generateMerit().subscribe({
      next: () => this.snack.open('Merit list generated', 'OK', { duration: 2000 })
    });
  }

  allocate() {
    if (!confirm('Allocate rooms now?')) return;
    this.admin.allocateRooms().subscribe({
      next: () => this.snack.open('Rooms allocated', 'OK', { duration: 2000 })
    });
  }

  secondRound() {
    if (!confirm('Start second round now?')) return;
    this.admin.startSecondRound().subscribe({
      next: () => this.snack.open('Second round started', 'OK', { duration: 2000 })
    });
  }

  // optional: load latest merit results
  loadResults() {
    this.admin.getMeritResults().subscribe(data => this.results = data);
  }
}
