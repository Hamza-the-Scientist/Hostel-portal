
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MeritService, MeritResultDto, ChallanListDto } from './merit.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-merit-result',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './merit-result.component.html',
  styleUrl: './merit-result.component.css'
})
export class MeritResultComponent implements OnInit {
  loading  = signal(true);
  error    = signal<string | null>(null);
  result   = signal<MeritResultDto | null>(null);
  challans = signal<ChallanListDto | null>(null);

  constructor(private meritService: MeritService) {}

  ngOnInit() {
    forkJoin({
      merit:    this.meritService.getMeritResult(),
      challans: this.meritService.getChallans()
    }).subscribe({
      next: ({ merit, challans }) => {
        this.result.set(merit);
        this.challans.set(challans);
        this.loading.set(false);
      },
      error: (err) => {
        // Graceful fallback: load individual endpoint
        this.meritService.getMeritResult().subscribe({
          next:  (r) => { this.result.set(r); this.loading.set(false); },
          error: () => {
            this.error.set('Unable to load merit result. Please try again later.');
            this.loading.set(false);
          }
        });
      }
    });
  }

  get statusConfig() {
    const s = this.result()?.allocationStatus ?? 'Pending';
    const configs: Record<string, { label: string; cls: string; icon: string }> = {
      'Pending':   { label: 'Under Processing', cls: 'badge-pending',   icon: '' },
      'Allocated': { label: 'Room Allocated',   cls: 'badge-allocated', icon: '' },
      'Waitlisted':{ label: 'Waitlisted',        cls: 'badge-wait',      icon: '' },
      'Rejected':  { label: 'Not Allocated',    cls: 'badge-rejected',  icon: '' }
    };
    return configs[s] ?? configs['Pending'];
  }

  get rankPercentile(): number {
    const r = this.result();
    if (!r || !r.meritRank || !r.totalApplicants) return 0;
    return Math.max(0, Math.round((1 - (r.meritRank - 1) / r.totalApplicants) * 100));
  }

  get hasFinalChallan(): boolean {
    return !!(this.challans()?.finalHostelChallan || this.result()?.finalChallan);
  }

  get finalChallan() {
    return this.challans()?.finalHostelChallan ?? this.result()?.finalChallan ?? null;
  }

  downloadChallan() {
    const challan = this.finalChallan;
    if (!challan) return;

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Final Hostel Challan — ${challan.challanNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #1a1a2e; }
          .header { text-align: center; border-bottom: 2px solid #4361ee; padding-bottom: 16px; }
          .logo { font-size: 22px; font-weight: 800; color: #4361ee; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e0e0e0; }
          .label { color: #666; font-size: 13px; }
          .value { font-weight: 600; }
          .amount { font-size: 28px; font-weight: 800; color: #4361ee; text-align: center; padding: 20px 0; }
          .footer { margin-top: 24px; font-size: 12px; color: #888; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">University of Sindh Hostel Portal</div>
          <p>Final Hostel Accommodation Challan</p>
        </div>
        <div class="amount">PKR ${challan.amount.toLocaleString()}</div>
        <div class="row"><span class="label">Challan Number</span><span class="value">${challan.challanNumber}</span></div>
        <div class="row"><span class="label">Hostel</span><span class="value">${challan.allocatedHostel ?? 'N/A'}</span></div>
        <div class="row"><span class="label">Room</span><span class="value">${challan.allocatedRoom ?? 'N/A'}</span></div>
        <div class="row"><span class="label">Bed</span><span class="value">${challan.allocatedBed ?? 'N/A'}</span></div>
        <div class="row"><span class="label">Status</span><span class="value">${challan.status}</span></div>
        <div class="row"><span class="label">Generated On</span><span class="value">${new Date(challan.generatedAt).toLocaleDateString()}</span></div>
        <div class="row"><span class="label">Due Date</span><span class="value">${new Date(challan.expiresAt).toLocaleDateString()}</span></div>
        <div class="footer">Pay at any HBL branch or via university online payment portal. Keep this receipt after payment.</div>
      </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `FinalChallan-${challan.challanNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
