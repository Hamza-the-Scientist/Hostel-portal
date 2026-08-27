// src/app/admin/hostels/hostel-form.component.ts
import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../core/admin/admin.service';
import { HostelDto } from '../../core/models/admin.model';

interface FacilityTile {
  name: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'app-hostel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="hostel-dialog">
      <!-- Sticky Header with Generous Top Padding -->
      <div class="dialog-header">
        <div class="header-icon">
          <mat-icon>domain</mat-icon>
        </div>
        <h2>{{ data ? 'Edit Hostel Details' : 'Add a new Hostel' }}</h2>
        <p class="header-subtitle">{{ data ? 'Update existing hostel information & media' : 'Fill in complete details to register a new hostel' }}</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="dialog-body">

          <!-- SECTION 1: BASIC INFORMATION -->
          <div class="section-title">
            <mat-icon class="section-icon">info</mat-icon>
            <span>Basic Information</span>
          </div>

          <div class="form-row grid-2">
            <div class="form-group">
              <label for="hostelName">Hostel Name <span class="required">*</span></label>
              <input id="hostelName" type="text" formControlName="name" placeholder="e.g. Allama Iqbal Hostel">
              <span class="error-hint" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">Hostel name is required</span>
            </div>

            <div class="form-group">
              <label for="hostelGender">Gender <span class="required">*</span></label>
              <select id="hostelGender" formControlName="gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div class="form-row grid-2">
            <div class="form-group">
              <label for="hostelAddress">Location / Address <span class="required">*</span></label>
              <input id="hostelAddress" type="text" formControlName="address" placeholder="e.g. Main Campus, University of Sindh, Jamshoro">
              <span class="error-hint" *ngIf="form.get('address')?.touched && form.get('address')?.invalid">Location address is required</span>
            </div>

            <div class="form-group">
              <label for="totalRooms">Total Number of Rooms <span class="required">*</span></label>
              <input id="totalRooms" type="number" formControlName="totalRooms" min="1" placeholder="e.g. 50">
              <span class="error-hint" *ngIf="form.get('totalRooms')?.touched && form.get('totalRooms')?.invalid">Please enter a valid number of rooms</span>
            </div>
          </div>

          <div class="form-group">
            <label for="hostelDescription">Description</label>
            <textarea id="hostelDescription" formControlName="description" rows="3" placeholder="Brief overview of hostel facilities, history, environment..."></textarea>
          </div>

          <!-- SECTION 2: FACILITIES / AMENITIES TILES -->
          <div class="section-title">
            <mat-icon class="section-icon">star</mat-icon>
            <span>Hostel Facilities (Click to Select Tiles)</span>
          </div>

          <div class="facility-grid">
            <div 
              *ngFor="let tile of facilityTiles; let i = index" 
              class="facility-tile" 
              [class.active]="tile.selected"
              (click)="toggleFacility(tile)">
              <mat-icon class="tile-icon">{{ tile.icon }}</mat-icon>
              <span class="tile-label">{{ tile.name }}</span>
              <mat-icon class="check-mark" *ngIf="tile.selected">check_circle</mat-icon>
            </div>
          </div>

          <!-- Add Custom Facility Tile -->
          <div class="custom-facility-row">
            <input 
              type="text" 
              [(ngModel)]="customFacilityInput" 
              [ngModelOptions]="{standalone: true}"
              (keyup.enter)="addCustomFacility()"
              placeholder="Add custom facility (e.g. Solar Power)...">
            <button type="button" class="btn-add-tile" (click)="addCustomFacility()">
              <mat-icon>add</mat-icon> Add Tile
            </button>
          </div>

          <!-- SECTION 3: ELIGIBILITY REQUIREMENTS -->
          <div class="section-title">
            <mat-icon class="section-icon">verified_user</mat-icon>
            <span>Eligibility Requirements</span>
          </div>

          <div class="form-group">
            <label for="eligibility">Eligibility Criteria</label>
            <textarea 
              id="eligibility" 
              formControlName="eligibilityRequirement" 
              rows="3" 
              placeholder="e.g. Enrolled BS/Master student. Minimum 2.5 CGPA required. Priority for students domiciled in rural Sindh districts."></textarea>
          </div>

