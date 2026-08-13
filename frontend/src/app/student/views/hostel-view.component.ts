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
            <span class="hero-icon">🏢</span>
            <div>
              <h3>{{ residency()?.hostelName }}</h3>
              <p>{{ residency()?.blockName }} — Room {{ residency()?.roomNumber }}, Bed {{ residency()?.bedLabel }}</p>
            </div>
            <span class="status-badge active">Occupied</span>
          </div>

          <div class="details-grid">
            <div class="detail-box">
              <span class="box-icon">🔑</span>
              <div>
                <strong>Room Number</strong>
                <p>{{ residency()?.roomNumber }}</p>
              </div>
            </div>
            <div class="detail-box">
              <span class="box-icon">🛏️</span>
              <div>
                <strong>Assigned Bed</strong>
                <p>{{ residency()?.bedLabel }}</p>
              </div>
            </div>
            <div class="detail-box">
              <span class="box-icon">📅</span>
              <div>
                <strong>Check-In Date</strong>
                <p>{{ residency()?.checkInDate || '2024-09-01' }}</p>
              </div>
            </div>
            <div class="detail-box">
              <span class="box-icon">💳</span>
              <div>
                <strong>Annual Fee Status</strong>
                <p>{{ residency()?.annualFeeStatus }}</p>
              </div>
            </div>
          </div>

          <div class="actions-row">
            <a routerLink="/student/room-change" class="btn btn-primary">Request Room Change 🔄</a>
            <a routerLink="/student/complaints" class="btn btn-outline">Report Maintenance Issue ⚠️</a>
          </div>
        </div>
      } @else {
        <div class="empty-state">
          <span class="empty-icon">🏢</span>
          <h3>No Hostel Currently Assigned</h3>
          <p>You have not been allocated a hostel room yet for this session.</p>
          <a routerLink="/student/apply" class="btn btn-primary">Submit Hostel Application →</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .view-container { max-width: 900px; margin: 0 auto; }
    .view-header h2 { font-size: 1.5rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.25rem; }
    .subtitle { color: #CBD5E1; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .hostel-card { background: #001C3B; border: 1px solid #002D5A; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
    .hostel-hero { display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #002D5A; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
    .hero-icon { font-size: 2.5rem; }
    .hostel-hero h3 { font-size: 1.3rem; font-weight: 800; color: #FFFFFF; margin: 0; }
    .hostel-hero p { color: #CBD5E1; margin: 0.2rem 0 0 0; }
    .status-badge { margin-left: auto; padding: 0.35rem 0.85rem; border-radius: 20px; font-weight: 700; font-size: 0.8rem; }
    .status-badge.active { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.5); }
    .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .detail-box { display: flex; align-items: center; gap: 0.85rem; background: #00142A; padding: 1rem; border-radius: 12px; border: 1px solid #002D5A; }
    .box-icon { font-size: 1.5rem; }
    .detail-box strong { font-size: 0.8rem; color: #94A3B8; text-transform: uppercase; }
    .detail-box p { font-size: 1rem; font-weight: 700; color: #FFFFFF; margin: 0.1rem 0 0 0; }
    .actions-row { display: flex; gap: 1rem; }
    .btn { padding: 0.65rem 1.25rem; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.2s ease; cursor: pointer; }
    .btn-primary { background: transparent; border: 2px solid #00C7B6; color: #00C7B6; }
    .btn-primary:hover { background: #00C7B6; color: #001832; box-shadow: 0 4px 12px rgba(0, 199, 182, 0.35); }
    .btn-outline { background: transparent; border: 1px solid #00C7B6; color: #00C7B6; }
    .btn-outline:hover { background: #00C7B6; color: #001832; box-shadow: 0 4px 14px rgba(0, 199, 182, 0.4); }
    .empty-state { text-align: center; padding: 3rem; background: #001C3B; border-radius: 16px; border: 1px solid #002D5A; color: #FFFFFF; }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .loading-state { text-align: center; padding: 3rem; color: #CBD5E1; }
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
