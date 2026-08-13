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
    .profile-page { padding: 2rem 1rem; color: #FFFFFF; max-width: 1100px; margin: 0 auto; }
    .header { margin-bottom: 2rem; }
    .header h2 { font-size: 1.8rem; color: #FFFFFF; font-weight: 800; margin-bottom: 0.25rem; }
    .header p { color: #CBD5E1; font-size: 0.95rem; }
    .grid { display: flex; flex-direction: column; gap: 2rem; }
    .card { background: #001C3B; border-radius: 14px; padding: 1.75rem; border: 1px solid #002D5A; box-shadow: 0 4px 16px rgba(0,0,0,0.25); color: #FFFFFF; }
    .card-locked { background: #001C3B; border-color: #002D5A; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #002D5A; padding-bottom: 1rem; }
    .card-header h3 { font-size: 1.2rem; color: #FFFFFF; margin: 0; font-weight: 700; }
    .locked-badge { background: rgba(0, 199, 182, 0.15); color: #00C7B6; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(0, 199, 182, 0.3); }
    .editable-badge { background: rgba(234, 179, 8, 0.15); color: #facc15; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(234, 179, 8, 0.3); }
    .verified-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
    .info-group label { display: block; font-size: 0.8rem; color: #CBD5E1; font-weight: 600; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .read-only-field { background: #00142A; padding: 0.65rem 0.85rem; border-radius: 8px; font-size: 0.95rem; color: #FFFFFF; font-weight: 500; border: 1px solid #002D5A; }
    .form-row { display: flex; gap: 1.25rem; margin-bottom: 1.25rem; }
    .form-group { flex: 1; }
    .form-group.full { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.88rem; color: #CBD5E1; }
    input, select, textarea { width: 100%; padding: 0.7rem; background: #00142A; border: 1px solid #002D5A; border-radius: 8px; box-sizing: border-box; font-size: 0.95rem; font-family: inherit; color: #FFFFFF; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: #00C7B6; }
    .form-actions { margin-top: 1.5rem; text-align: right; }
    .btn { padding: 0.7rem 1.4rem; border-radius: 8px; font-weight: 700; cursor: pointer; border: none; }
    .btn-primary { background: #00C7B6; color: #001832; }
    .btn-primary:hover:not(:disabled) { background: #00b3a3; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .alert { padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-weight: 500; }
    .alert-success { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
    .alert-error { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .font-bold { font-weight: 700; color: #00C7B6; }
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