          <!-- SECTION 4: HOSTEL IMAGE ATTACHMENT -->
          <div class="section-title">
            <mat-icon class="section-icon">image</mat-icon>
            <span>Hostel Photos & Gallery</span>
          </div>

          <!-- Drag & Drop Upload Zone -->
          <div class="upload-dropzone" (click)="fileInput.click()">
            <input #fileInput type="file" accept="image/*" multiple (change)="onFileSelected($event)" style="display: none">
            <mat-icon class="dropzone-icon">cloud_upload</mat-icon>
            <div class="dropzone-text">
              <strong>Click to upload photo(s)</strong> or drag & drop image file
            </div>
            <div class="dropzone-hint">PNG, JPG, WEBP up to 5MB</div>
          </div>

          <!-- Image URL Input Fallback -->
          <div class="url-input-row">
            <input 
              type="text" 
              [(ngModel)]="imageUrlInput" 
              [ngModelOptions]="{standalone: true}"
              (keyup.enter)="addImageUrl()"
              placeholder="Or paste image URL (e.g. https://.../photo.jpg)...">
            <button type="button" class="btn-add-url" (click)="addImageUrl()">
              <mat-icon>link</mat-icon> Add Link
            </button>
          </div>

          <!-- Preset Hostel Photos for Quick Selection -->
          <div class="preset-images-label">Quick Sample Photos:</div>
          <div class="preset-images-row">
            <button 
              type="button" 
              *ngFor="let sample of sampleImages" 
              class="preset-img-btn"
              (click)="addSampleImage(sample.url)">
              <img [src]="sample.url" [alt]="sample.label">
              <span>{{ sample.label }}</span>
            </button>
          </div>

          <!-- Attached Image Thumbnails -->
          <div class="image-gallery-grid" *ngIf="attachedImages.length > 0">
            <div class="img-preview-card" *ngFor="let img of attachedImages; let i = index">
              <img [src]="img" alt="Hostel Preview">
              <button type="button" class="btn-remove-img" (click)="removeImage(i)" title="Remove Image">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>

        </div>

        <!-- Sticky Footer -->
        <div class="dialog-footer">
          <button type="button" class="btn-cancel" (click)="onCancel()">Cancel</button>
          <button type="submit" class="btn-save" [disabled]="form.invalid || saving">
            <span *ngIf="saving" class="spinner"></span>
            <mat-icon *ngIf="!saving">save</mat-icon>
            {{ saving ? 'Saving...' : (data ? 'Update Hostel' : 'Add Hostel') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
      overflow-x: hidden !important;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .hostel-dialog {
      font-family: 'Inter', 'Segoe UI', sans-serif;
      position: relative;
      background: #ffffff;
      overflow-x: hidden !important;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* ── Sticky Header with Generous Padding ── */
    .dialog-header {
      position: sticky;
      top: 0;
      z-index: 10;
      background: linear-gradient(135deg, #013828 0%, #015C3A 60%, #017A4A 100%);
      padding: 2.25rem 2.25rem 1.4rem 2.25rem;
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
    }

    .header-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: rgba(212, 175, 55, 0.2);
      color: #D4AF37;
      margin-bottom: 0.5rem;
    }

    .header-icon mat-icon {
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    .dialog-header h2 {
      margin: 0;
      color: #FFFFFF;
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: 0.2px;
    }

    .header-subtitle {
      margin: 0.35rem 0 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.85rem;
    }

    /* ── Body with Spacious Side Padding ── */
    .dialog-body {
      padding: 1.75rem 2.25rem 1.25rem 2.25rem;
      overflow-x: hidden;
      box-sizing: border-box;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.92rem;
      font-weight: 700;
      color: #013828;
      margin: 1.5rem 0 0.85rem;
      padding-bottom: 0.4rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .section-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #D4AF37;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 0.35rem;
    }

    .required {
      color: #e53e3e;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.65rem 0.9rem;
      font-size: 0.9rem;
      color: #1a202c;
      background: #f8fafc;
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #015C3A;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.12);
    }

    .form-group select {
      cursor: pointer;
    }

    .form-group textarea {
      resize: vertical;
    }

    .error-hint {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.78rem;
      color: #e53e3e;
    }

    /* ── Facilities Tile Grid ── */
    .facility-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 0.65rem;
      margin-bottom: 0.85rem;
      overflow-x: hidden;
    }

    .facility-tile {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.6rem 0.75rem;
      background: #f7fafc;
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      position: relative;
      box-sizing: border-box;
    }

    .facility-tile:hover {
      border-color: #015C3A;
      background: #f0faf4;
    }

    .facility-tile.active {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      border-color: #013828;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(1, 56, 40, 0.25);
    }

    .tile-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #718096;
    }

    .facility-tile.active .tile-icon {
      color: #D4AF37;
    }

    .tile-label {
      font-size: 0.8rem;
      font-weight: 600;
      line-height: 1.1;
      flex: 1;
    }

    .check-mark {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #D4AF37;
    }

    .custom-facility-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      box-sizing: border-box;
    }

    .custom-facility-row input {
      flex: 1;
      padding: 0.55rem 0.85rem;
      font-size: 0.88rem;
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      outline: none;
      box-sizing: border-box;
    }

    .custom-facility-row input:focus {
      border-color: #015C3A;
    }

    .btn-add-tile {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.55rem 1rem;
      font-size: 0.82rem;
      font-weight: 600;
      background: #e2e8f0;
      border: none;
      border-radius: 8px;
      color: #2d3748;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-add-tile:hover {
      background: #015C3A;
      color: #ffffff;
    }

    .btn-add-tile mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* ── Dropzone & Upload ── */
    .upload-dropzone {
      border: 2px dashed #cbd5e0;
      background: #f7fafc;
      border-radius: 10px;
      padding: 1.35rem 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 0.75rem;
    }

    .upload-dropzone:hover {
      border-color: #015C3A;
      background: #f0faf4;
    }

    .dropzone-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #015C3A;
      margin-bottom: 0.25rem;
    }

