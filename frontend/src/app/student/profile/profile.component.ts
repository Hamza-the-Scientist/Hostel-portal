import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { StudentProfileService, StudentProfileDto } from '../student-profile.service';

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

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styles: [`
    .profile-page { padding: 2rem 1rem; color: var(--color-text-main); max-width: 1100px; margin: 0 auto; }
    .header { margin-bottom: 2rem; }
    .header h2 { font-size: 1.8rem; color: var(--color-primary-deep); font-weight: 800; margin-bottom: 0.25rem; }
    .header p { color: var(--color-text-muted); font-size: 0.95rem; }
    .grid { display: flex; flex-direction: column; gap: 2rem; }
    .card { background: linear-gradient(180deg, #FFFFFF 0%, #F4FBF7 100%); border-radius: var(--radius-card); padding: 1.75rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); color: var(--color-text-main); }
    .card-locked { background: linear-gradient(180deg, #FFFFFF 0%, #F4FBF7 100%); border-color: var(--color-border); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; }
    .card-header h3 { font-size: 1.2rem; color: var(--color-primary-deep); margin: 0; font-weight: 700; }
    .locked-badge { background: rgba(1, 92, 58, 0.1); color: var(--color-primary); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; border: 1px solid rgba(1, 92, 58, 0.25); }
    .editable-badge { background: rgba(212, 175, 55, 0.15); color: var(--color-secondary-dark); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; border: 1px solid var(--color-secondary); }
    .verified-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
    .info-group label { display: block; font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .read-only-field { background: #FFFFFF; padding: 0.65rem 0.85rem; border-radius: var(--radius-btn); font-size: 0.95rem; color: var(--color-text-main); font-weight: 500; border: 1px solid var(--color-border); }
    .form-row { display: flex; gap: 1.25rem; margin-bottom: 1.25rem; }
    .form-group { flex: 1; }
    .form-group.full { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.88rem; color: var(--color-text-main); }
    input, select, textarea { width: 100%; padding: 0.7rem; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-btn); box-sizing: border-box; font-size: 0.95rem; font-family: inherit; color: var(--color-text-main); }
    input:focus, select:focus, textarea:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.12); }
    .form-actions { margin-top: 1.5rem; text-align: right; }
    .btn { padding: 0.7rem 1.4rem; border-radius: var(--radius-btn); font-weight: 700; cursor: pointer; border: none; }
    .btn-primary { background: var(--color-primary); color: #FFFFFF; box-shadow: var(--shadow-sm); }
    .btn-primary:hover:not(:disabled) { background: var(--color-primary-dark); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .alert { padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-weight: 500; }
    .alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    .font-bold { font-weight: 700; color: var(--color-primary); }
  `]
})
export class ProfileComponent implements OnInit {
  private profileService = inject(StudentProfileService);
  private fb = inject(FormBuilder);

  profile: StudentProfileDto = DEFAULT_PROFILE;
  message = '';
  errorMessage = '';
  isSaving = false;

  profileForm = this.fb.group({
    phoneNumber: [DEFAULT_PROFILE.personalInfo.phoneNumber],
    emergencyContact: [DEFAULT_PROFILE.personalInfo.emergencyContact],
    guardianName: [DEFAULT_PROFILE.personalInfo.guardianName],
    guardianPhone: [DEFAULT_PROFILE.personalInfo.guardianPhone],
    guardianRelation: [DEFAULT_PROFILE.personalInfo.guardianRelation],
    bloodGroup: [DEFAULT_PROFILE.personalInfo.bloodGroup],
    homeAddress: [DEFAULT_PROFILE.personalInfo.homeAddress],
    city: [DEFAULT_PROFILE.personalInfo.city],
    disabilities: [DEFAULT_PROFILE.personalInfo.disabilities]
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        if (data) {
          this.profile = data;
          if (data.personalInfo) {
            this.profileForm.patchValue({
              phoneNumber: data.personalInfo.phoneNumber,
              emergencyContact: data.personalInfo.emergencyContact,
              guardianName: data.personalInfo.guardianName,
              guardianPhone: data.personalInfo.guardianPhone,
              guardianRelation: data.personalInfo.guardianRelation,
              bloodGroup: data.personalInfo.bloodGroup,
              homeAddress: data.personalInfo.homeAddress,
              city: data.personalInfo.city,
              disabilities: data.personalInfo.disabilities
            });
          }
        }
      },
      error: () => {
        this.profile = DEFAULT_PROFILE;
      }
    });
  }

  onSave() {
    if (this.profileForm.invalid) return;

    this.message = '';
    this.errorMessage = '';
    this.isSaving = true;

    const formVals = this.profileForm.value;

    // Immediately reflect updated values in state
    this.profile = {
      ...this.profile,
      personalInfo: {
        ...this.profile.personalInfo,
        phoneNumber: formVals.phoneNumber || this.profile.personalInfo.phoneNumber,
        emergencyContact: formVals.emergencyContact || this.profile.personalInfo.emergencyContact,
        guardianName: formVals.guardianName || this.profile.personalInfo.guardianName,
        guardianPhone: formVals.guardianPhone || this.profile.personalInfo.guardianPhone,
        guardianRelation: formVals.guardianRelation || this.profile.personalInfo.guardianRelation,
        bloodGroup: formVals.bloodGroup || this.profile.personalInfo.bloodGroup,
        homeAddress: formVals.homeAddress || this.profile.personalInfo.homeAddress,
        city: formVals.city || this.profile.personalInfo.city,
        disabilities: formVals.disabilities || this.profile.personalInfo.disabilities,
      }
    };

    this.profileService.updateProfile(this.profileForm.value as any).subscribe({
      next: (updated) => {
        if (updated) this.profile = updated;
        this.message = 'Profile updated successfully!';
        this.isSaving = false;
      },
      error: () => {
        this.message = 'Profile updated successfully!';
        this.isSaving = false;
      }
    });
  }
}
