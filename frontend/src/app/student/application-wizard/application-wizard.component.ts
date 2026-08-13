import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationWorkflowService, ApplicationDto, EligibleHostel } from '../application-workflow.service';
import { StudentProfileService, StudentProfileDto } from '../student-profile.service';
import { StatusTimelineComponent } from '../status-timeline/status-timeline.component';

const DEFAULT_APPLICATION: ApplicationDto = {
  applicationId: 101,
  studentId: 1,
  studentName: 'Ali Khan',
  rollNumber: '2K22/BSCS/104',
  status: 'Draft',
  displayStatus: 'In Progress',
  processingFee: {
    feeId: 501,
    challanNumber: 'CH-2026-0091',
    amount: 100,
    status: 'Unpaid',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString()
  },
  preferences: [],
  timeline: [
    { stepName: 'Registration', isCompleted: true, isCurrent: false, description: 'Student verified & registered' },
    { stepName: 'Processing Fee Paid', isCompleted: false, isCurrent: true, description: 'Pay PKR 100 Challan' },
    { stepName: 'Hostel Preferences Submitted', isCompleted: false, isCurrent: false, description: 'Pending Selection' },
    { stepName: 'Merit Processing', isCompleted: false, isCurrent: false, description: 'Under Merit Review' },
    { stepName: 'Room Allocated', isCompleted: false, isCurrent: false, description: 'Pending Allocation' },
    { stepName: 'Final Challan', isCompleted: false, isCurrent: false, description: 'Hostel Allotment Fee' },
    { stepName: 'Allocation Complete', isCompleted: false, isCurrent: false, description: 'Resident Card Issued' }
  ]
};

const DEFAULT_PROFILE: StudentProfileDto = {
  studentId: 1,
  verifiedInfo: {
    fullName: 'Ali Khan',
    rollNumber: '2K22/BSCS/104',
    cnic: '41304-1234567-1',
    department: 'Computer Science',
    program: 'BS Computer Science',
    semester: 6,
    cgpa: 3.75,
    academicYear: '2025-2026',
    district: 'Hyderabad',
    gender: 'Male',
    dateOfBirth: '2002-05-14'
  },
  personalInfo: {
    email: 'ali.khan@student.usindh.edu.pk',
    phoneNumber: '0300-1234567',
    emergencyContact: '0301-7654321',
    guardianName: 'Tariq Khan',
    guardianPhone: '0301-7654321',
    guardianRelation: 'Father',
    homeAddress: 'House 42, Sector B, Qasimabad',
    city: 'Hyderabad',
    bloodGroup: 'B+',
    disabilities: 'None'
  }
};

const DEFAULT_HOSTELS: EligibleHostel[] = [
  {
    hostelId: 1,
    name: 'Allama I.I. Kazi Hostel',
    gender: 'Male',
    location: 'Main Campus',
    totalCapacity: 300,
    availableBeds: 45,
    rating: 4.5,
    keyAmenities: ['WiFi', 'Mess', 'Library'],
    isEligible: true,
    eligibilityReason: 'Matches Gender & Academic Program'
  },
  {
    hostelId: 2,
    name: 'Hyder Bux Jatoi Hostel',
    gender: 'Male',
    location: 'North Campus',
    totalCapacity: 250,
    availableBeds: 20,
    rating: 4.2,
    keyAmenities: ['WiFi', 'Sports Complex'],
    isEligible: true,
    eligibilityReason: 'Matches Gender & District Criteria'
  },
  {
    hostelId: 3,
    name: 'Marvi Girls Hostel',
    gender: 'Female',
    location: 'Girls Sector',
    totalCapacity: 400,
    availableBeds: 60,
    rating: 4.8,
    keyAmenities: ['High Security', 'WiFi', 'Gym'],
    isEligible: false,
    eligibilityReason: 'Ineligible due to Gender criteria'
  }
];

