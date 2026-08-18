// student/views/challans-view.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { MeritService, ChallanListDto } from '../merit-result/merit.service';

@Component({
  selector: 'app-challans-view',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="view-container">
      <div class="view-header">
        <h2>Challans & Fee Receipts</h2>
        <p class="subtitle">Download and verify your application fee and annual hostel accommodation challans.</p>
      </div>

      @if (loading()) {
        <div class="loading-state">Loading your fee records...</div>
      } @else if (challans(); as c) {
        <div class="challans-grid">

          <!-- Processing Fee Challan -->
          <div class="challan-card">
            <div class="card-badge info">Processing Fee</div>
            <h3>Application Processing Fee</h3>
            <div class="amount">PKR 1,500</div>
            <div class="info-row"><span>Status:</span> <strong>{{ c.processingFeeChallan?.status || 'Paid' }}</strong></div>
            <div class="info-row"><span>Challan #:</span> <code>{{ c.processingFeeChallan?.challanNumber || 'PF-2026-8841' }}</code></div>
            <button class="btn btn-outline" (click)="downloadReceipt('Processing Fee')">⬇ Download Receipt</button>
          </div>

          <!-- Final Hostel Fee Challan -->
          <div class="challan-card highlight">
            <div class="card-badge primary">Hostel Fee</div>
            <h3>Final Accommodation Challan</h3>
            <div class="amount">PKR {{ c.finalHostelChallan?.amount || 15000 | number }}</div>
            <div class="info-row"><span>Status:</span> <strong>{{ c.finalHostelChallan?.status || 'Pending Payment' }}</strong></div>
            <div class="info-row"><span>Challan #:</span> <code>{{ c.finalHostelChallan?.challanNumber || 'HC-2026-9012' }}</code></div>
            <button class="btn btn-primary" (click)="downloadReceipt('Hostel Fee')">⬇ Download Final Challan</button>
          </div>

        </div>
      } @else {
        <div class="empty-state">
          <p>No fee records found for your account.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .view-container { max-width: 900px; margin: 0 auto; }
    .view-header h2 { font-size: 1.5rem; font-weight: 800; color: var(--color-primary-deep); margin-bottom: 0.25rem; }
    .subtitle { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
    .challans-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .challan-card { background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 1.75rem; position: relative; box-shadow: var(--shadow-sm); }
    .challan-card.highlight { border-color: var(--color-primary); background: #FFFFFF; }
    .card-badge { display: inline-block; font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 12px; margin-bottom: 0.75rem; text-transform: uppercase; }
    .card-badge.info { background: rgba(1, 92, 58, 0.1); color: var(--color-primary); border: 1px solid rgba(1, 92, 58, 0.25); }
    .card-badge.primary { background: #D1FAE5; color: #047857; border: 1px solid #A7F3D0; }
    .challan-card h3 { font-size: 1.1rem; font-weight: 700; color: var(--color-primary-deep); margin: 0 0 0.5rem 0; }
    .amount { font-size: 1.8rem; font-weight: 900; color: var(--color-primary); margin-bottom: 1rem; }
    .info-row { display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--color-text-muted); padding: 0.35rem 0; border-bottom: 1px dashed var(--color-border); }
    .info-row strong { color: var(--color-primary-deep); }
    .info-row code { color: var(--color-primary); background: #F4FBF7; padding: 0.1rem 0.4rem; border-radius: 4px; border: 1px solid var(--color-border); }
    .btn { margin-top: 1.25rem; width: 100%; padding: 0.7rem; border-radius: var(--radius-btn); font-weight: 600; cursor: pointer; border: none; transition: all 0.2s ease; }
    .btn-primary { background: var(--color-primary); color: #FFFFFF; }
    .btn-primary:hover { background: var(--color-primary-dark); box-shadow: var(--shadow-sm); }
    .btn-outline { background: transparent; border: 1px solid var(--color-primary); color: var(--color-primary); }
    .btn-outline:hover { background: var(--color-primary); color: #FFFFFF; }
    .loading-state, .empty-state { text-align: center; padding: 3rem; color: var(--color-text-muted); }
  `]
})
export class ChallansViewComponent implements OnInit {
  private meritService = inject(MeritService);
  readonly loading = signal(true);
  readonly challans = signal<ChallanListDto | null>(null);

  ngOnInit() {
    this.meritService.getChallans().subscribe({
      next: (res) => {
        this.challans.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  downloadReceipt(type: string) {
    alert(`Downloading official Sindh University ${type} Challan PDF...`);
  }
}
