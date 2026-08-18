// student/views/hostel-view.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResidencyService, StudentResidencyDto } from '../residency.service';

@Component({
  selector: 'app-hostel-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="view-container">
      <div class="view-header">
        <h2>My Hostel & Facilities</h2>
        <p class="subtitle">Overview of your assigned hostel room, block rules, and campus amenities.</p>
      </div>

      @if (loading()) {
        <div class="loading-state">Loading hostel information...</div>
      } @else if (residency()?.isExistingResident) {
        <div class="hostel-card">
          <div class="hostel-hero">
            <span class="hero-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#015C3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12" y2="22"></line>
              </svg>
            </span>
            <div>
              <h3>{{ residency()?.hostelName }}</h3>
              <p>{{ residency()?.blockName }} — Room {{ residency()?.roomNumber }}, Bed {{ residency()?.bedLabel }}</p>
            </div>
            <span class="status-badge active">Occupied</span>
          </div>

          <div class="details-grid">
            <div class="detail-box">
              <span class="box-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#015C3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 2l-2 2m-1.5 1.5L4 19l-2 3 3-2 13.5-13.5z"></path>
                </svg>
              </span>
              <div>
                <strong>Room Number</strong>
                <p>{{ residency()?.roomNumber }}</p>
              </div>
            </div>
            <div class="detail-box">
              <span class="box-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#015C3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"></path>
                </svg>
              </span>
              <div>
                <strong>Assigned Bed</strong>
                <p>{{ residency()?.bedLabel }}</p>
              </div>
            </div>
            <div class="detail-box">
              <span class="box-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#015C3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
              <div>
                <strong>Check-In Date</strong>
                <p>{{ residency()?.checkInDate || '2024-09-01' }}</p>
              </div>
            </div>
            <div class="detail-box">
              <span class="box-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#015C3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </span>
              <div>
                <strong>Annual Fee Status</strong>
                <p>{{ residency()?.annualFeeStatus }}</p>
              </div>
            </div>
          </div>

          <div class="actions-row">
            <a routerLink="/student/room-change" class="btn btn-primary">
              Request Room Change
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </a>
            <a routerLink="/student/complaints" class="btn btn-outline">
              Report Maintenance Issue
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-left: 4px;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </a>
          </div>
        </div>
      } @else {
        <div class="empty-state">
          <span class="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015C3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12" y2="22"></line>
            </svg>
          </span>
          <h3>No Hostel Currently Assigned</h3>
          <p>You have not been allocated a hostel room yet for this session.</p>
          <a routerLink="/student/apply" class="btn btn-primary">Submit Hostel Application →</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .view-container { max-width: 900px; margin: 0 auto; }
    .view-header h2 { font-size: 1.5rem; font-weight: 800; color: var(--color-primary-deep); margin-bottom: 0.25rem; }
    .subtitle { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
    .hostel-card { background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 2rem; box-shadow: var(--shadow-sm); }
    .hostel-hero { display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
    .hero-icon { display: flex; align-items: center; justify-content: center; }
    .hostel-hero h3 { font-size: 1.3rem; font-weight: 800; color: var(--color-primary-deep); margin: 0; }
    .hostel-hero p { color: var(--color-text-muted); margin: 0.2rem 0 0 0; }
    .status-badge { margin-left: auto; padding: 0.35rem 0.85rem; border-radius: 20px; font-weight: 700; font-size: 0.8rem; }
    .status-badge.active { background: #D1FAE5; color: #047857; border: 1px solid #A7F3D0; }
    .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .detail-box { display: flex; align-items: center; gap: 0.85rem; background: #F4FBF7; padding: 1rem; border-radius: 12px; border: 1px solid var(--color-border); }
    .box-icon { display: flex; align-items: center; justify-content: center; }
    .detail-box strong { font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; }
    .detail-box p { font-size: 1rem; font-weight: 700; color: var(--color-primary-deep); margin: 0.1rem 0 0 0; }
    .actions-row { display: flex; gap: 1rem; }
    .btn { padding: 0.65rem 1.25rem; border-radius: var(--radius-btn); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.2s ease; cursor: pointer; }
    .btn-primary { background: var(--color-primary); color: #FFFFFF; border: none; }
    .btn-primary:hover { background: var(--color-primary-dark); box-shadow: var(--shadow-sm); }
    .btn-outline { background: transparent; border: 1px solid var(--color-primary); color: var(--color-primary); }
    .btn-outline:hover { background: var(--color-primary); color: #FFFFFF; }
    .empty-state { text-align: center; padding: 3rem; background: #FFFFFF; border-radius: var(--radius-card); border: 1px solid var(--color-border); color: var(--color-text-main); }
    .empty-icon { display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
    .loading-state { text-align: center; padding: 3rem; color: var(--color-text-muted); }
  `]
})
export class HostelViewComponent implements OnInit {
  private residencyService = inject(ResidencyService);
  readonly loading = signal(true);
  readonly residency = signal<StudentResidencyDto | null>(null);

  ngOnInit() {
    this.residencyService.getResidencyStatus().subscribe({
      next: (res) => {
        this.residency.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
