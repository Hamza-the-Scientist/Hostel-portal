// student/views/challans-view.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-challans-view',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="view-container">
      <div class="view-header">
        <h2>Challans & Fee Receipts</h2>
        <p class="subtitle">Download and verify your application processing fee and annual hostel accommodation fee challans based on your province quota.</p>
      </div>

      <!-- Fees Structure Info Card -->
      <div class="quota-info-card">
        <div class="quota-header">
          <span class="badge-tag">Admin Fee Schedule</span>
          <h3>Annual Hostel Accommodation Fees Structure</h3>
        </div>
        <div class="quota-rates-grid">
          <div class="rate-box sindh-box">
            <span class="rate-label">Sindh Province Students</span>
            <span class="rate-amount">PKR {{ feeStructure().sindhProvinceFee | number }}</span>
          </div>
          <div class="rate-box other-box">
            <span class="rate-label">Other Provinces (Punjab, KPK, Balochistan, GB, AJK)</span>
            <span class="rate-amount">PKR {{ feeStructure().otherProvincesFee | number }}</span>
          </div>
          <div class="rate-box intl-box">
            <span class="rate-label">International Students</span>
            <span class="rate-amount">PKR {{ feeStructure().internationalStudentsFee | number }}</span>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-state">Loading your fee records...</div>
      } @else {
        <div class="challans-grid">

          <!-- Processing Fee Challan -->
          <div class="challan-card">
            <div class="card-badge info">Processing Fee</div>
            <h3>Application Processing Fee</h3>
            <div class="amount">PKR {{ feeStructure().processingFee || 100 }}</div>
            <div class="info-row"><span>Status:</span> <strong>Paid</strong></div>
            <div class="info-row"><span>Challan #:</span> <code>PF-2026-8841</code></div>
            <button class="btn btn-outline" (click)="downloadReceipt('Processing Fee')">⬇ Download Receipt</button>
          </div>

          <!-- Final Hostel Fee Challan -->
          <div class="challan-card highlight">
            <div class="card-badge primary">Annual Hostel Fee</div>
            <h3>Final Accommodation Challan</h3>
            <div class="amount">PKR {{ (assignedFee() || feeStructure().sindhProvinceFee || 25000) | number }}</div>
            <div class="info-row"><span>Quota Category:</span> <strong>{{ assignedQuota() }}</strong></div>
            <div class="info-row"><span>Status:</span> <strong>Pending Payment</strong></div>
            <div class="info-row"><span>Challan #:</span> <code>HC-2026-9012</code></div>
            <button class="btn btn-primary" (click)="downloadReceipt('Hostel Fee')">⬇ Download Final Challan</button>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    .view-container { max-width: 900px; margin: 0 auto; font-family: 'Inter', sans-serif; }
    .view-header h2 { font-size: 1.5rem; font-weight: 800; color: #013828; margin-bottom: 0.25rem; }
    .subtitle { color: #4a5568; font-size: 0.88rem; margin-bottom: 1.25rem; }
    
    .quota-info-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .badge-tag {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      background: #e8f5ef;
      color: #22543d;
      text-transform: uppercase;
    }

    .quota-header h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #013828;
      margin: 0.4rem 0 0.75rem;
    }

    .quota-rates-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .rate-box {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .rate-label { font-size: 0.75rem; font-weight: 600; color: #718096; }
    .rate-amount { font-size: 1.1rem; font-weight: 800; color: #013828; font-family: 'Consolas', monospace; }

    .sindh-box { border-left: 4px solid #015C3A; }
    .other-box { border-left: 4px solid #0284c7; }
    .intl-box { border-left: 4px solid #d97706; }

    .challans-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .challan-card { background: #FFFFFF; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.75rem; position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .challan-card.highlight { border-color: #015C3A; background: #FFFFFF; }
    .card-badge { display: inline-block; font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 12px; margin-bottom: 0.75rem; text-transform: uppercase; }
    .card-badge.info { background: rgba(1, 92, 58, 0.1); color: #015C3A; border: 1px solid rgba(1, 92, 58, 0.25); }
    .card-badge.primary { background: #D1FAE5; color: #047857; border: 1px solid #A7F3D0; }
    .challan-card h3 { font-size: 1.1rem; font-weight: 700; color: #013828; margin: 0 0 0.5rem 0; }
    .amount { font-size: 1.8rem; font-weight: 900; color: #015C3A; margin-bottom: 1rem; font-family: 'Consolas', monospace; }
    .info-row { display: flex; justify-content: space-between; font-size: 0.88rem; color: #4a5568; padding: 0.35rem 0; border-bottom: 1px dashed #e2e8f0; }
    .info-row strong { color: #013828; }
    .info-row code { color: #015C3A; background: #F4FBF7; padding: 0.1rem 0.4rem; border-radius: 4px; border: 1px solid #e2e8f0; }
    .btn { margin-top: 1.25rem; width: 100%; padding: 0.7rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s ease; font-family: inherit; }
    .btn-primary { background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #FFFFFF; }
    .btn-primary:hover { background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%); box-shadow: 0 4px 12px rgba(1, 92, 58, 0.25); }
    .btn-outline { background: transparent; border: 1.5px solid #015C3A; color: #015C3A; }
    .btn-outline:hover { background: #015C3A; color: #FFFFFF; }
    .loading-state, .empty-state { text-align: center; padding: 3rem; color: #718096; }
  `]
})
export class ChallansViewComponent implements OnInit {
  private http = inject(HttpClient);
  readonly loading = signal(true);
  readonly feeStructure = signal<any>({
    sindhProvinceFee: 25000,
    otherProvincesFee: 35000,
    internationalStudentsFee: 75000,
    processingFee: 100
  });

  readonly assignedFee = signal<number>(25000);
  readonly assignedQuota = signal<string>('Sindh Province Student');

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/api/fees/structure`).subscribe({
      next: (res) => {
        if (res) {
          this.feeStructure.set(res);
          this.assignedFee.set(res.sindhProvinceFee || 25000);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  downloadReceipt(type: string) {
    alert(`Downloading official Sindh University ${type} Challan PDF...`);
  }
}
