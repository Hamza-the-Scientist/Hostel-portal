// src/app/admin/rooms/room-residents-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoomDto, RoomResidentDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-room-residents-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="residents-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <div class="header-left">
          <div class="header-icon">
            <mat-icon>people</mat-icon>
          </div>
          <div>
            <h2>Room {{ data.room.number }} Residents</h2>
            <p class="header-subtitle">
              {{ data.hostelName }} • {{ data.room.block }}, Floor {{ data.room.floor }}
            </p>
          </div>
        </div>

        <div class="occupancy-badge" [class.full]="(data.room.occupiedBeds || 0) === data.room.totalBeds">
          <mat-icon>single_bed</mat-icon>
          {{ data.room.occupiedBeds || 0 }} / {{ data.room.totalBeds }} Beds Occupied
        </div>
      </div>

      <!-- Content -->
      <div class="dialog-body">
        <!-- Empty State -->
        <div class="empty-state" *ngIf="!residents || residents.length === 0">
          <mat-icon class="empty-icon">meeting_room</mat-icon>
          <h3>No Residents Currently Allotted</h3>
          <p>This room has 0 occupied beds out of {{ data.room.totalBeds }} total capacity.</p>
        </div>

        <!-- Residents Grid/List -->
        <div class="residents-list" *ngIf="residents && residents.length > 0">
          <div class="resident-card" *ngFor="let r of residents; let i = index">
            <div class="resident-avatar">
              {{ r.name?.charAt(0) || 'S' }}
            </div>

            <div class="resident-main">
              <div class="resident-top">
                <span class="resident-name">{{ r.name }}</span>
                <span class="bed-chip">
                  <mat-icon>bed</mat-icon>
                  {{ r.bedNo || ('Bed ' + (i + 1)) }}
                </span>
              </div>

              <div class="resident-details">
                <div class="detail-item">
                  <mat-icon class="item-icon">badge</mat-icon>
                  <span>Roll #: <strong>{{ r.rollNo }}</strong></span>
                </div>
                <div class="detail-item">
                  <mat-icon class="item-icon">subtitles</mat-icon>
                  <span>CNIC: <strong>{{ r.cnic }}</strong></span>
                </div>
                <div class="detail-item">
                  <mat-icon class="item-icon">school</mat-icon>
                  <span>{{ r.department }} (Batch {{ r.batch }})</span>
                </div>
                <div class="detail-item" *ngIf="r.phone">
                  <mat-icon class="item-icon">phone</mat-icon>
                  <span>{{ r.phone }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="dialog-footer">
        <button type="button" class="btn-close" mat-dialog-close>
          Close
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    :host ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
      padding: 0 !important;
      border-radius: 16px !important;
      overflow: hidden !important;
      background: #ffffff !important;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
    }

    .residents-dialog {
      font-family: 'Inter', 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    /* ── Header ── */
    .dialog-header {
      background: linear-gradient(135deg, #013828 0%, #015C3A 60%, #017A4A 100%);
      padding: 1.75rem 2rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .header-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: rgba(212, 175, 55, 0.22);
      color: #D4AF37;
      flex-shrink: 0;
    }

    .header-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .dialog-header h2 {
      margin: 0;
      color: #FFFFFF;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.2px;
    }

    .header-subtitle {
      margin: 0.25rem 0 0;
      color: rgba(255, 255, 255, 0.82);
      font-size: 0.84rem;
    }

    .occupancy-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.95rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.18);
      color: #ffffff;
      font-size: 0.84rem;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .occupancy-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .occupancy-badge.full {
      background: rgba(254, 178, 178, 0.3);
      border-color: #feb2b2;
      color: #fff5f5;
    }

    /* ── Body ── */
    .dialog-body {
      padding: 1.5rem 2rem;
      max-height: 420px;
      overflow-y: auto;
    }

    /* ── Empty State ── */
    .empty-state {
      text-align: center;
      padding: 2.5rem 1rem;
      background: #f7fafc;
      border: 2px dashed #e2e8f0;
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #cbd5e0;
      margin-bottom: 0.5rem;
    }

    .empty-state h3 {
      margin: 0.5rem 0 0.25rem;
      color: #2d3748;
      font-size: 1rem;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0;
      color: #718096;
      font-size: 0.85rem;
    }

    /* ── Residents List ── */
    .residents-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .resident-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #ffffff;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .resident-card:hover {
      border-color: #015C3A;
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.08);
    }

    .resident-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #D4AF37;
      font-weight: 700;
      font-size: 1.05rem;
      flex-shrink: 0;
    }

    .resident-main {
      flex: 1;
    }

    .resident-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.45rem;
    }

    .resident-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: #1a202c;
    }

    .bed-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.65rem;
      border-radius: 12px;
      background: #e6fffa;
      color: #234e52;
      border: 1px solid #b2f5ea;
      font-size: 0.76rem;
      font-weight: 700;
    }

    .bed-chip mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #319795;
    }

    .resident-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.4rem 1.25rem;
    }

    @media (max-width: 520px) {
      .resident-details {
        grid-template-columns: 1fr;
      }
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.82rem;
      color: #4a5568;
    }

    .item-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #015C3A;
    }

    /* ── Footer ── */
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      padding: 1rem 2rem;
      border-top: 1px solid #e2e8f0;
      background: #f7fafc;
    }

    .btn-close {
      padding: 0.65rem 1.5rem;
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

    .btn-close:hover {
      background: #edf2f7;
      color: #2d3748;
    }
  `]
})
export class RoomResidentsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { room: RoomDto; hostelName: string },
    private dialogRef: MatDialogRef<RoomResidentsDialogComponent>
  ) {}

  get residents(): RoomResidentDto[] {
    return this.data.room.residents || [];
  }
}
