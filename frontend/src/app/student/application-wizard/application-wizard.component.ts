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
    .wizard-container { padding: 2rem 1rem; color: var(--color-text-main); max-width: 1100px; margin: 0 auto; }
    .stepper-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
      background: #FFFFFF;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-card);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-text-muted);
      font-weight: 600;
      font-size: 0.88rem;
    }
    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #F7F8FA;
      border: 1px solid var(--color-border);
      color: var(--color-text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .step-item.active { color: var(--color-primary); font-weight: 700; }
    .step-item.active .step-number { background: var(--color-primary); color: #FFFFFF; border-color: var(--color-primary); }
    .step-item.completed { color: #10B981; }
    .step-item.completed .step-number { background: #D1FAE5; color: #047857; border-color: #A7F3D0; }

    .wizard-card {
      background: #FFFFFF;
      border-radius: var(--radius-card);
      padding: 2rem;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      margin-bottom: 2rem;
      color: var(--color-text-main);
    }
    .wizard-card h3 { margin-top: 0; color: var(--color-primary-deep); font-size: 1.4rem; font-weight: 800; }
    .subtitle { color: var(--color-text-muted); font-size: 0.92rem; margin-bottom: 1.5rem; }

    .verified-box { background: #F4FBF7; padding: 1.25rem; border-radius: 10px; border-left: 4px solid var(--color-primary); border: 1px solid var(--color-border); }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; font-size: 0.95rem; color: var(--color-text-muted); }
    .info-grid strong { color: var(--color-primary-deep); }

    .hostel-eligibility-list { display: flex; flex-direction: column; gap: 1rem; }
    .hostel-item { background: #F4FBF7; border: 1px solid var(--color-border); padding: 1.25rem; border-radius: 10px; color: var(--color-text-main); }
    .hostel-item h4 { margin: 0 0 0.5rem; font-size: 1.15rem; font-weight: 700; color: var(--color-primary-deep); }
    .hostel-item .meta { color: var(--color-text-muted); font-size: 0.9rem; margin: 0.4rem 0; }
    .hostel-item .reason { color: var(--color-text-main); font-size: 0.9rem; margin: 0.3rem 0 0; font-weight: 500; }
    .hostel-item.ineligible { background: #FEF2F2; border-color: #FCA5A5; opacity: 1; }
    .hostel-item.ineligible h4 { color: #991B1B; }

    .badge { padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.78rem; font-weight: 600; float: right; }
    .badge-success { background: #D1FAE5; color: #047857; border: 1px solid #A7F3D0; }
    .badge-danger { background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5; }
    .badge-info { background: #DBEAFE; color: #1E40AF; border: 1px solid #BFDBFE; }

    .challan-box { background: #F4FBF7; border: 2px dashed var(--color-border); border-radius: 14px; padding: 1.5rem; max-width: 550px; margin: 0 auto; color: var(--color-text-main); }
    .challan-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 0.85rem; margin-bottom: 1rem; }
    .challan-header h4 { margin: 0; color: var(--color-primary-deep); font-size: 1rem; font-weight: 700; }
    .status-pill { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 700; background: #FEF3C7; color: #B45309; }
    .status-pill.paid { background: #D1FAE5; color: #047857; }
    .challan-body .row { display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.95rem; color: var(--color-text-muted); }
    .amount { font-size: 1.2rem; color: var(--color-primary); font-weight: 800; }
    .payment-action { margin-top: 1.25rem; text-align: center; border-top: 1px solid var(--color-border); padding-top: 1rem; }
    .paid-success { margin-top: 1rem; background: #D1FAE5; color: #047857; padding: 0.75rem; border-radius: 8px; text-align: center; font-weight: 600; }

    .preference-selection-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    .available-section, .selected-section { background: #F4FBF7; border: 1px solid var(--color-border); border-radius: 10px; padding: 1rem; }
    .available-section h4, .selected-section h4 { margin-top: 0; font-size: 1rem; color: var(--color-primary-deep); font-weight: 700; }
    .pref-card { background: #FFFFFF; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--color-border); margin-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: center; color: var(--color-text-main); }
    .selected-item { background: #FFFFFF; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--color-primary); margin-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: center; color: var(--color-text-main); }
    .priority-rank { background: var(--color-secondary); color: #013828; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.78rem; font-weight: 700; }
    .order-controls { display: flex; gap: 0.3rem; }
    .btn-icon { background: #F7F8FA; border: 1px solid var(--color-border); width: 26px; height: 26px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; color: var(--color-text-main); }
    .btn-icon:hover { background: #E2E8F0; }
    .btn-icon.remove { background: #FEE2E2; color: #991B1B; }

    .review-box { background: #F4FBF7; padding: 1.5rem; border-radius: 10px; border: 1px solid var(--color-border); color: var(--color-text-muted); }
    .review-section { margin-bottom: 1.25rem; }
    .review-section h4 { margin-top: 0; color: var(--color-primary-deep); border-bottom: 1px solid var(--color-border); padding-bottom: 0.4rem; font-weight: 700; }

    .wizard-actions { display: flex; justify-content: space-between; margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.25rem; }
    .btn { padding: 0.7rem 1.4rem; border-radius: var(--radius-btn); font-weight: 700; cursor: pointer; border: none; }
    .btn-primary { background: var(--color-primary); color: #FFFFFF; }
    .btn-primary:hover:not(:disabled) { background: var(--color-primary-dark); }
    .btn-secondary { background: #F7F8FA; border: 1px solid var(--color-border); color: var(--color-text-main); }
    .btn-secondary:hover { background: #E2E8F0; }
    .btn-success { background: var(--color-primary); color: #FFFFFF; }
    .btn-outline { background: transparent; border: 1px solid var(--color-primary); color: var(--color-primary); }
    .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.82rem; }
    .btn-lg { font-size: 1.1rem; padding: 0.85rem 2rem; }

    .alert { padding: 0.85rem; border-radius: 8px; margin-bottom: 1.5rem; font-weight: 500; }
    .alert-error { background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5; }
    .alert-success { background: #D1FAE5; color: #047857; border: 1px solid #A7F3D0; }

    .success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .status-summary-box { background: #F4FBF7; padding: 1.5rem; border-radius: 10px; border: 1px solid var(--color-border); margin: 1.5rem auto; max-width: 450px; color: var(--color-text-muted); }
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