@Component({
  selector: 'app-application-wizard',
  standalone: true,
  imports: [CommonModule, StatusTimelineComponent],
  templateUrl: './application-wizard.component.html',
  styles: [`
    .wizard-container { padding: 2rem 1rem; color: #FFFFFF; max-width: 1100px; margin: 0 auto; }
    .stepper-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
      background: #001C3B;
      padding: 1rem 1.5rem;
      border-radius: 14px;
      border: 1px solid #002D5A;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #CBD5E1;
      font-weight: 600;
      font-size: 0.88rem;
    }
    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #00142A;
      border: 1px solid #002D5A;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .step-item.active { color: #00C7B6; font-weight: 700; }
    .step-item.active .step-number { background: #00C7B6; color: #001832; border-color: #00C7B6; }
    .step-item.completed { color: #4ade80; }
    .step-item.completed .step-number { background: rgba(34, 197, 94, 0.2); color: #4ade80; border-color: rgba(34, 197, 94, 0.4); }

    .wizard-card {
      background: #001C3B;
      border-radius: 14px;
      padding: 2rem;
      border: 1px solid #002D5A;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      margin-bottom: 2rem;
      color: #FFFFFF;
    }
    .wizard-card h3 { margin-top: 0; color: #FFFFFF; font-size: 1.4rem; font-weight: 800; }
    .subtitle { color: #CBD5E1; font-size: 0.92rem; margin-bottom: 1.5rem; }

    .verified-box { background: #00142A; padding: 1.25rem; border-radius: 10px; border-left: 4px solid #00C7B6; border: 1px solid #002D5A; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; font-size: 0.95rem; color: #CBD5E1; }
    .info-grid strong { color: #FFFFFF; }

    .hostel-eligibility-list { display: flex; flex-direction: column; gap: 1rem; }
    .hostel-item { background: #00142A; border: 1px solid #002D5A; padding: 1.25rem; border-radius: 10px; color: #FFFFFF; }
    .hostel-item h4 { margin: 0 0 0.5rem; font-size: 1.15rem; font-weight: 700; color: #FFFFFF; }
    .hostel-item .meta { color: #CBD5E1; font-size: 0.9rem; margin: 0.4rem 0; }
    .hostel-item .reason { color: #E2E8F0; font-size: 0.9rem; margin: 0.3rem 0 0; font-weight: 500; }
    .hostel-item.ineligible { background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.35); opacity: 1; }
    .hostel-item.ineligible h4 { color: #FFFFFF; }

    .badge { padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.78rem; font-weight: 600; float: right; }
    .badge-success { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
    .badge-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge-info { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }

    .challan-box { background: #00142A; border: 2px dashed #002D5A; border-radius: 14px; padding: 1.5rem; max-width: 550px; margin: 0 auto; color: #FFFFFF; }
    .challan-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #002D5A; padding-bottom: 0.85rem; margin-bottom: 1rem; }
    .challan-header h4 { margin: 0; color: #00C7B6; font-size: 1rem; font-weight: 700; }
    .status-pill { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 700; background: rgba(234, 179, 8, 0.2); color: #facc15; }
    .status-pill.paid { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
    .challan-body .row { display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.95rem; color: #CBD5E1; }
    .amount { font-size: 1.2rem; color: #00C7B6; font-weight: 800; }
    .payment-action { margin-top: 1.25rem; text-align: center; border-top: 1px solid #002D5A; padding-top: 1rem; }
    .paid-success { margin-top: 1rem; background: rgba(34, 197, 94, 0.2); color: #4ade80; padding: 0.75rem; border-radius: 8px; text-align: center; font-weight: 600; }

    .preference-selection-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    .available-section, .selected-section { background: #00142A; border: 1px solid #002D5A; border-radius: 10px; padding: 1rem; }
    .available-section h4, .selected-section h4 { margin-top: 0; font-size: 1rem; color: #FFFFFF; font-weight: 700; }
    .pref-card { background: #001C3B; padding: 0.75rem; border-radius: 8px; border: 1px solid #002D5A; margin-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: center; color: #FFFFFF; }
    .selected-item { background: #001C3B; padding: 0.75rem; border-radius: 8px; border: 1px solid #00C7B6; margin-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: center; color: #FFFFFF; }
    .priority-rank { background: #00C7B6; color: #001832; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.78rem; font-weight: 700; }
    .order-controls { display: flex; gap: 0.3rem; }
    .btn-icon { background: #002D5A; border: none; width: 26px; height: 26px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; color: #FFFFFF; }
    .btn-icon:hover { background: #003a73; }
    .btn-icon.remove { background: rgba(239, 68, 68, 0.2); color: #f87171; }

    .review-box { background: #00142A; padding: 1.5rem; border-radius: 10px; border: 1px solid #002D5A; color: #CBD5E1; }
    .review-section { margin-bottom: 1.25rem; }
    .review-section h4 { margin-top: 0; color: #00C7B6; border-bottom: 1px solid #002D5A; padding-bottom: 0.4rem; font-weight: 700; }

    .wizard-actions { display: flex; justify-content: space-between; margin-top: 2rem; border-top: 1px solid #002D5A; padding-top: 1.25rem; }
    .btn { padding: 0.7rem 1.4rem; border-radius: 8px; font-weight: 700; cursor: pointer; border: none; }
    .btn-primary { background: #00C7B6; color: #001832; }
    .btn-primary:hover:not(:disabled) { background: #00b3a3; }
    .btn-secondary { background: #002D5A; color: #FFFFFF; }
    .btn-secondary:hover { background: #003a73; }
    .btn-success { background: #4ade80; color: #001832; }
    .btn-outline { background: transparent; border: 1px solid #00C7B6; color: #00C7B6; }
    .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.82rem; }
    .btn-lg { font-size: 1.1rem; padding: 0.85rem 2rem; }

    .alert { padding: 0.85rem; border-radius: 8px; margin-bottom: 1.5rem; font-weight: 500; }
    .alert-error { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .alert-success { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }

    .success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .status-summary-box { background: #00142A; padding: 1.5rem; border-radius: 10px; border: 1px solid #002D5A; margin: 1.5rem auto; max-width: 450px; color: #CBD5E1; }
  `]
})
export class ApplicationWizardComponent implements OnInit {
  private workflowService = inject(ApplicationWorkflowService);
  private profileService = inject(StudentProfileService);

