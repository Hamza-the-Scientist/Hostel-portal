import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StudentProfileService, StudentProfileDto } from '../student-profile.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styles: [`
    .profile-page { padding: 2rem 1rem; }
    .header { margin-bottom: 2rem; }
    .header h2 { font-size: 1.8rem; color: #015C3A; margin-bottom: 0.25rem; }
    .header p { color: #666; font-size: 0.95rem; }
    .grid { display: flex; flex-direction: column; gap: 2rem; }
    .card { background: white; border-radius: 12px; padding: 1.75rem; border: 1px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .card-locked { background: #fafafa; border-color: #d1e7dd; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
    .card-header h3 { font-size: 1.2rem; color: #333; margin: 0; }
    .locked-badge { background: #e8f5e9; color: #015C3A; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .editable-badge { background: #fff8e1; color: #b78103; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .verified-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
    .info-group label { display: block; font-size: 0.8rem; color: #777; font-weight: 600; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .read-only-field { background: #f0f4f2; padding: 0.65rem 0.85rem; border-radius: 6px; font-size: 0.95rem; color: #222; font-weight: 500; border: 1px solid #dae5e0; }
    .form-row { display: flex; gap: 1.25rem; margin-bottom: 1.25rem; }
    .form-group { flex: 1; }
    .form-group.full { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.88rem; color: #333; }
    input, select, textarea { width: 100%; padding: 0.7rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; font-size: 0.95rem; font-family: inherit; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: #015C3A; }
    .form-actions { margin-top: 1.5rem; text-align: right; }
    .alert { padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; font-weight: 500; }
    .alert-success { background: #e8f5e9; color: #1b5e20; border: 1px solid #c8e6c9; }
    .alert-error { background: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }
    .font-bold { font-weight: 700; color: #015C3A; }
  `]
})
export class ProfileComponent implements OnInit {
  private profileService = inject(StudentProfileService);
  private fb = inject(FormBuilder);

  profile: StudentProfileDto | null = null;
  message = '';
  errorMessage = '';
  isSaving = false;

  profileForm = this.fb.group({
    phoneNumber: [''],
    emergencyContact: [''],
    guardianName: [''],
    guardianPhone: [''],
    guardianRelation: [''],
    bloodGroup: [''],
    homeAddress: [''],
    city: [''],
    disabilities: ['']
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
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
      },
      error: (err) => {
        this.errorMessage = 'Failed to load student profile.';
      }
    });
  }

  onSave() {
    if (this.profileForm.invalid) return;

    this.message = '';
    this.errorMessage = '';
    this.isSaving = true;

    this.profileService.updateProfile(this.profileForm.value as any).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.message = 'Profile updated successfully!';
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'Failed to save changes. Please try again.';
        this.isSaving = false;
      }
    });
  }
}
