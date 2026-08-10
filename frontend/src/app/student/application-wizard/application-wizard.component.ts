import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationWorkflowService, ApplicationDto, EligibleHostel } from '../application-workflow.service';
import { StudentProfileService, StudentProfileDto } from '../student-profile.service';
import { StatusTimelineComponent } from '../status-timeline/status-timeline.component';

@Component({
  selector: 'app-application-wizard',
  standalone: true,
  imports: [CommonModule, StatusTimelineComponent],
  templateUrl: './application-wizard.component.html',
  styles: [`
    .wizard-container { padding: 2rem 1rem; }
    .stepper-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #888;
      font-weight: 500;
      font-size: 0.88rem;
    }
    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .step-item.active { color: #015C3A; font-weight: 700; }
    .step-item.active .step-number { background: #015C3A; color: white; }
    .step-item.completed { color: #2e7d32; }
    .step-item.completed .step-number { background: #e8f5e9; color: #2e7d32; }

    .wizard-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #e0e0e0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      margin-bottom: 2rem;
    }
    .wizard-card h3 { margin-top: 0; color: #015C3A; font-size: 1.4rem; }
    .subtitle { color: #666; font-size: 0.92rem; margin-bottom: 1.5rem; }

    .verified-box { background: #f9f9f9; padding: 1.25rem; border-radius: 8px; border-left: 4px solid #015C3A; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; font-size: 0.95rem; }

    .hostel-eligibility-list { display: flex; flex-direction: column; gap: 1rem; }
    .hostel-item { background: #f9f9f9; border: 1px solid #e0e0e0; padding: 1.25rem; border-radius: 8px; }
    .hostel-item.ineligible { background: #fff5f5; border-color: #ffcdd2; opacity: 0.85; }
    .badge { padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.78rem; font-weight: 600; float: right; }
    .badge-success { background: #e8f5e9; color: #2e7d32; }
    .badge-danger { background: #ffebee; color: #c62828; }
    .badge-info { background: #e3f2fd; color: #0288d1; }

    .challan-box { background: #fffde7; border: 2px dashed #fbc02d; border-radius: 12px; padding: 1.5rem; max-width: 550px; margin: 0 auto; }
    .challan-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #fff59d; padding-bottom: 0.85rem; margin-bottom: 1rem; }
    .challan-header h4 { margin: 0; color: #f57f17; font-size: 1rem; }
    .status-pill { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 700; background: #fff9c4; color: #f57f17; }
    .status-pill.paid { background: #e8f5e9; color: #2e7d32; }
    .challan-body .row { display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.95rem; }
    .amount { font-size: 1.2rem; color: #015C3A; }
    .payment-action { margin-top: 1.25rem; text-align: center; border-top: 1px solid #fff59d; padding-top: 1rem; }
    .paid-success { margin-top: 1rem; background: #e8f5e9; color: #2e7d32; padding: 0.75rem; border-radius: 6px; text-align: center; font-weight: 600; }

    .preference-selection-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    .available-section, .selected-section { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; }
    .available-section h4, .selected-section h4 { margin-top: 0; font-size: 1rem; color: #333; }
    .pref-card { background: white; padding: 0.75rem; border-radius: 6px; border: 1px solid #ddd; margin-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: center; }
    .selected-item { background: white; padding: 0.75rem; border-radius: 6px; border: 1px solid #015C3A; margin-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: center; }
    .priority-rank { background: #015C3A; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.78rem; font-weight: 700; }
    .order-controls { display: flex; gap: 0.3rem; }
    .btn-icon { background: #eee; border: none; width: 26px; height: 26px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; }
    .btn-icon:hover { background: #ddd; }
    .btn-icon.remove { background: #ffebee; color: #c62828; }

    .review-box { background: #f9f9f9; padding: 1.5rem; border-radius: 8px; border: 1px solid #e0e0e0; }
    .review-section { margin-bottom: 1.25rem; }
    .review-section h4 { margin-top: 0; color: #015C3A; border-bottom: 1px solid #ddd; padding-bottom: 0.4rem; }

    .wizard-actions { display: flex; justify-content: space-between; margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1.25rem; }
    .btn { padding: 0.7rem 1.4rem; border-radius: 6px; font-weight: 600; cursor: pointer; border: none; }
    .btn-primary { background: #015C3A; color: white; }
    .btn-secondary { background: #eee; color: #333; }
    .btn-success { background: #2e7d32; color: white; }
    .btn-outline { background: transparent; border: 1px solid #015C3A; color: #015C3A; }
    .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.82rem; }
    .btn-lg { font-size: 1.1rem; padding: 0.85rem 2rem; }

    .alert { padding: 0.85rem; border-radius: 6px; margin-bottom: 1.5rem; font-weight: 500; }
    .alert-error { background: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }
    .alert-success { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }

    .success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .status-summary-box { background: #f0f4f2; padding: 1.5rem; border-radius: 8px; margin: 1.5rem auto; max-width: 450px; }
  `]
})
export class ApplicationWizardComponent implements OnInit {
  private workflowService = inject(ApplicationWorkflowService);
  private profileService = inject(StudentProfileService);

