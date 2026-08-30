// src/app/admin/merit/revert-allocation-dialog.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-revert-allocation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="revert-dialog">
      <!-- Step 1: Initial Warning -->
      <div *ngIf="step === 1">
        <div class="dialog-header">
          <div class="warning-icon-wrap">
            <mat-icon class="warning-icon">warning</mat-icon>
          </div>
          <h2 class="dialog-title">Revert All Allocation?</h2>
          <p class="dialog-subtitle">Demonstration Reset Confirmation</p>
        </div>

        <div class="dialog-body">
          <p class="warning-text">
            This will remove the current hostel, room, and bed allocations and restore the allocation state to <strong>unallocated</strong>.
          </p>
          <div class="info-box">
            <div class="info-item">
              <mat-icon class="info-icon check">check_circle</mat-icon>
              <span><strong>Preserved:</strong> Student accounts, applications, eligibility checks, and confirmed district quota distributions will <strong>NOT</strong> be deleted.</span>
            </div>
            <div class="info-item">
              <mat-icon class="info-icon reset">restart_alt</mat-icon>
              <span><strong>Reset:</strong> All room/bed assignments, resident entries, and allocation statuses will return to clean unallocated status.</span>
            </div>
          </div>
          <p class="confirm-prompt">Are you sure you want to continue?</p>
        </div>

        <div class="dialog-actions">
          <button class="btn-cancel" (click)="cancel()">Cancel</button>
          <button class="btn-proceed-warning" (click)="nextStep()">Proceed to Reset</button>
        </div>
      </div>

      <!-- Step 2: Final Confirmation -->
      <div *ngIf="step === 2">
        <div class="dialog-header step-2">
          <div class="danger-icon-wrap">
            <mat-icon class="danger-icon">restart_alt</mat-icon>
          </div>
          <h2 class="dialog-title">Final Reset Confirmation</h2>
          <p class="dialog-subtitle">Action cannot be undone automatically</p>
        </div>

        <div class="dialog-body">
          <div class="final-alert">
            <p>Please confirm that you want to reset all current allocations for this demonstration round.</p>
          </div>
        </div>

        <div class="dialog-actions">
          <button class="btn-cancel" (click)="cancel()">Cancel</button>
          <button class="btn-revert-final" (click)="confirmRevert()">
            <mat-icon>delete_forever</mat-icon>
            <span>Yes, Revert All Allocation</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .revert-dialog { font-family: 'Inter', sans-serif; }

    .dialog-header {
      background: linear-gradient(135deg, #742a2a 0%, #9b2c2c 100%);
      padding: 2rem 1.5rem 1.25rem;
      margin: -24px -24px 1.25rem -24px;
      text-align: center;
      color: #ffffff;
    }
    .dialog-header.step-2 {
      background: linear-gradient(135deg, #9b2c2c 0%, #c53030 100%);
    }

    .warning-icon-wrap, .danger-icon-wrap {
      display: inline-flex; align-items: center; justify-content: center;
      width: 52px; height: 52px; border-radius: 14px; background: rgba(255, 255, 255, 0.2);
      margin-bottom: 0.5rem; color: #ffffff;
    }
    .warning-icon, .danger-icon { font-size: 28px; width: 28px; height: 28px; }

    .dialog-title { margin: 0; font-size: 1.35rem; font-weight: 800; letter-spacing: 0.3px; }
    .dialog-subtitle { margin: 0.25rem 0 0; color: rgba(255, 255, 255, 0.85); font-size: 0.85rem; }

    .dialog-body { padding: 0.5rem 0.25rem; }
    .warning-text { font-size: 0.92rem; color: #2d3748; line-height: 1.5; margin-bottom: 1rem; }

    .info-box {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
      padding: 0.9rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.6rem;
    }
    .info-item { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.84rem; color: #475569; line-height: 1.4; }
    .info-icon { font-size: 18px; width: 18px; height: 18px; margin-top: 1px; flex-shrink: 0; }
    .info-icon.check { color: #059669; }
    .info-icon.reset { color: #dc2626; }

    .confirm-prompt { font-weight: 700; color: #9b2c2c; font-size: 0.9rem; margin: 0.5rem 0 0; }

    .final-alert {
      background: #fff5f5; border: 1.5px solid #feb2b2; border-radius: 10px;
      padding: 1rem; color: #9b2c2c; font-weight: 600; font-size: 0.92rem; line-height: 1.5; text-align: center;
    }

    .dialog-actions {
      display: flex; justify-content: flex-end; align-items: center; gap: 0.75rem;
      padding-top: 1rem; border-top: 1px solid #e2e8f0; margin-top: 1rem;
    }

    .btn-cancel {
      padding: 0.6rem 1.2rem; font-size: 0.88rem; font-weight: 600;
      border: 1.5px solid #cbd5e0; border-radius: 8px; background: #ffffff;
      color: #4a5568; cursor: pointer; font-family: inherit;
    }
    .btn-cancel:hover { background: #edf2f7; color: #1a202c; }

    .btn-proceed-warning {
      padding: 0.6rem 1.25rem; font-size: 0.88rem; font-weight: 700;
      border: none; border-radius: 8px; background: #d97706; color: #ffffff;
      cursor: pointer; font-family: inherit; box-shadow: 0 2px 6px rgba(217, 119, 6, 0.3);
    }
    .btn-proceed-warning:hover { background: #b45309; }

    .btn-revert-final {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.65rem 1.35rem; font-size: 0.88rem; font-weight: 800;
      border: none; border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      color: #ffffff; cursor: pointer; font-family: inherit; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.35);
    }
    .btn-revert-final:hover { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
  `]
})
export class RevertAllocationDialogComponent {
  private dialogRef = inject(MatDialogRef<RevertAllocationDialogComponent>);
  step = 1;

  nextStep() {
    this.step = 2;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  confirmRevert() {
    this.dialogRef.close(true);
  }
}
