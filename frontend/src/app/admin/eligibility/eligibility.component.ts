import { Component, inject, OnInit, signal, computed, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EligibilityService, DistrictItem, CampusItem } from '../../core/admin/eligibility.service';

/* ─────────────────────────────────────────────────────────────
   Modal 1: Edit Campuses Dialog
───────────────────────────────────────────────────────────── */
@Component({
  selector: 'app-manage-campuses-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="edit-dialog">
      <div class="dialog-header">
        <div class="header-title-wrap">
          <div class="header-icon font-gold">
            <mat-icon>account_balance</mat-icon>
          </div>
          <div>
            <h2>Select Eligible Campuses</h2>
            <p class="header-subtitle">Toggle campuses to allow or restrict hostel applications</p>
          </div>
        </div>
        <button class="close-btn" mat-dialog-close><mat-icon>close</mat-icon></button>
      </div>

      <div class="dialog-body">
        <div class="items-list">
          <div 
            *ngFor="let camp of localCampuses" 
            class="toggle-row"
            [class.row-selected]="camp.isEligible"
            (click)="toggleCampus(camp)"
          >
            <div class="row-info">
              <mat-icon class="row-icon" [class.icon-active]="camp.isEligible">account_balance</mat-icon>
              <div>
                <strong class="row-title">{{ camp.name }}</strong>
                <span class="row-subtitle">{{ camp.code }} • {{ camp.location }}</span>
              </div>
            </div>

            <div class="toggle-control">
              <span class="status-pill" [class.pill-active]="camp.isEligible" [class.pill-inactive]="!camp.isEligible">
                {{ camp.isEligible ? 'Eligible' : 'Deselected' }}
              </span>
              <div class="switch-ui" [class.switch-on]="camp.isEligible">
                <div class="switch-knob"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="btn-cancel" mat-dialog-close>Cancel</button>
        <button class="btn-save" (click)="save()">
          <mat-icon>check</mat-icon> Save Campus Changes
        </button>
      </div>
    </div>
  `,
  styles: [`
    .edit-dialog { font-family: 'Inter', sans-serif; background: #ffffff; border-radius: 12px; overflow: hidden; min-width: 520px; }
    .dialog-header {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      padding: 1.5rem 1.75rem; display: flex; align-items: center; justify-content: space-between;
    }
    .header-title-wrap { display: flex; align-items: center; gap: 0.75rem; }
    .header-icon {
      width: 42px; height: 42px; border-radius: 10px; background: rgba(212, 175, 55, 0.2);
      display: flex; align-items: center; justify-content: center; color: #D4AF37;
    }
    .dialog-header h2 { margin: 0; color: #ffffff; font-size: 1.2rem; font-weight: 700; }
    .header-subtitle { margin: 0.2rem 0 0; color: rgba(255,255,255,0.8); font-size: 0.82rem; }
    .close-btn { background: transparent; border: none; color: #ffffff; cursor: pointer; opacity: 0.8; }
    .close-btn:hover { opacity: 1; }

    .dialog-body { padding: 1.25rem 1.75rem; max-height: 440px; overflow-y: auto; }
    .items-list { display: flex; flex-direction: column; gap: 0.65rem; }

    .toggle-row {
      display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem;
      border: 1.5px solid #e2e8f0; border-radius: 10px; background: #f8fafc; cursor: pointer; transition: all 0.2s ease;
    }
    .toggle-row:hover { border-color: #015C3A; background: #f0faf4; }
    .toggle-row.row-selected { border-color: #015C3A; background: #edf7f2; }

    .row-info { display: flex; align-items: center; gap: 0.75rem; }
    .row-icon { color: #94a3b8; font-size: 20px; width: 20px; height: 20px; }
    .row-icon.icon-active { color: #015C3A; }
    .row-title { display: block; color: #1e293b; font-size: 0.92rem; font-weight: 700; }
    .row-subtitle { display: block; color: #64748b; font-size: 0.78rem; margin-top: 0.1rem; }

    .toggle-control { display: flex; align-items: center; gap: 0.75rem; }
    .status-pill { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; }
    .pill-active { background: #c6f6d5; color: #22543d; }
    .pill-inactive { background: #edf2f7; color: #718096; }

    .switch-ui { width: 44px; height: 24px; border-radius: 12px; background: #cbd5e1; position: relative; transition: background 0.2s ease; }
    .switch-on { background: #015C3A; }
    .switch-knob { width: 18px; height: 18px; border-radius: 50%; background: #ffffff; position: absolute; top: 3px; left: 3px; transition: left 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .switch-on .switch-knob { left: 23px; }

    .dialog-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.75rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    .btn-cancel { padding: 0.65rem 1.25rem; font-size: 0.88rem; font-weight: 600; border: 1.5px solid #cbd5e0; border-radius: 8px; background: #ffffff; color: #4a5568; cursor: pointer; font-family: inherit; }
    .btn-save { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1.4rem; font-size: 0.88rem; font-weight: 700; border: none; border-radius: 8px; background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #ffffff; cursor: pointer; font-family: inherit; }
    .btn-save:hover { background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%); box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3); }
  `]
})
export class ManageCampusesDialogComponent {
  private dialogRef = inject(MatDialogRef<ManageCampusesDialogComponent>);
  localCampuses: CampusItem[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { campuses: CampusItem[] }) {
    this.localCampuses = data.campuses.map(c => ({ ...c }));
  }

  toggleCampus(campus: CampusItem) {
    campus.isEligible = !campus.isEligible;
  }

  save() {
    this.dialogRef.close(this.localCampuses);
  }
}

/* ─────────────────────────────────────────────────────────────
   Modal 2: Edit Districts Dialog
───────────────────────────────────────────────────────────── */
@Component({
  selector: 'app-manage-districts-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="edit-dialog">
      <div class="dialog-header">
        <div class="header-title-wrap">
          <div class="header-icon font-cyan">
            <mat-icon>location_city</mat-icon>
          </div>
          <div>
            <h2>Select Eligible Districts</h2>
            <p class="header-subtitle">Select or deselect student domicile districts allowed to apply for hostel</p>
          </div>
        </div>
        <button class="close-btn" mat-dialog-close><mat-icon>close</mat-icon></button>
      </div>

      <!-- Controls Bar inside modal -->
      <div class="modal-controls">
        <div class="search-box">
          <mat-icon class="search-icon">search</mat-icon>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search district name..." class="search-input" />
        </div>
        <div class="bulk-btns">
          <button class="btn-bulk" (click)="selectAll(true)">Select All</button>
          <button class="btn-bulk" (click)="selectAll(false)">Deselect All</button>
        </div>
      </div>

      <div class="dialog-body">
        <div class="districts-grid">
          <div 
            *ngFor="let dist of filteredDistricts" 
            class="district-card-toggle"
            [class.district-selected]="dist.isAllowed"
            (click)="toggleDistrict(dist)"
          >
            <div class="dist-card-left">
              <mat-icon class="dist-check-icon">{{ dist.isAllowed ? 'check_box' : 'check_box_outline_blank' }}</mat-icon>
              <div>
                <strong class="dist-name">{{ dist.name }}</strong>
                <span class="dist-prov">{{ dist.province || 'Sindh' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="btn-cancel" mat-dialog-close>Cancel</button>
        <button class="btn-save" (click)="save()">
          <mat-icon>check</mat-icon> Save District Changes
        </button>
      </div>
    </div>
  `,
  styles: [`
    .edit-dialog { font-family: 'Inter', sans-serif; background: #ffffff; border-radius: 12px; overflow: hidden; min-width: 620px; }
    .dialog-header {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      padding: 1.5rem 1.75rem; display: flex; align-items: center; justify-content: space-between;
    }
    .header-title-wrap { display: flex; align-items: center; gap: 0.75rem; }
    .header-icon {
      width: 42px; height: 42px; border-radius: 10px; background: rgba(56, 178, 172, 0.2);
      display: flex; align-items: center; justify-content: center; color: #38b2ac;
    }
    .dialog-header h2 { margin: 0; color: #ffffff; font-size: 1.2rem; font-weight: 700; }
    .header-subtitle { margin: 0.2rem 0 0; color: rgba(255,255,255,0.8); font-size: 0.82rem; }
    .close-btn { background: transparent; border: none; color: #ffffff; cursor: pointer; opacity: 0.8; }

    .modal-controls {
      display: flex; justify-content: space-between; align-items: center; gap: 1rem;
      padding: 1rem 1.75rem 0.5rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
    }
    .search-box {
      display: flex; align-items: center; background: #ffffff; border: 1.5px solid #cbd5e0;
      border-radius: 8px; padding: 0.35rem 0.75rem; flex: 1;
    }
    .search-icon { color: #94a3b8; font-size: 18px; width: 18px; height: 18px; margin-right: 0.4rem; }
    .search-input { border: none; outline: none; width: 100%; font-size: 0.88rem; font-family: inherit; }

    .bulk-btns { display: flex; gap: 0.5rem; }
    .btn-bulk { padding: 0.4rem 0.8rem; font-size: 0.78rem; font-weight: 700; border: 1px solid #cbd5e0; border-radius: 6px; background: #ffffff; color: #475569; cursor: pointer; }
    .btn-bulk:hover { background: #edf2f7; color: #015C3A; }

    .dialog-body { padding: 1.25rem 1.75rem; max-height: 380px; overflow-y: auto; }
    .districts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.65rem; }

    .district-card-toggle {
      display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0.85rem;
      border: 1.5px solid #e2e8f0; border-radius: 8px; background: #ffffff; cursor: pointer; transition: all 0.2s ease;
    }
    .district-card-toggle:hover { border-color: #015C3A; background: #f0faf4; }
    .district-card-toggle.district-selected { border-color: #015C3A; background: #edf7f2; }

    .dist-card-left { display: flex; align-items: center; gap: 0.6rem; }
    .dist-check-icon { color: #94a3b8; font-size: 20px; width: 20px; height: 20px; }
    .district-selected .dist-check-icon { color: #015C3A; }
    .dist-name { display: block; color: #1e293b; font-size: 0.88rem; font-weight: 700; }
    .dist-prov { display: block; color: #64748b; font-size: 0.75rem; }

    .dialog-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.75rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    .btn-cancel { padding: 0.65rem 1.25rem; font-size: 0.88rem; font-weight: 600; border: 1.5px solid #cbd5e0; border-radius: 8px; background: #ffffff; color: #4a5568; cursor: pointer; font-family: inherit; }
    .btn-save { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1.4rem; font-size: 0.88rem; font-weight: 700; border: none; border-radius: 8px; background: linear-gradient(135deg, #013828 0%, #015C3A 100%); color: #ffffff; cursor: pointer; font-family: inherit; }
    .btn-save:hover { background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%); box-shadow: 0 4px 12px rgba(1, 92, 58, 0.3); }
  `]
})
export class ManageDistrictsDialogComponent {
  private dialogRef = inject(MatDialogRef<ManageDistrictsDialogComponent>);
  localDistricts: DistrictItem[] = [];
  searchQuery = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { districts: DistrictItem[] }) {
    this.localDistricts = data.districts.map(d => ({ ...d }));
  }

  get filteredDistricts() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.localDistricts;
    return this.localDistricts.filter(d => d.name.toLowerCase().includes(q) || (d.province && d.province.toLowerCase().includes(q)));
  }

  toggleDistrict(dist: DistrictItem) {
    dist.isAllowed = !dist.isAllowed;
  }

  selectAll(status: boolean) {
    this.filteredDistricts.forEach(d => d.isAllowed = status);
  }

  save() {
    this.dialogRef.close(this.localDistricts);
  }
}

/* ─────────────────────────────────────────────────────────────
   Main Component: EligibilityComponent (Minimal Cards View)
───────────────────────────────────────────────────────────── */
@Component({
  selector: 'app-eligibility',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="eligibility-page">
      <!-- Minimal Page Header - NO Subtitle Text -->
      <div class="page-header">
        <h2 class="page-title">Eligibility Management</h2>
      </div>

      <!-- Minimal Cards Grid Layout -->
      <div class="cards-grid">

        <!-- CARD 1: ELIGIBLE CAMPUSES CARD -->
        <div class="minimal-card">
          <div class="card-top-bar">
            <div class="card-title-wrap">
              <div class="card-icon-badge gold-bg">
                <mat-icon>account_balance</mat-icon>
              </div>
              <div>
                <h3 class="card-heading">Eligible Campuses</h3>
                <span class="card-count-subtitle">{{ eligibleCampuses().length }} of {{ campuses().length }} Campuses Eligible</span>
              </div>
            </div>

            <button class="btn-edit-card" (click)="openEditCampusesModal()">
              <mat-icon>edit</mat-icon>
              <span>Edit</span>
            </button>
          </div>

          <div class="card-content-body">
            <div *ngIf="eligibleCampuses().length > 0" class="chips-container">
              <div *ngFor="let camp of eligibleCampuses()" class="eligible-chip campus-chip">
                <mat-icon class="chip-check-icon">check_circle</mat-icon>
                <span class="chip-text">{{ camp.name }}</span>
              </div>
            </div>

            <div *ngIf="eligibleCampuses().length === 0" class="empty-chips-msg">
              <mat-icon>warning_amber</mat-icon>
              <span>No campuses currently selected as eligible. Click Edit to select campuses.</span>
            </div>
          </div>
        </div>

        <!-- CARD 2: ELIGIBLE DISTRICTS CARD -->
        <div class="minimal-card">
          <div class="card-top-bar">
            <div class="card-title-wrap">
              <div class="card-icon-badge green-bg">
                <mat-icon>location_city</mat-icon>
              </div>
              <div>
                <h3 class="card-heading">Eligible Districts</h3>
                <span class="card-count-subtitle">{{ allowedDistricts().length }} of {{ districts().length }} Districts Allowed</span>
              </div>
            </div>

            <button class="btn-edit-card" (click)="openEditDistrictsModal()">
              <mat-icon>edit</mat-icon>
              <span>Edit</span>
            </button>
          </div>

          <div class="card-content-body">
            <div *ngIf="allowedDistricts().length > 0" class="chips-container">
              <div *ngFor="let dist of allowedDistricts()" class="eligible-chip district-chip">
                <mat-icon class="chip-check-icon">check_circle</mat-icon>
                <span class="chip-text">{{ dist.name }}</span>
              </div>
            </div>

            <div *ngIf="allowedDistricts().length === 0" class="empty-chips-msg">
              <mat-icon>warning_amber</mat-icon>
              <span>No districts currently selected as eligible. Click Edit to allow districts.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .eligibility-page { font-family: 'Inter', sans-serif; }

    .page-header { margin-bottom: 1.5rem; }
    .page-title { margin: 0; color: #013828; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; }

    /* Minimal Cards Grid */
    .cards-grid { display: flex; flex-direction: column; gap: 1.5rem; }

    .minimal-card {
      background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 1.5rem; transition: all 0.2s ease;
    }
    .minimal-card:hover { border-color: #cbd5e0; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

    .card-top-bar {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 1rem; border-bottom: 1px solid #edf2f7; margin-bottom: 1.25rem;
    }

    .card-title-wrap { display: flex; align-items: center; gap: 0.85rem; }
    
    .card-icon-badge {
      width: 46px; height: 46px; border-radius: 10px; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
    }
    .gold-bg { background: rgba(212, 175, 55, 0.15); color: #b78a00; }
    .green-bg { background: rgba(1, 92, 58, 0.12); color: #015C3A; }

    .card-heading { margin: 0; font-size: 1.15rem; font-weight: 700; color: #013828; }
    .card-count-subtitle { margin: 0.15rem 0 0; font-size: 0.83rem; font-weight: 600; color: #64748b; }

    /* Edit Button */
    .btn-edit-card {
      display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1.25rem;
      font-size: 0.88rem; font-weight: 700; border: 1.5px solid #cbd5e0; border-radius: 8px;
      background: #ffffff; color: #013828; cursor: pointer; transition: all 0.2s ease; font-family: inherit;
    }
    .btn-edit-card mat-icon { font-size: 18px; width: 18px; height: 18px; color: #015C3A; }
    .btn-edit-card:hover {
      background: #015C3A; color: #ffffff; border-color: #015C3A;
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.25);
    }
    .btn-edit-card:hover mat-icon { color: #ffffff; }

    /* Card Content Chips */
    .chips-container { display: flex; flex-wrap: wrap; gap: 0.65rem; }
    
    .eligible-chip {
      display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.9rem;
      border-radius: 20px; font-size: 0.85rem; font-weight: 600; transition: all 0.2s ease;
    }
    .campus-chip { background: #fefcbf; color: #744210; border: 1px solid #f6e05e; }
    .district-chip { background: #e6fffa; color: #234e52; border: 1px solid #b2f5ea; }

    .chip-check-icon { font-size: 16px; width: 16px; height: 16px; }
    .campus-chip .chip-check-icon { color: #d69e2e; }
    .district-chip .chip-check-icon { color: #319795; }

    .empty-chips-msg {
      display: flex; align-items: center; gap: 0.5rem; color: #c53030; background: #fff5f5;
      padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.88rem; font-weight: 600; border: 1px solid #fed7d7;
    }
  `]
})
export class EligibilityComponent implements OnInit {
  private eligibility = inject(EligibilityService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  districts = signal<DistrictItem[]>([]);
  campuses = signal<CampusItem[]>([]);

  // Computed Eligible Lists
  eligibleCampuses = computed(() => this.campuses().filter(c => c.isEligible));
  allowedDistricts = computed(() => this.districts().filter(d => d.isAllowed));

  ngOnInit() {
    this.loadDistricts();
    this.loadCampuses();
  }

  loadDistricts() {
    this.eligibility.getDistrictsManagement().subscribe({
      next: (data) => this.districts.set(data || []),
      error: () => {
        const fallbackDistricts: DistrictItem[] = [
          { districtId: 1, name: 'Hyderabad', province: 'Sindh', isAllowed: true },
          { districtId: 2, name: 'Jamshoro', province: 'Sindh', isAllowed: true },
          { districtId: 3, name: 'Karachi Central', province: 'Sindh', isAllowed: true },
          { districtId: 4, name: 'Karachi East', province: 'Sindh', isAllowed: true },
          { districtId: 5, name: 'Karachi South', province: 'Sindh', isAllowed: true },
          { districtId: 6, name: 'Karachi West', province: 'Sindh', isAllowed: true },
          { districtId: 7, name: 'Badin', province: 'Sindh', isAllowed: false },
          { districtId: 8, name: 'Thatta', province: 'Sindh', isAllowed: true },
          { districtId: 9, name: 'Sukkur', province: 'Sindh', isAllowed: true },
          { districtId: 10, name: 'Larkana', province: 'Sindh', isAllowed: true },
          { districtId: 11, name: 'Dadu', province: 'Sindh', isAllowed: true },
          { districtId: 12, name: 'Mirpurkhas', province: 'Sindh', isAllowed: true },
          { districtId: 13, name: 'Shaheed Benazirabad', province: 'Sindh', isAllowed: true },
          { districtId: 14, name: 'Khairpur', province: 'Sindh', isAllowed: true }
        ];
        this.districts.set(fallbackDistricts);
      }
    });
  }

  loadCampuses() {
    this.eligibility.getCampusesManagement().subscribe({
      next: (data) => this.campuses.set(data || []),
      error: () => {}
    });
  }

  openEditCampusesModal() {
    const dialogRef = this.dialog.open(ManageCampusesDialogComponent, {
      width: '560px',
      data: { campuses: this.campuses() }
    });

    dialogRef.afterClosed().subscribe((updatedList: CampusItem[]) => {
      if (updatedList) {
        this.eligibility.saveAllCampuses(updatedList).subscribe(() => {
          this.campuses.set([...updatedList]);
          this.snack.open('✅ Eligible Campuses updated and saved!', 'OK', { duration: 3000 });
        });
      }
    });
  }

  openEditDistrictsModal() {
    const dialogRef = this.dialog.open(ManageDistrictsDialogComponent, {
      width: '680px',
      data: { districts: this.districts() }
    });

    dialogRef.afterClosed().subscribe((updatedList: DistrictItem[]) => {
      if (updatedList) {
        this.eligibility.saveAllDistricts(updatedList).subscribe(() => {
          this.districts.set([...updatedList]);
          this.snack.open('✅ Eligible Districts updated and saved!', 'OK', { duration: 3000 });
        });
      }
    });
  }
}