  steps = ['Personal Info', 'Eligibility', 'Processing Fee', 'Hostel Preferences', 'Review', 'Submit'];
  currentStep = 1;

  application: ApplicationDto | null = null;
  studentProfile: StudentProfileDto | null = null;
  eligibleHostels: EligibleHostel[] = [];
  selectedPreferences: EligibleHostel[] = [];

  errorMessage = '';
  successMessage = '';
  isProcessing = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.workflowService.getActiveApplication().subscribe({
      next: (app) => {
        this.application = app;
        this.syncStepWithStatus();
      }
    });

    this.profileService.getProfile().subscribe({
      next: (p) => this.studentProfile = p
    });

    this.workflowService.getEligibleHostels().subscribe({
      next: (hostels) => this.eligibleHostels = hostels
    });
  }

  syncStepWithStatus() {
    if (!this.application) return;
    if (this.application.status === 'Submitted') {
      this.currentStep = 6;
    } else if (this.application.processingFee?.status === 'Paid' && this.application.preferences.length > 0) {
      this.currentStep = 5;
    } else if (this.application.processingFee?.status === 'Paid') {
      this.currentStep = 4;
    }
  }

  goToStep(step: number) {
    this.errorMessage = '';
    this.successMessage = '';
    this.currentStep = step;

    if (step === 3 && !this.application?.processingFee) {
      this.generateChallan();
    }
  }

  generateChallan() {
    this.workflowService.generateProcessingFee().subscribe({
      next: (challan) => {
        if (this.application) {
          this.application.processingFee = challan;
        }
      }
    });
  }

  payProcessingFee() {
    if (!this.application?.processingFee) return;

    this.isProcessing = true;
    this.workflowService.verifyPayment({
      feeId: this.application.processingFee.feeId,
      transactionReference: `MOCK-TXN-${Date.now()}`,
      paymentMethod: 'Online Banking'
    }).subscribe({
      next: (updatedApp) => {
        this.application = updatedApp;
        this.isProcessing = false;
        this.successMessage = 'PKR 100 Processing Fee Paid & Verified!';
      },
      error: () => {
        this.errorMessage = 'Failed to verify payment.';
        this.isProcessing = false;
      }
    });
  }

  isAlreadySelected(hostelId: number): boolean {
    return this.selectedPreferences.some(p => p.hostelId === hostelId);
  }

  addPreference(hostel: EligibleHostel) {
    if (!this.isAlreadySelected(hostel.hostelId)) {
      this.selectedPreferences.push(hostel);
    }
  }

  removePreference(index: number) {
    this.selectedPreferences.splice(index, 1);
  }

  moveUp(index: number) {
    if (index > 0) {
      const temp = this.selectedPreferences[index];
      this.selectedPreferences[index] = this.selectedPreferences[index - 1];
      this.selectedPreferences[index - 1] = temp;
    }
  }

  moveDown(index: number) {
    if (index < this.selectedPreferences.length - 1) {
      const temp = this.selectedPreferences[index];
      this.selectedPreferences[index] = this.selectedPreferences[index + 1];
      this.selectedPreferences[index + 1] = temp;
    }
  }

  savePreferences() {
    if (!this.application) return;

    const payload = {
      applicationId: this.application.applicationId,
      preferences: this.selectedPreferences.map((h, i) => ({
        hostelId: h.hostelId,
        priorityOrder: i + 1
      }))
    };

    this.workflowService.updatePreferences(payload).subscribe({
      next: (updatedApp) => {
        this.application = updatedApp;
        this.goToStep(5);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to save preferences.';
      }
    });
  }

  submitFinalApplication() {
    this.isProcessing = true;
    this.workflowService.submitApplication().subscribe({
      next: (app) => {
        this.application = app;
        this.isProcessing = false;
        this.currentStep = 6;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to submit application.';
        this.isProcessing = false;
      }
    });
  }
}
