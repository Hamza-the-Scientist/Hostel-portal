// student/dashboard/resident-dashboard/resident-dashboard.component.ts
import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ResidencyService, StudentResidencyDto, ProcessingFeeChallan, VerifyPaymentRequest } from '../../residency.service';

@Component({
  selector: 'app-resident-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './resident-dashboard.component.html',
  styleUrl: './resident-dashboard.component.css',
})
export class ResidentDashboardComponent {
  @Input({ required: true }) residency!: StudentResidencyDto;
  @Output() residencyChange = new EventEmitter<StudentResidencyDto>();

  private residencyService = inject(ResidencyService);

  // Challan generation state
  readonly challanLoading = signal(false);

  // Payment modal state
  readonly showPaymentModal = signal(false);
  readonly activeChallan = signal<ProcessingFeeChallan | null>(null);
  readonly paymentLoading = signal(false);
  readonly paymentError = signal<string | null>(null);

  paymentForm = {
    transactionReference: '',
    paymentMethod: 'Bank Transfer',
  };

  generateChallan(): void {
    this.challanLoading.set(true);
    this.residencyService.generateAnnualChallan().subscribe({
      next: (challan) => {
        this.residency = {
          ...this.residency,
          annualFeeStatus: 'Pending',
          annualChallan: challan,
        };
        this.residencyChange.emit(this.residency);
        this.challanLoading.set(false);
      },
      error: () => {
        this.challanLoading.set(false);
      },
    });
  }

  openPaymentModal(challan: ProcessingFeeChallan): void {
    this.activeChallan.set(challan);
    this.paymentForm = { transactionReference: '', paymentMethod: 'Bank Transfer' };
    this.paymentError.set(null);
    this.showPaymentModal.set(true);
  }

  closePaymentModal(): void {
    this.showPaymentModal.set(false);
    this.activeChallan.set(null);
  }

  submitPayment(): void {
    if (!this.paymentForm.transactionReference.trim()) {
      this.paymentError.set('Transaction reference is required.');
      return;
    }

    const challan = this.activeChallan();
    if (!challan) return;

    const request: VerifyPaymentRequest = {
      feeId: challan.feeId,
      transactionReference: this.paymentForm.transactionReference,
      paymentMethod: this.paymentForm.paymentMethod,
    };

    this.paymentLoading.set(true);
    this.paymentError.set(null);

    this.residencyService.verifyAnnualFee(request).subscribe({
      next: (updated) => {
        this.residency = updated;
        this.residencyChange.emit(updated);
        this.paymentLoading.set(false);
        this.closePaymentModal();
      },
      error: (err) => {
        this.paymentError.set(err?.error?.message ?? 'Verification failed. Please try again.');
        this.paymentLoading.set(false);
      },
    });
  }

  formatDate(dateStr?: string | null): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  isPastDue(dateStr?: string): boolean {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  }

  getFeeStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid': return 'fee-status fee-status--paid';
      case 'pending': return 'fee-status fee-status--pending';
      case 'unpaid': return 'fee-status fee-status--unpaid';
      default: return 'fee-status';
    }
  }
}
