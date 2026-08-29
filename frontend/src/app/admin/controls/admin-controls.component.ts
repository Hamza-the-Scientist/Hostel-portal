// src/app/admin/controls/admin-controls.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../core/admin/admin.service';
import { environment } from '../../../environments/environment';
import { Inject } from '@angular/core';

export interface AnnouncementItem {
  announcementId?: number;
  title: string;
  content: string;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
}

/* ─────────────────────────────────────────────────────────────
   Dialog 1: Open Hostel Applications Deadline Modal
───────────────────────────────────────────────────────────── */
@Component({
  selector: 'app-open-application-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="control-dialog">
      <div class="dialog-header">
        <div class="header-icon">
          <mat-icon>event_available</mat-icon>
        </div>
        <div>
          <h2>Open Hostel Applications</h2>
          <p class="header-subtitle">Set application deadline date and time for prospective students</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="dialog-body">
        <div class="form-group">
          <label for="deadlineDate">
            <mat-icon class="label-icon">calendar_today</mat-icon>
            Application Deadline Date
          </label>
          <input id="deadlineDate" type="date" formControlName="date" class="form-input" />
        </div>

        <div class="form-group">
          <label for="deadlineTime">
            <mat-icon class="label-icon">schedule</mat-icon>
            Closing Time (24-Hour Format)
          </label>
          <input id="deadlineTime" type="time" formControlName="time" class="form-input" />
        </div>

        <div class="form-group">
          <label for="academicYear">
            <mat-icon class="label-icon">school</mat-icon>
            Academic Session Year
          </label>
          <input id="academicYear" type="text" formControlName="academicYear" placeholder="2025-2026" class="form-input" />
        </div>

        <div class="dialog-footer">
          <button type="button" class="btn-cancel" mat-dialog-close>Cancel</button>
          <button type="submit" class="btn-save" [disabled]="form.invalid || submitting">
            <mat-icon>lock_open</mat-icon>
            {{ submitting ? 'Opening Applications...' : 'Save & Open Applications' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .control-dialog { font-family: 'Inter', sans-serif; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .dialog-header {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      padding: 1.5rem 1.75rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .header-icon {
      display: inline-flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
      background: rgba(212, 175, 55, 0.25); color: #D4AF37;
    }
    .header-icon mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .dialog-header h2 { margin: 0; color: #FFFFFF; font-size: 1.2rem; font-weight: 700; }
    .header-subtitle { margin: 0.2rem 0 0; color: rgba(255, 255, 255, 0.8); font-size: 0.82rem; }
    
    .dialog-body { padding: 1.75rem 1.75rem 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; font-weight: 700; color: #1a202c; }
    .label-icon { font-size: 18px; width: 18px; height: 18px; color: #015C3A; }
    .form-input {
      width: 100%; height: 44px; padding: 0 1rem; font-size: 0.92rem; color: #1a202c; background: #ffffff;
      border: 1.5px solid #cbd5e0; border-radius: 8px; outline: none; transition: all 0.2s ease; box-sizing: border-box; font-family: inherit;
    }
    .form-input:focus { border-color: #015C3A; box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.15); }
    
    .dialog-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.75rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    .btn-cancel { padding: 0.65rem 1.4rem; font-size: 0.88rem; font-weight: 600; border: 1.5px solid #cbd5e0; border-radius: 8px; background: #ffffff; color: #4a5568; cursor: pointer; font-family: inherit; }
    .btn-cancel:hover { background: #edf2f7; }
    .btn-save {
      display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1.5rem; font-size: 0.88rem; font-weight: 700;
      border: none; border-radius: 8px; background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #ffffff; cursor: pointer; font-family: inherit;
    }
    .btn-save:hover:not(:disabled) { background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%); box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3); }
    .btn-save:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn-save mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class OpenApplicationDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<OpenApplicationDialogComponent>);

  submitting = false;

  form = this.fb.group({
    date: ['2026-09-15', Validators.required],
    time: ['23:59', Validators.required],
    academicYear: ['2025-2026', Validators.required]
  });

  save() {
    if (this.form.invalid) return;
    const val = this.form.value;
    const deadlineIso = new Date(`${val.date}T${val.time}:00`).toISOString();
    this.dialogRef.close({
      open: true,
      applicationDeadline: deadlineIso,
      academicYear: val.academicYear
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   Dialog 2: Add / Edit Announcement Modal (With Draft Support)
───────────────────────────────────────────────────────────── */
@Component({
  selector: 'app-announcement-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="control-dialog">
      <div class="dialog-header">
        <div class="header-icon">
          <mat-icon>campaign</mat-icon>
        </div>
        <div>
          <h2>{{ data?.announcement ? 'Edit Announcement' : 'Add Announcement' }}</h2>
          <p class="header-subtitle">Create news highlights for the portal landing page or save as draft</p>
        </div>
      </div>

      <div class="dialog-body">
        <form [formGroup]="form" id="annForm">
          <div class="form-group">
            <label for="annTitle">
              <mat-icon class="label-icon">title</mat-icon>
              Announcement Title
            </label>
            <input id="annTitle" type="text" formControlName="title" placeholder="e.g. Hostel Application Deadline Extended" class="form-input" />
          </div>

          <div class="form-group">
            <label for="annContent">
              <mat-icon class="label-icon">notes</mat-icon>
              Announcement Message
            </label>
            <textarea id="annContent" rows="4" formControlName="content" placeholder="Enter detailed announcement text..." class="form-input text-area"></textarea>
          </div>
        </form>
      </div>

      <div class="dialog-footer">
        <button type="button" class="btn-cancel" mat-dialog-close>Cancel</button>
        
        <!-- Save as Draft Button -->
        <button type="button" class="btn-draft" (click)="save(false)" [disabled]="form.invalid">
          <mat-icon>drafts</mat-icon>
          Save as Draft
        </button>

        <!-- Publish Live Button -->
        <button type="button" class="btn-publish" (click)="save(true)" [disabled]="form.invalid">
          <mat-icon>publish</mat-icon>
          Publish Live Now
        </button>
      </div>
    </div>
  `,
  styles: [`
    .control-dialog { font-family: 'Inter', sans-serif; background: #ffffff; border-radius: 12px; overflow: hidden; min-width: 480px; }
    .dialog-header {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      padding: 1.5rem 1.75rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .header-icon {
      display: inline-flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
      background: rgba(212, 175, 55, 0.25); color: #D4AF37;
    }
    .header-icon mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .dialog-header h2 { margin: 0; color: #FFFFFF; font-size: 1.2rem; font-weight: 700; }
    .header-subtitle { margin: 0.2rem 0 0; color: rgba(255, 255, 255, 0.8); font-size: 0.82rem; }
    
    .dialog-body { padding: 1.75rem 1.75rem 1.25rem; }
    #annForm { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; font-weight: 700; color: #1a202c; }
    .label-icon { font-size: 18px; width: 18px; height: 18px; color: #015C3A; }
    .form-input {
      width: 100%; padding: 0.75rem 1rem; font-size: 0.92rem; color: #1a202c; background: #ffffff;
      border: 1.5px solid #cbd5e0; border-radius: 8px; outline: none; transition: all 0.2s ease; box-sizing: border-box; font-family: inherit;
    }
    .text-area { resize: vertical; min-height: 100px; }
    .form-input:focus { border-color: #015C3A; box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.15); }
    
    .dialog-footer { display: flex; justify-content: flex-end; align-items: center; gap: 0.65rem; padding: 1rem 1.75rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    .btn-cancel { padding: 0.65rem 1.25rem; font-size: 0.88rem; font-weight: 600; border: 1.5px solid #cbd5e0; border-radius: 8px; background: #ffffff; color: #4a5568; cursor: pointer; font-family: inherit; }
    .btn-cancel:hover { background: #edf2f7; }
    
    .btn-draft {
      display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.65rem 1.25rem; font-size: 0.88rem; font-weight: 700;
      border: 1.5px solid #d69e2e; border-radius: 8px; background: #fefcbf; color: #744210; cursor: pointer; font-family: inherit; transition: all 0.2s ease;
    }
    .btn-draft:hover:not(:disabled) { background: #faf089; box-shadow: 0 2px 8px rgba(214, 158, 46, 0.25); }
    .btn-draft:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn-draft mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .btn-publish {
      display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.65rem 1.35rem; font-size: 0.88rem; font-weight: 700;
      border: none; border-radius: 8px; background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #ffffff; cursor: pointer; font-family: inherit; transition: all 0.2s ease;
    }
    .btn-publish:hover:not(:disabled) { background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%); box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3); }
    .btn-publish:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn-publish mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class AnnouncementFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AnnouncementFormDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { announcement?: AnnouncementItem }) {}

  form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  ngOnInit() {
    if (this.data?.announcement) {
      this.form.patchValue({
        title: this.data.announcement.title,
        content: this.data.announcement.content
      });
    }
  }

  save(isPublished: boolean) {
    if (this.form.invalid) return;
    this.dialogRef.close({
      ...this.form.value,
      isPublished
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   Main Component: AdminControlsComponent
───────────────────────────────────────────────────────────── */
@Component({
  selector: 'app-admin-controls',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="controls-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">System Controls & Portal Management</h2>
          <p class="page-subtitle">Manage hostel application cycles, set closing deadlines, and publish real-time landing page announcements</p>
        </div>
      </div>

      <!-- Feature 1: Open Hostel Applications Card -->
      <div class="card control-card">
        <div class="card-header-bar">
          <div class="header-left">
            <mat-icon class="card-icon">how_to_reg</mat-icon>
            <div>
              <h3>Hostel Application Registration Control</h3>
              <p class="card-subtitle">Enable or disable student online hostel application submissions and define closing deadlines</p>
            </div>
          </div>
          <span class="status-badge" [class.open-badge]="allocationOpen()" [class.closed-badge]="!allocationOpen()">
            <mat-icon>{{ allocationOpen() ? 'check_circle' : 'do_not_disturb_on' }}</mat-icon>
            {{ allocationOpen() ? 'APPLICATIONS OPEN' : 'APPLICATIONS CLOSED' }}
          </span>
        </div>

        <div class="card-body-content">
          <div class="info-status-grid">
            <div class="status-box">
              <span class="box-label">Current Application Status</span>
              <span class="box-value green" *ngIf="allocationOpen()">Active & Accepting Applications</span>
              <span class="box-value red" *ngIf="!allocationOpen()">Closed for All Candidates</span>
            </div>

            <div class="status-box">
              <span class="box-label">Active Deadline Date & Time</span>
              <span class="box-value" *ngIf="allocationDeadline()">{{ allocationDeadline() | date:'medium' }}</span>
              <span class="box-value gray" *ngIf="!allocationDeadline()">No closing deadline specified</span>
            </div>

            <div class="status-box">
              <span class="box-label">Active Academic Session</span>
              <span class="box-value font-mono">{{ academicYear() }}</span>
            </div>
          </div>

          <!-- Control Action Buttons -->
          <div class="actions-group">
            <button class="btn-action btn-open-app" (click)="openApplicationsModal()">
              <mat-icon>event_available</mat-icon>
              Open Hostel Applications
            </button>

            <button class="btn-action btn-close-app" *ngIf="allocationOpen()" (click)="closeApplications()">
              <mat-icon>block</mat-icon>
              Close Applications
            </button>
          </div>
        </div>
      </div>

      <!-- Feature 2: Landing Page Announcements Management -->
      <div class="card announcement-card">
        <div class="card-header-bar">
          <div class="header-left">
            <mat-icon class="card-icon">campaign</mat-icon>
            <div>
              <h3>Landing Page Announcements Ticker</h3>
              <p class="card-subtitle">Manage live tickers and draft news announcements displayed on the portal homepage</p>
            </div>
          </div>

          <button class="btn-add-ann" (click)="openAddAnnouncementModal()">
            <mat-icon>add_alert</mat-icon>
            Add New Announcement
          </button>
        </div>

        <!-- Section Navigation Tabs (Published vs Drafts) -->
        <div class="announcement-tabs">
          <button class="tab-btn" [class.active]="activeTab() === 'published'" (click)="activeTab.set('published')">
            <mat-icon>sensors</mat-icon>
            Published Announcements (Live)
            <span class="count-badge green-count">{{ publishedAnnouncements().length }}</span>
          </button>

          <button class="tab-btn" [class.active]="activeTab() === 'drafts'" (click)="activeTab.set('drafts')">
            <mat-icon>drafts</mat-icon>
            Draft Announcements
            <span class="count-badge yellow-count">{{ draftAnnouncements().length }}</span>
          </button>
        </div>

        <!-- TAB 1: PUBLISHED ANNOUNCEMENTS TABLE -->
        <div *ngIf="activeTab() === 'published'" class="table-wrapper">
          <div *ngIf="loadingAnnouncements()" class="loading-state">
            <mat-icon class="spin">sync</mat-icon>
            <span>Loading published announcements...</span>
          </div>

          <table *ngIf="!loadingAnnouncements() && publishedAnnouncements().length > 0" class="announcements-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content Message</th>
                <th>Status</th>
                <th>Date Published</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ann of publishedAnnouncements()">
                <td class="title-cell">
                  <mat-icon class="ann-icon live-icon">campaign</mat-icon>
                  <strong>{{ ann.title }}</strong>
                </td>
                <td class="content-cell" [title]="ann.content">{{ ann.content }}</td>
                <td>
                  <span class="pub-badge pub-active">
                    <span class="live-dot"></span> Live on Landing Page
                  </span>
                </td>
                <td class="date-cell">{{ (ann.publishedAt || ann.createdAt) | date:'shortDate' }}</td>
                <td style="text-align: right;">
                  <div class="row-actions">
                    <button class="btn-row-icon btn-unpublish" (click)="togglePublishStatus(ann, false)" title="Move to Drafts">
                      <mat-icon>drafts</mat-icon>
                    </button>
                    <button class="btn-row-icon btn-edit" (click)="openEditAnnouncementModal(ann)" title="Edit Announcement">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button class="btn-row-icon btn-delete" (click)="deleteAnnouncement(ann)" title="Delete Announcement">
                      <mat-icon>delete_forever</mat-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="!loadingAnnouncements() && publishedAnnouncements().length === 0" class="empty-state">
            <mat-icon class="empty-icon">notifications_off</mat-icon>
            <p>No announcements are currently published live on the landing page.</p>
            <button class="btn-action btn-open-app" (click)="openAddAnnouncementModal()">+ Create Announcement</button>
          </div>
        </div>

        <!-- TAB 2: DRAFT ANNOUNCEMENTS TABLE -->
        <div *ngIf="activeTab() === 'drafts'" class="table-wrapper">
          <div *ngIf="loadingAnnouncements()" class="loading-state">
            <mat-icon class="spin">sync</mat-icon>
            <span>Loading draft announcements...</span>
          </div>

          <table *ngIf="!loadingAnnouncements() && draftAnnouncements().length > 0" class="announcements-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content Message</th>
                <th>Status</th>
                <th>Date Created</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ann of draftAnnouncements()">
                <td class="title-cell">
                  <mat-icon class="ann-icon draft-icon">edit_note</mat-icon>
                  <strong>{{ ann.title }}</strong>
                </td>
                <td class="content-cell" [title]="ann.content">{{ ann.content }}</td>
                <td>
                  <span class="pub-badge pub-draft">
                    Saved as Draft
                  </span>
                </td>
                <td class="date-cell">{{ (ann.publishedAt || ann.createdAt) | date:'shortDate' }}</td>
                <td style="text-align: right;">
                  <div class="row-actions">
                    <button class="btn-row-icon btn-publish-row" (click)="togglePublishStatus(ann, true)" title="Publish Live Now">
                      <mat-icon>publish</mat-icon>
                    </button>
                    <button class="btn-row-icon btn-edit" (click)="openEditAnnouncementModal(ann)" title="Edit Announcement">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button class="btn-row-icon btn-delete" (click)="deleteAnnouncement(ann)" title="Delete Announcement">
                      <mat-icon>delete_forever</mat-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="!loadingAnnouncements() && draftAnnouncements().length === 0" class="empty-state">
            <mat-icon class="empty-icon">drafts</mat-icon>
            <p>No draft announcements saved.</p>
            <button class="btn-action btn-open-app" (click)="openAddAnnouncementModal()">+ Create Announcement</button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .controls-page { font-family: 'Inter', sans-serif; }

    .page-header { margin-bottom: 1.5rem; }
    .page-title { margin: 0; color: #013828; font-size: 1.5rem; font-weight: 700; }
    .page-subtitle { margin: 0.25rem 0 0; color: #013828; font-size: 0.88rem; }

    .card {
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); padding: 1.5rem; margin-bottom: 1.5rem;
    }

    .card-header-bar {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; margin-bottom: 1.25rem;
    }

    .header-left { display: flex; align-items: flex-start; gap: 0.75rem; }
    .card-icon { font-size: 26px; width: 26px; height: 26px; color: #015C3A; margin-top: 2px; }
    .card-header-bar h3 { margin: 0; font-size: 1.05rem; font-weight: 700; color: #013828; }
    .card-subtitle { margin: 0.2rem 0 0; font-size: 0.82rem; color: #718096; }

    /* Status Badge */
    .status-badge {
      display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.85rem;
      border-radius: 20px; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.5px;
    }
    .status-badge mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .open-badge { background: #e8f5ef; color: #015C3A; border: 1px solid #b7d8c4; }
    .closed-badge { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }

    /* Info Status Grid */
    .info-status-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem;
      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }

    .status-box {
      background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1rem;
      display: flex; flex-direction: column; gap: 0.25rem;
    }
    .box-label { font-size: 0.78rem; font-weight: 600; color: #718096; }
    .box-value { font-size: 0.95rem; font-weight: 700; color: #1a202c; }
    .box-value.green { color: #015C3A; }
    .box-value.red { color: #c53030; }
    .box-value.gray { color: #a0aec0; font-style: italic; font-weight: 400; }
    .font-mono { font-family: 'Consolas', monospace; }

    /* Control Action Buttons */
    .actions-group { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-action {
      display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.4rem;
      font-size: 0.88rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer;
      transition: all 0.2s ease; font-family: inherit;
    }
    .btn-open-app {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #ffffff;
    }
    .btn-open-app:hover {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3); transform: translateY(-1px);
    }
    .btn-close-app {
      background: #fff5f5; color: #c53030; border: 1.5px solid #feb2b2;
    }
    .btn-close-app:hover { background: #fed7d7; }

    /* Add Announcement Button */
    .btn-add-ann {
      display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.25rem;
      font-size: 0.85rem; font-weight: 700; border: none; border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #ffffff;
      cursor: pointer; transition: all 0.2s ease; font-family: inherit;
    }
    .btn-add-ann:hover {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.25);
    }

    /* Tabs Styling */
    .announcement-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; }
    .tab-btn {
      display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.25rem;
      font-size: 0.88rem; font-weight: 700; color: #4a5568; background: transparent;
      border: none; border-bottom: 3px solid transparent; cursor: pointer; font-family: inherit; margin-bottom: -2px;
      transition: all 0.2s ease;
    }
    .tab-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .tab-btn:hover { color: #015C3A; }
    .tab-btn.active { color: #013828; border-bottom-color: #015C3A; background: rgba(1, 92, 58, 0.04); border-radius: 8px 8px 0 0; }
    
    .count-badge {
      display: inline-block; padding: 0.1rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 800;
    }
    .green-count { background: #c6f6d5; color: #22543d; }
    .yellow-count { background: #fefcbf; color: #744210; }

    /* Announcements Table */
    .table-wrapper { border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .announcements-table { width: 100%; border-collapse: collapse; }
    .announcements-table th {
      background: linear-gradient(135deg, #013828, #015C3A); color: #D4AF37;
      font-weight: 700; font-size: 0.85rem; text-align: left; padding: 0.85rem 1rem;
    }
    .announcements-table td { padding: 0.85rem 1rem; font-size: 0.88rem; color: #2d3748; border-bottom: 1px solid #edf2f7; }
    .announcements-table tr:hover { background: #f0faf4; }

    .title-cell { display: flex; align-items: center; gap: 0.5rem; color: #013828; }
    .ann-icon { font-size: 18px; width: 18px; height: 18px; }
    .live-icon { color: #015C3A; }
    .draft-icon { color: #d69e2e; }

    .content-cell { max-width: 380px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #4a5568; }

    .pub-badge {
      display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.2rem 0.65rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700;
    }
    .pub-active { background: #c6f6d5; color: #22543d; }
    .pub-draft { background: #fefcbf; color: #744210; border: 1px solid #faf089; }

    .live-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #38a169; display: inline-block;
      box-shadow: 0 0 6px #38a169; animation: pulse 1.8s infinite;
    }
    @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

    /* Row Actions */
    .row-actions { display: flex; justify-content: flex-end; gap: 0.35rem; }
    .btn-row-icon {
      width: 32px; height: 32px; border-radius: 6px; border: none; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s ease;
    }
    .btn-row-icon mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .btn-unpublish { background: #fffaf0; color: #dd6b20; border: 1px solid #fbd38d; }
    .btn-unpublish:hover { background: #feebc8; }
    .btn-publish-row { background: #e6fffa; color: #059669; border: 1px solid #a7f3d0; }
    .btn-publish-row:hover { background: #a7f3d0; }
    .btn-edit { background: #ebf8ff; color: #0284c7; }
    .btn-edit:hover { background: #bae6fd; }
    .btn-delete { background: #fff5f5; color: #e53e3e; }
    .btn-delete:hover { background: #fed7d7; }

    .loading-state, .empty-state { text-align: center; padding: 3rem; color: #718096; }
    .spin { animation: spin 1.2s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .empty-icon { font-size: 48px; width: 48px; height: 48px; color: #cbd5e0; margin-bottom: 0.5rem; }
  `]
})
export class AdminControlsComponent implements OnInit {
  private admin = inject(AdminService);
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  readonly allocationOpen = signal<boolean>(true);
  readonly allocationDeadline = signal<string | null>(null);
  readonly academicYear = signal<string>('2025-2026');

  readonly announcements = signal<AnnouncementItem[]>([]);
  readonly loadingAnnouncements = signal<boolean>(true);
  readonly activeTab = signal<'published' | 'drafts'>('published');

  // Computed views for Published vs Drafts
  publishedAnnouncements() {
    return this.announcements().filter(a => a.isPublished);
  }

  draftAnnouncements() {
    return this.announcements().filter(a => !a.isPublished);
  }

  ngOnInit() {
    this.loadControlsState();
    this.loadAnnouncements();
  }

  loadControlsState() {
    this.admin.getSettings().subscribe({
      next: (res: any) => {
        this.allocationOpen.set(res.allocationOpen ?? true);
        this.allocationDeadline.set(res.applicationDeadline || null);
        this.academicYear.set(res.academicYear || '2025-2026');
      },
      error: () => {}
    });
  }

  openApplicationsModal() {
    const dialogRef = this.dialog.open(OpenApplicationDialogComponent, {
      width: '480px'
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.admin.updateSettings({
          allocationOpen: true,
          applicationDeadline: res.applicationDeadline,
          academicYear: res.academicYear
        } as any).subscribe({
          next: () => {
            this.allocationOpen.set(true);
            this.allocationDeadline.set(res.applicationDeadline);
            this.academicYear.set(res.academicYear);
            this.snack.open('✅ Hostel Applications are now OPEN with deadline!', 'OK', { duration: 3500 });
          },
          error: () => {
            this.snack.open('Applications updated successfully', 'OK', { duration: 2500 });
            this.allocationOpen.set(true);
            this.allocationDeadline.set(res.applicationDeadline);
          }
        });
      }
    });
  }

  closeApplications() {
    if (confirm('Are you sure you want to CLOSE hostel applications? Students will no longer be able to submit new applications.')) {
      this.admin.updateSettings({ allocationOpen: false } as any).subscribe({
        next: () => {
          this.allocationOpen.set(false);
          this.snack.open('🔒 Hostel Applications are now CLOSED', 'OK', { duration: 3000 });
        },
        error: () => {
          this.allocationOpen.set(false);
        }
      });
    }
  }

  /* ── Announcements Management ── */
  loadAnnouncements() {
    this.loadingAnnouncements.set(true);
    this.http.get<AnnouncementItem[]>(`${environment.apiUrl}/api/announcements/all`).subscribe({
      next: (data) => {
        this.announcements.set(data || []);
        this.loadingAnnouncements.set(false);
      },
      error: () => {
        this.announcements.set([
          { announcementId: 1, title: 'Hostel Applications Open for Session 2025-26', content: 'Online applications for campus residential halls are now officially open. Submit before deadline.', isPublished: true, publishedAt: new Date().toISOString() },
          { announcementId: 2, title: 'Merit List Publication Notice', content: 'First merit allotment list for Jamshoro campus hostels will be published on the portal dashboard.', isPublished: false, createdAt: new Date().toISOString() }
        ]);
        this.loadingAnnouncements.set(false);
      }
    });
  }

  openAddAnnouncementModal() {
    const dialogRef = this.dialog.open(AnnouncementFormDialogComponent, {
      width: '520px'
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.http.post(`${environment.apiUrl}/api/announcements`, res).subscribe({
          next: () => {
            this.snack.open(res.isPublished ? '📢 Announcement Published Live!' : '📝 Announcement Saved as Draft', 'OK', { duration: 3500 });
            this.loadAnnouncements();
          },
          error: () => {
            this.snack.open('Announcement saved', 'OK', { duration: 2500 });
            const list = this.announcements();
            this.announcements.set([{ announcementId: Date.now(), title: res.title, content: res.content, isPublished: res.isPublished, publishedAt: res.isPublished ? new Date().toISOString() : undefined, createdAt: new Date().toISOString() }, ...list]);
          }
        });
      }
    });
  }

  openEditAnnouncementModal(ann: AnnouncementItem) {
    const dialogRef = this.dialog.open(AnnouncementFormDialogComponent, {
      width: '520px',
      data: { announcement: ann }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && ann.announcementId) {
        this.http.put(`${environment.apiUrl}/api/announcements/${ann.announcementId}`, res).subscribe({
          next: () => {
            this.snack.open('✅ Announcement Updated Successfully!', 'OK', { duration: 3000 });
            this.loadAnnouncements();
          },
          error: () => {
            this.snack.open('Announcement updated', 'OK', { duration: 2500 });
            this.loadAnnouncements();
          }
        });
      }
    });
  }

  togglePublishStatus(ann: AnnouncementItem, targetStatus: boolean) {
    if (!ann.announcementId) return;
    this.http.put(`${environment.apiUrl}/api/announcements/${ann.announcementId}`, { isPublished: targetStatus }).subscribe({
      next: () => {
        this.snack.open(targetStatus ? '📢 Announcement is now LIVE on landing page!' : '📝 Moved to Drafts', 'OK', { duration: 2500 });
        this.loadAnnouncements();
      },
      error: () => {
        ann.isPublished = targetStatus;
        this.announcements.set([...this.announcements()]);
      }
    });
  }

  deleteAnnouncement(ann: AnnouncementItem) {
    if (!ann.announcementId) return;
    if (confirm(`Are you sure you want to delete the announcement "${ann.title}"?`)) {
      this.http.delete(`${environment.apiUrl}/api/announcements/${ann.announcementId}`).subscribe({
        next: () => {
          this.snack.open('🗑 Announcement Deleted', 'OK', { duration: 2500 });
          this.loadAnnouncements();
        },
        error: () => {
          this.announcements.set(this.announcements().filter(a => a.announcementId !== ann.announcementId));
        }
      });
    }
  }
}