    .dropzone-text {
      font-size: 0.85rem;
      color: #4a5568;
    }

    .dropzone-hint {
      font-size: 0.75rem;
      color: #a0aec0;
      margin-top: 0.2rem;
    }

    .url-input-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.85rem;
    }

    .url-input-row input {
      flex: 1;
      padding: 0.55rem 0.85rem;
      font-size: 0.88rem;
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      outline: none;
      box-sizing: border-box;
    }

    .btn-add-url {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.55rem 1rem;
      font-size: 0.82rem;
      font-weight: 600;
      background: #013828;
      border: none;
      border-radius: 8px;
      color: #ffffff;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn-add-url mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .preset-images-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #718096;
      margin-bottom: 0.45rem;
    }

    .preset-images-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.85rem;
    }

    .preset-img-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem 0.35rem 0.35rem;
      background: #edf2f7;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 600;
      color: #2d3748;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .preset-img-btn:hover {
      border-color: #015C3A;
      background: #e6ffed;
    }

    .preset-img-btn img {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      object-fit: cover;
    }

    /* ── Gallery Preview Grid ── */
    .image-gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
      gap: 0.6rem;
      margin-top: 0.6rem;
    }

    .img-preview-card {
      position: relative;
      width: 100%;
      height: 75px;
      border-radius: 8px;
      overflow: hidden;
      border: 1.5px solid #015C3A;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .img-preview-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .btn-remove-img {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(229, 62, 62, 0.9);
      color: #ffffff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-remove-img mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    /* ── Sticky Footer with Balanced Side Padding ── */
    .dialog-footer {
      position: sticky;
      bottom: 0;
      z-index: 10;
      background: #ffffff;
      display: flex;
      justify-content: flex-end;
      gap: 0.85rem;
      padding: 1rem 2.25rem 1.25rem 2.25rem;
      border-top: 1px solid #e2e8f0;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    }

    .btn-cancel {
      padding: 0.6rem 1.4rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      background: #ffffff;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-cancel:hover {
      background: #f7fafc;
      color: #2d3748;
    }

    .btn-save {
      padding: 0.6rem 1.65rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      transition: all 0.2s ease;
    }

    .btn-save:hover:not(:disabled) {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3);
    }

    .btn-save:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class HostelFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private admin = inject(AdminService);
  private dialogRef = inject(MatDialogRef<HostelFormComponent>);
  
  saving = false;
  data: HostelDto | null;

  customFacilityInput = '';
  imageUrlInput = '';
  attachedImages: string[] = [];

  facilityTiles: FacilityTile[] = [
    { name: 'Attached Bathroom', icon: 'bathtub', selected: true },
    { name: 'Common Bathroom', icon: 'shower', selected: false },
    { name: 'Wi-Fi Internet', icon: 'wifi', selected: true },
    { name: 'Mess / Dining', icon: 'restaurant', selected: true },
    { name: 'Reading Room', icon: 'menu_book', selected: false },
    { name: 'Generator Backup', icon: 'bolt', selected: true },
    { name: 'Laundry Service', icon: 'local_laundry_service', selected: false },
    { name: 'CCTV Security', icon: 'videocam', selected: true },
    { name: 'Sports Ground', icon: 'sports_soccer', selected: false },
    { name: 'Water Cooler', icon: 'water_drop', selected: true },
    { name: 'Mosque / Prayer', icon: 'place', selected: false },
    { name: 'Gym / Fitness', icon: 'fitness_center', selected: false },
    { name: 'Study Lounge', icon: 'weekend', selected: false },
    { name: 'Medical First-Aid', icon: 'medical_services', selected: true }
  ];

  sampleImages = [
    { label: 'Boys Hostel A', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80' },
    { label: 'Girls Hostel B', url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80' },
    { label: 'Modern Block', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80' }
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    gender: ['Male', Validators.required],
    address: ['', Validators.required],
    totalRooms: [50, [Validators.required, Validators.min(1)]],
    description: [''],
    eligibilityRequirement: ['']
  });

  constructor(@Inject(MAT_DIALOG_DATA) data: HostelDto | null) {
    this.data = data;
  }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
        gender: this.data.gender,
        address: this.data.address,
        totalRooms: this.data.totalRooms || 50,
        description: this.data.description || '',
        eligibilityRequirement: this.data.eligibilityRequirement || ''
      });

      // Restore facilities
      if (this.data.amenities && this.data.amenities.length > 0) {
        this.facilityTiles.forEach(tile => {
          tile.selected = this.data!.amenities!.some(a => a.toLowerCase() === tile.name.toLowerCase());
        });
        this.data.amenities.forEach(am => {
          if (!this.facilityTiles.some(t => t.name.toLowerCase() === am.toLowerCase())) {
            this.facilityTiles.push({ name: am, icon: 'star', selected: true });
          }
        });
      }

      // Restore images
      if (this.data.images && this.data.images.length > 0) {
        this.attachedImages = [...this.data.images];
      }
    }
  }

  toggleFacility(tile: FacilityTile) {
    tile.selected = !tile.selected;
  }

  addCustomFacility() {
    const name = this.customFacilityInput.trim();
    if (!name) return;
    const existing = this.facilityTiles.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.selected = true;
    } else {
      this.facilityTiles.push({ name, icon: 'star', selected: true });
    }
    this.customFacilityInput = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (e.target?.result) {
          this.attachedImages.push(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addImageUrl() {
    const url = this.imageUrlInput.trim();
    if (!url) return;
    this.attachedImages.push(url);
    this.imageUrlInput = '';
  }

  addSampleImage(url: string) {
    if (!this.attachedImages.includes(url)) {
      this.attachedImages.push(url);
    }
  }

  removeImage(index: number) {
    this.attachedImages.splice(index, 1);
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;

    const selectedAmenities = this.facilityTiles
      .filter(t => t.selected)
      .map(t => t.name);

    const payload: HostelDto = {
      ...(this.data?.hostelId ? { hostelId: this.data.hostelId } : {}),
      name: this.form.value.name!,
      gender: this.form.value.gender as 'Male' | 'Female',
      address: this.form.value.address!,
      totalRooms: Number(this.form.value.totalRooms || 0),
      description: this.form.value.description || '',
      eligibilityRequirement: this.form.value.eligibilityRequirement || '',
      amenities: selectedAmenities,
      images: this.attachedImages
    };

    const req = this.data
      ? this.admin.updateHostel(this.data.hostelId!, payload)
      : this.admin.createHostel(payload);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        console.error('Failed to save hostel:', err);
        this.dialogRef.close(false);
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
