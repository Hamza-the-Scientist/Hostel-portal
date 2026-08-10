// student/room-change/room-change.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResidencyService, StudentResidencyDto, RoomChangeRequestDto } from '../residency.service';

@Component({
  selector: 'app-room-change',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './room-change.component.html',
  styleUrl: './room-change.component.css',
})
export class RoomChangeComponent implements OnInit {
  private residencyService = inject(ResidencyService);
  private router = inject(Router);

  // Residency state
  readonly residency = signal<StudentResidencyDto | null>(null);
  readonly isResident = signal(false);

  // Request history
  readonly requests = signal<RoomChangeRequestDto[]>([]);
  readonly requestsLoading = signal(true);

  // Form state
  form = { reason: '', preferredBlock: '', additionalDetails: '' };
  readonly reasonError = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitSuccess = signal(false);

  // File upload state
  readonly selectedFile = signal<File | null>(null);
  readonly filePreviewUrl = signal<string | null>(null);
  readonly fileError = signal<string | null>(null);

  private readonly allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
  private readonly maxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

  ngOnInit(): void {
    // Load residency status first to gate the page
    this.residencyService.getResidencyStatus().subscribe({
      next: (r) => {
        this.residency.set(r);
        this.isResident.set(r.isExistingResident);
        if (!r.isExistingResident) {
          // Guard: redirect non-residents to dashboard
          this.router.navigate(['/student/dashboard']);
        } else {
          this.loadRequests();
        }
      },
      error: () => this.router.navigate(['/student/dashboard']),
    });
  }

  private loadRequests(): void {
    this.requestsLoading.set(true);
    this.residencyService.getRoomChangeRequests().subscribe({
      next: (reqs) => {
        this.requests.set(reqs);
        this.requestsLoading.set(false);
      },
      error: () => this.requestsLoading.set(false),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileError.set(null);
    this.filePreviewUrl.set(null);

    if (!file) { this.selectedFile.set(null); return; }

    // Validate extension
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      this.fileError.set(`Invalid file type. Allowed: ${this.allowedExtensions.join(', ')}`);
      input.value = '';
      return;
    }

    // Validate size
    if (file.size > this.maxFileSizeBytes) {
      this.fileError.set('File size exceeds 5 MB limit.');
      input.value = '';
      return;
    }

    this.selectedFile.set(file);

    // Generate preview for images
    if (['image/jpeg', 'image/png'].includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => this.filePreviewUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.filePreviewUrl.set(null);
    this.fileError.set(null);
  }

  submitRequest(): void {
    // Validate
    this.reasonError.set(null);
    this.submitError.set(null);
    this.submitSuccess.set(false);

    if (this.form.reason.trim().length < 10) {
      this.reasonError.set('Reason must be at least 10 characters.');
      return;
    }
    if (this.form.reason.trim().length > 500) {
      this.reasonError.set('Reason cannot exceed 500 characters.');
      return;
    }

    const formData = new FormData();
    formData.append('reason', this.form.reason.trim());
    if (this.form.preferredBlock.trim()) {
      formData.append('preferredBlock', this.form.preferredBlock.trim());
    }
    if (this.form.additionalDetails.trim()) {
      formData.append('additionalDetails', this.form.additionalDetails.trim());
    }
    const file = this.selectedFile();
    if (file) {
      formData.append('attachment', file, file.name);
    }

    this.submitting.set(true);
    this.residencyService.createRoomChangeRequest(formData).subscribe({
      next: (created) => {
        this.requests.update(reqs => [created, ...reqs]);
        this.resetForm();
        this.submitSuccess.set(true);
        this.submitting.set(false);
        // Auto-scroll to success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.submitError.set(err?.error?.message ?? 'Submission failed. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  resetForm(): void {
    this.form = { reason: '', preferredBlock: '', additionalDetails: '' };
    this.clearFile();
    this.reasonError.set(null);
    this.submitError.set(null);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase().replace(' ', '-')) {
      case 'submitted': return 'submitted';
      case 'under-review': return 'under-review';
      case 'in-progress': return 'in-progress';
      case 'approved': return 'approved';
      case 'rejected': return 'rejected';
      case 'cancelled': return 'cancelled';
      default: return 'default';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