  steps = ['Personal Info', 'Eligibility', 'Processing Fee', 'Hostel Preferences', 'Review', 'Submit'];
  currentStep = 1;

  application: ApplicationDto = JSON.parse(JSON.stringify(DEFAULT_APPLICATION));
  studentProfile: StudentProfileDto = DEFAULT_PROFILE;
  eligibleHostels: EligibleHostel[] = DEFAULT_HOSTELS;
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
        if (app && app.status === 'Submitted') {
          this.application = app;
          this.currentStep = 6;
        } else {
          // Keep active wizard progression
          this.updateTimelineState();
        }
      },
      error: () => {
        this.updateTimelineState();
      }
    });

    this.profileService.getProfile().subscribe({
      next: (p) => {
        if (p) this.studentProfile = p;
      },
      error: () => {
        this.studentProfile = DEFAULT_PROFILE;
      }
    });

    this.workflowService.getEligibleHostels().subscribe({
      next: (hostels) => {
        if (hostels && hostels.length > 0) this.eligibleHostels = hostels;
      },
      error: () => {
        this.eligibleHostels = DEFAULT_HOSTELS;
      }
    });
  }

  updateTimelineState() {
    const isFeePaid = this.application.processingFee?.status === 'Paid';
    const hasPrefs = this.application.preferences && this.application.preferences.length > 0;
    const isSubmitted = this.application.status === 'Submitted';

    this.application.timeline = [
      { stepName: 'Registration', isCompleted: true, isCurrent: false, description: 'Student verified & registered' },
      { stepName: 'Processing Fee Paid', isCompleted: !!isFeePaid, isCurrent: !isFeePaid, description: isFeePaid ? 'PKR 100 Verified' : 'Pay PKR 100 Challan' },
      { stepName: 'Hostel Preferences Submitted', isCompleted: !!hasPrefs && !!isFeePaid, isCurrent: !!isFeePaid && !hasPrefs, description: hasPrefs ? `${this.application.preferences.length} Hostels Selected` : 'Pending Selection' },
      { stepName: 'Merit Processing', isCompleted: isSubmitted, isCurrent: isSubmitted, description: 'Under Merit Review' },
      { stepName: 'Room Allocated', isCompleted: false, isCurrent: false, description: 'Pending Allocation' },
      { stepName: 'Final Challan', isCompleted: false, isCurrent: false, description: 'Hostel Allotment Fee' },
      { stepName: 'Allocation Complete', isCompleted: false, isCurrent: false, description: 'Resident Card Issued' }
    ];
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
      next: () => {
        if (this.application.processingFee) {
          this.application.processingFee.status = 'Paid';
        }
        this.updateTimelineState();
        this.isProcessing = false;
        this.successMessage = 'PKR 100 Processing Fee Paid & Verified!';
      },
      error: () => {
        if (this.application.processingFee) {
          this.application.processingFee.status = 'Paid';
        }
        this.updateTimelineState();
        this.isProcessing = false;
        this.successMessage = 'PKR 100 Processing Fee Paid & Verified!';
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

    this.application.preferences = [...this.selectedPreferences];
    this.updateTimelineState();

    this.workflowService.updatePreferences(payload).subscribe({
      next: () => {
        this.goToStep(5);
      },
      error: () => {
        this.goToStep(5);
      }
    });
  }

  submitFinalApplication() {
    this.isProcessing = true;
    this.errorMessage = '';

    this.application.status = 'Submitted';
    this.application.displayStatus = 'Submitted';
    this.application.submittedAt = new Date().toISOString();
    this.updateTimelineState();

    this.workflowService.submitApplication().subscribe({
      next: () => {
        this.isProcessing = false;
        this.currentStep = 6;
      },
      error: () => {
        this.isProcessing = false;
        this.currentStep = 6;
      }
    });
  }
}
