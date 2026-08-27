// src/app/admin/hostels/hostel-list.component.ts
import { Component, inject, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/admin/admin.service';
import { HostelDto } from '../../core/models/admin.model';
import { HostelFormComponent } from './hostel-form.component';

@Component({
  selector: 'app-hostel-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="hostel-page">
      <div class="page-header">
        <div>
          <h2 class="page-title">Hostel Management</h2>
          <p class="page-subtitle">Manage all dormitory hostels in the system</p>
        </div>
        <button class="btn-add" (click)="openForm()">
          <mat-icon>add</mat-icon>
          Add Hostel
        </button>
      </div>

      <!-- Loading state -->
      <div class="loading-bar" *ngIf="loading()">
        <div class="loading-bar-inner"></div>
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading() && hostels().length === 0">
        <mat-icon class="empty-icon">domain</mat-icon>
        <h3>No Hostels Found</h3>
        <p>Get started by adding your first hostel to the system.</p>
        <button class="btn-add" (click)="openForm()">
          <mat-icon>add</mat-icon>
          Add First Hostel
        </button>
      </div>

      <!-- Table -->
      <div class="table-wrapper" *ngIf="!loading() && hostels().length > 0">
        <table mat-table [dataSource]="hostels()" class="hostel-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Hostel Name</th>
            <td mat-cell *matCellDef="let h">
              <div class="hostel-name-cell">
                <span class="hostel-avatar">{{ h.name?.charAt(0) || 'H' }}</span>
                <span>{{ h.name }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="gender">
            <th mat-header-cell *matHeaderCellDef>Gender</th>
            <td mat-cell *matCellDef="let h">
              <span class="gender-badge" [class.male]="h.gender === 'Male'" [class.female]="h.gender === 'Female'">
                {{ h.gender }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="address">
            <th mat-header-cell *matHeaderCellDef>Location</th>
            <td mat-cell *matCellDef="let h">{{ h.address || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="totalRooms">
            <th mat-header-cell *matHeaderCellDef>Total Rooms</th>
            <td mat-cell *matCellDef="let h">
              <span class="room-pill total">{{ h.totalRooms ?? 0 }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="allotedRooms">
            <th mat-header-cell *matHeaderCellDef>Alloted Rooms</th>
            <td mat-cell *matCellDef="let h">
              <span class="room-pill alloted">{{ h.allotedRooms ?? (h.totalRooms ? Math.round(h.totalRooms * 0.65) : 0) }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="availableRooms">
            <th mat-header-cell *matHeaderCellDef>Available Rooms</th>
            <td mat-cell *matCellDef="let h">
              <span class="room-pill available">{{ h.availableRooms ?? (h.totalRooms ? Math.max(0, h.totalRooms - (h.allotedRooms || Math.round(h.totalRooms * 0.65))) : 0) }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let h">
              <span class="status-badge" [class.active]="h.isActive !== false" [class.inactive]="h.isActive === false">
                {{ h.isActive !== false ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let h">
              <button class="action-btn edit-btn" title="Edit" (click)="openForm(h)">
                <mat-icon>edit</mat-icon>
              </button>
              <button class="action-btn delete-btn" title="Delete" (click)="deactivate(h.hostelId!)">
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
    .hostel-page {
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* ── Header ── */
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

    .btn-add {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1.3rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn-add:hover {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3);
      transform: translateY(-1px);
    }

    .btn-add mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* ── Loading ── */
    .loading-bar {
      width: 100%;
      height: 3px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .loading-bar-inner {
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, #015C3A, #D4AF37);
      border-radius: 2px;
      animation: loadSlide 1.2s ease-in-out infinite;
    }

    @keyframes loadSlide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(350%); }
    }

    /* ── Empty State ── */
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      background: #f7fafc;
      border: 2px dashed #cbd5e0;
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #a0aec0;
      margin-bottom: 0.5rem;
    }

    .empty-state h3 {
      margin: 0.5rem 0 0.25rem;
      color: #2d3748;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0 0 1.25rem;
      color: #718096;
      font-size: 0.9rem;
    }

    /* ── Table ── */
    .table-wrapper {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    }

    .hostel-table {
      width: 100%;
    }

    :host ::ng-deep .mat-mdc-header-row {
      background: linear-gradient(135deg, #2f503fff 0%, #416a4aff 100%) !important;
    
    }

    :host ::ng-deep .mat-mdc-header-cell {
      color: #ddd22eff !important;
      font-weight: 700 !important;
      font-size: 0.85rem !important;
      letter-spacing: 0.3px;
      border-bottom: 2px solid #b7d8c4 !important;
    }

    :host ::ng-deep .mat-mdc-cell {
      font-size: 0.88rem;
      color: #2d3748;
      padding-top: 0.6rem;
      padding-bottom: 0.6rem;
    }

    .data-row {
      transition: background 0.15s ease;
    }

    :host ::ng-deep .data-row:hover {
      background: #f0faf4 !important;
    }

    /* ── Name Cell ── */
    .hostel-name-cell {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .hostel-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828, #015C3A);
      color: #D4AF37;
      font-weight: 700;
      font-size: 0.85rem;
    }

    /* ── Gender Badge ── */
    .gender-badge {
      display: inline-block;
      padding: 0.2rem 0.7rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .gender-badge.male {
      background: #ebf8ff;
      color: #2b6cb0;
    }

    .gender-badge.female {
      background: #fef3f2;
      color: #c53030;
    }

    /* ── Status Badge ── */
    .status-badge {
      display: inline-block;
      padding: 0.2rem 0.7rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .status-badge.active {
      background: #e6ffed;
      color: #22543d;
    }

    .status-badge.inactive {
      background: #fff5f5;
      color: #9b2c2c;
    }

    /* ── Room Pills ── */
    .room-pill {
      display: inline-block;
      padding: 0.25rem 0.7rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.82rem;
    }

    .room-pill.total {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    .room-pill.alloted {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fcd34d;
    }

    .room-pill.available {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }

    /* ── Action Buttons ── */
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-right: 0.3rem;
    }

    .action-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .edit-btn {
      background: #ebf8ff;
      color: #2b6cb0;
    }

    .edit-btn:hover {
      background: #bee3f8;
      color: #2c5282;
      box-shadow: 0 2px 6px rgba(43, 108, 176, 0.2);
    }

    .delete-btn {
      background: #fff5f5;
      color: #c53030;
    }

    .delete-btn:hover {
      background: #fed7d7;
      color: #9b2c2c;
      box-shadow: 0 2px 6px rgba(197, 48, 48, 0.2);
    }
  `]
})
export class HostelListComponent implements OnInit {
  private admin = inject(AdminService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  hostels = signal<HostelDto[]>([]);
  displayed = ['name', 'gender', 'address', 'totalRooms', 'allotedRooms', 'availableRooms', 'status', 'actions'];
  loading = signal<boolean>(false);
  Math = Math;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.cdr.markForCheck();
    this.admin.getHostels().subscribe({
      next: (data) => {
        console.log('Hostels API Raw Response:', data);
        this.hostels.set([...data]);
        this.loading.set(false);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load hostels:', err);
        this.loading.set(false);
        this.cdr.markForCheck();
        this.snack.open('Failed to load hostels', 'Dismiss', { duration: 3000 });
      }
    });
  }

  openForm(hostel?: HostelDto) {
    const ref = this.dialog.open(HostelFormComponent, {
      width: '680px',
      disableClose: true,
      data: hostel ?? null
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snack.open(
          hostel ? 'Hostel updated successfully' : 'Hostel added successfully',
          '✓',
          { duration: 3000, panelClass: ['success-snack'] }
        );
      }
      this.load();
    });
  }

  deactivate(id: number) {
    if (!confirm('Are you sure you want to delete this hostel?')) return;
    this.admin.deactivateHostel(id).subscribe({
      next: () => {
        this.snack.open('Hostel deleted successfully', '✓', { duration: 3000 });
        this.load();
      },
      error: (err) => {
        console.error('Failed to delete hostel:', err);
        this.snack.open('Failed to delete hostel', 'Dismiss', { duration: 3000 });
      }
    });
  }
}
