// src/app/admin/rooms/room-list.component.ts
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/admin/admin.service';
import { RoomDto, HostelDto, RoomResidentDto } from '../../core/models/admin.model';
import { RoomFormComponent } from './room-form.component';
import { RoomResidentsDialogComponent } from './room-residents-dialog.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  template: `
    <div class="rooms-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">Rooms Management</h2>
          <p class="page-subtitle">Manage dormitory blocks, floor arrangements, room bed capacities, and resident occupancy</p>
        </div>
      </div>

      <!-- Control & Filter Card -->
      <div class="control-card">
        <div class="control-card-header">
          <mat-icon class="control-icon">meeting_room</mat-icon>
          <span>Rooms Management Controls</span>
        </div>

        <div class="controls-body">
          <div class="filter-group">
            <div class="input-group">
              <label for="hostelSelect">Select Hostel</label>
              <select id="hostelSelect" [(ngModel)]="selectedHostelId" (change)="onHostelChange($event)" class="select-input">
                <option *ngFor="let h of hostels" [value]="h.hostelId">
                  {{ h.name }} ({{ h.gender }})
                </option>
              </select>
            </div>

            <div class="input-group">
              <label for="roomSearch">Search Room</label>
              <input 
                id="roomSearch" 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Search by room #, block, or floor..." 
                class="search-input"
              />
            </div>
          </div>

          <button class="btn-add-room" (click)="openForm()" [disabled]="!selectedHostelId">
            <mat-icon>add</mat-icon>
            Add New Room
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div class="loading-bar" *ngIf="loading">
        <div class="loading-bar-inner"></div>
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading && filteredRooms.length === 0">
        <mat-icon class="empty-icon">meeting_room</mat-icon>
        <h3>No Rooms Found</h3>
        <p *ngIf="!selectedHostelId">Select a hostel from the dropdown above to view its registered rooms.</p>
        <p *ngIf="selectedHostelId">No rooms match your search query or no rooms have been added to this hostel yet.</p>
        <button class="btn-action-primary" (click)="openForm()" *ngIf="selectedHostelId">
          <mat-icon>add</mat-icon>
          Add First Room Now
        </button>
      </div>

      <!-- Table Wrapper -->
      <div class="table-wrapper" *ngIf="!loading && filteredRooms.length > 0">
        <div class="table-header-bar">
          <span class="record-count">
            <mat-icon>domain</mat-icon>
            {{ filteredRooms.length }} room{{ filteredRooms.length === 1 ? '' : 's' }} available in {{ getSelectedHostelName() }}
          </span>
        </div>

        <table mat-table [dataSource]="filteredRooms" class="rooms-table">
          <!-- Block Column -->
          <ng-container matColumnDef="block">
            <th mat-header-cell *matHeaderCellDef>Block</th>
            <td mat-cell *matCellDef="let r">
              <span class="block-badge">{{ r.block || 'Block A' }}</span>
            </td>
          </ng-container>

          <!-- Floor Column -->
          <ng-container matColumnDef="floor">
            <th mat-header-cell *matHeaderCellDef>Floor</th>
            <td mat-cell *matCellDef="let r">
              <span class="floor-text">
                <mat-icon class="cell-icon">layers</mat-icon>
                Floor {{ r.floor }}
              </span>
            </td>
          </ng-container>

          <!-- Room # Column -->
          <ng-container matColumnDef="number">
            <th mat-header-cell *matHeaderCellDef>Room #</th>
            <td mat-cell *matCellDef="let r">
              <span class="room-number">Room {{ r.number }}</span>
            </td>
          </ng-container>

          <!-- Total Beds Capacity Column -->
          <ng-container matColumnDef="totalBeds">
            <th mat-header-cell *matHeaderCellDef>Total Capacity</th>
            <td mat-cell *matCellDef="let r">
              <span class="beds-badge">
                <mat-icon class="badge-icon">single_bed</mat-icon>
                {{ r.totalBeds || 2 }} Beds
              </span>
            </td>
          </ng-container>

          <!-- Occupied Beds Section Column -->
          <ng-container matColumnDef="occupiedBeds">
            <th mat-header-cell *matHeaderCellDef>Occupied Beds</th>
            <td mat-cell *matCellDef="let r">
              <span class="occupancy-pill" 
                [class.pill-full]="(r.occupiedBeds || 0) === r.totalBeds"
                [class.pill-occupied]="(r.occupiedBeds || 0) > 0 && (r.occupiedBeds || 0) < r.totalBeds"
                [class.pill-vacant]="(r.occupiedBeds || 0) === 0">
                <mat-icon class="pill-icon">people</mat-icon>
                {{ r.occupiedBeds || 0 }} / {{ r.totalBeds }} Occupied
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let r">
              <div class="action-btn-group">
                <button class="action-btn view-btn" title="View Allotted Residents" (click)="viewResidents(r)">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button class="action-btn edit-btn" title="Edit Room" (click)="openForm(r)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button class="action-btn delete-btn" title="Deactivate Room" (click)="deactivate(r.roomId!)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayed"></tr>
          <tr mat-row *matRowDef="let row; columns: displayed;" class="data-row"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .rooms-page {
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* ── Page Header ── */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .page-title {
      margin: 0;
      color: #013828;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .page-subtitle {
      margin: 0.25rem 0 0;
      color: #013828;
      font-size: 0.88rem;
    }

    /* ── Control Card ── */
    .control-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }

    .control-card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: #013828;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .control-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #015C3A;
    }

    .controls-body {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      gap: 1.25rem;
      flex: 1;
      flex-wrap: wrap;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 220px;
      flex: 1;
    }

    .input-group label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #4a5568;
    }

    .select-input, .search-input {
      padding: 0.6rem 0.85rem;
      font-size: 0.88rem;
      border: 1.5px solid #cbd5e0;
      border-radius: 8px;
      background: #ffffff;
      color: #1a202c;
      outline: none;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .select-input:focus, .search-input:focus {
      border-color: #015C3A;
      box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.12);
    }

    .btn-add-room {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.65rem 1.4rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      box-shadow: 0 2px 6px rgba(1, 92, 58, 0.2);
    }

    .btn-add-room:hover:not(:disabled) {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.35);
      transform: translateY(-1px);
    }

    .btn-add-room:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    /* ── Loading ── */
    .loading-bar {
      width: 100%;
      height: 3px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .loading-bar-inner {
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, #015C3A, #D4AF37);
      border-radius: 2px;
      animation: loadSlide 1.2s ease-in-out infinite;
    }

    @keyframes loadSlide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(350%); }
    }

    /* ── Empty State ── */
    .empty-state {
      text-align: center;
      padding: 3.5rem 1.5rem;
      background: #f7fafc;
      border: 2px dashed #cbd5e0;
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #a0aec0;
      margin-bottom: 0.5rem;
    }

    .empty-state h3 {
      margin: 0.5rem 0 0.25rem;
      color: #2d3748;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0 0 1.5rem;
      color: #718096;
      font-size: 0.9rem;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }

    .btn-action-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.65rem 1.4rem;
      font-size: 0.88rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    /* ── Table Wrapper ── */
    .table-wrapper {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      background: #ffffff;
    }

    .table-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background: #f7fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .record-count {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.82rem;
      font-weight: 600;
      color: #4a5568;
    }

    .record-count mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #015C3A;
    }

    .rooms-table {
      width: 100%;
    }

    :host ::ng-deep .mat-mdc-header-row {
      background: linear-gradient(135deg, #013828, #015C3A) !important;
    }

    :host ::ng-deep .mat-mdc-header-cell {
      color: #ddd22eff !important;
      font-weight: 700 !important;
      font-size: 0.85rem !important;
      letter-spacing: 0.3px;
      border-bottom: 2px solid #b7d8c4 !important;
    }

    :host ::ng-deep .mat-mdc-cell {
      font-size: 0.88rem;
      color: #2d3748;
      padding-top: 0.65rem;
      padding-bottom: 0.65rem;
    }

    .data-row {
      transition: background 0.15s ease;
    }

    :host ::ng-deep .data-row:hover {
      background: #f0faf4 !important;
    }

    /* ── Cell Styling ── */
    .block-badge {
      display: inline-block;
      padding: 0.2rem 0.7rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      background: #e8f5ef;
      color: #22543d;
    }

    .floor-text {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.85rem;
      color: #4a5568;
    }

    .cell-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #015C3A;
    }

    .room-number {
      font-weight: 700;
      color: #013828;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.9rem;
    }

    .beds-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.65rem;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 600;
      background: #edf2f7;
      color: #2d3748;
    }

    .badge-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #4a5568;
    }

    /* ── Occupancy Pill ── */
    .occupancy-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 700;
    }

    .pill-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .pill-full {
      background: #fff5f5;
      color: #c53030;
      border: 1px solid #fed7d7;
    }

    .pill-occupied {
      background: #e6fffa;
      color: #234e52;
      border: 1px solid #b2f5ea;
    }

    .pill-vacant {
      background: #edf2f7;
      color: #718096;
      border: 1px solid #e2e8f0;
    }

    /* ── Action Buttons ── */
    .action-btn-group {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .view-btn {
      background: #e6fffa;
      color: #234e52;
    }

    .view-btn:hover {
      background: #b2f5ea;
      color: #1d4044;
      box-shadow: 0 2px 6px rgba(35, 78, 82, 0.2);
    }

    .edit-btn {
      background: #ebf8ff;
      color: #2b6cb0;
    }

    .edit-btn:hover {
      background: #bee3f8;
      color: #2c5282;
      box-shadow: 0 2px 6px rgba(43, 108, 176, 0.2);
    }

    .delete-btn {
      background: #fff5f5;
      color: #e53e3e;
    }

    .delete-btn:hover {
      background: #fed7d7;
      color: #c53030;
      box-shadow: 0 2px 6px rgba(229, 62, 62, 0.2);
    }
  `]
})
export class RoomListComponent implements OnInit {
  private admin = inject(AdminService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  hostels: HostelDto[] = [
    { hostelId: 1, name: 'Marvi Girls Hostel', gender: 'Female', totalCapacity: 120, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 60, allotedRooms: 40, availableRooms: 20, amenities: [], images: [], isActive: true },
    { hostelId: 2, name: 'Post Graduate (P.G) Girls Hostel', gender: 'Female', totalCapacity: 150, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 75, allotedRooms: 50, availableRooms: 25, amenities: [], images: [], isActive: true },
    { hostelId: 3, name: 'Under Graduate (U.G) Girls Hostel', gender: 'Female', totalCapacity: 100, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 50, allotedRooms: 30, availableRooms: 20, amenities: [], images: [], isActive: true },
    { hostelId: 4, name: 'Federal Girls Hostel', gender: 'Female', totalCapacity: 100, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 50, allotedRooms: 30, availableRooms: 20, amenities: [], images: [], isActive: true },
    { hostelId: 5, name: 'Allama Iqbal Hostel', gender: 'Male', totalCapacity: 200, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 100, allotedRooms: 70, availableRooms: 30, amenities: [], images: [], isActive: true },
    { hostelId: 6, name: 'Shah Abdul Latif Hostel', gender: 'Male', totalCapacity: 180, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 90, allotedRooms: 60, availableRooms: 30, amenities: [], images: [], isActive: true },
    { hostelId: 7, name: 'Block A Boys Hostel', gender: 'Male', totalCapacity: 160, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 80, allotedRooms: 50, availableRooms: 30, amenities: [], images: [], isActive: true },
    { hostelId: 8, name: 'Block B Boys Hostel', gender: 'Male', totalCapacity: 160, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 80, allotedRooms: 50, availableRooms: 30, amenities: [], images: [], isActive: true },
    { hostelId: 9, name: 'Block C Boys Hostel', gender: 'Male', totalCapacity: 160, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 80, allotedRooms: 50, availableRooms: 30, amenities: [], images: [], isActive: true },
    { hostelId: 10, name: 'International Boys Hostel', gender: 'Male', totalCapacity: 120, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 60, allotedRooms: 40, availableRooms: 20, amenities: [], images: [], isActive: true },
    { hostelId: 11, name: 'Sindh University Model Hostel', gender: 'Male', totalCapacity: 100, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 50, allotedRooms: 30, availableRooms: 20, amenities: [], images: [], isActive: true },
    { hostelId: 12, name: 'Hyder Bux Jatoi Hostel', gender: 'Male', totalCapacity: 140, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 70, allotedRooms: 45, availableRooms: 25, amenities: [], images: [], isActive: true },
    { hostelId: 13, name: 'Rashdi Boys Hostel', gender: 'Male', totalCapacity: 150, address: 'Main Campus', description: '', eligibilityRequirement: '', totalRooms: 75, allotedRooms: 50, availableRooms: 25, amenities: [], images: [], isActive: true }
  ];

  rooms: RoomDto[] = [];
  displayed = ['block', 'floor', 'number', 'totalBeds', 'occupiedBeds', 'actions'];
  selectedHostelId: number | null = 1;
  searchQuery = '';
  loading = false;

  ngOnInit() {
    this.loadRooms();
    this.admin.getHostels().subscribe({
      next: (hList) => {
        if (hList && hList.length > 0) {
          this.hostels = hList;
          if (!this.hostels.some(h => Number(h.hostelId) === Number(this.selectedHostelId))) {
            this.selectedHostelId = Number(this.hostels[0].hostelId) || 1;
            this.loadRooms();
          }
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  onHostelChange(event?: any) {
    if (event && event.target && event.target.value) {
      this.selectedHostelId = Number(event.target.value);
    }
    this.loadRooms();
    this.cdr.detectChanges();
  }

  loadRooms() {
    if (!this.selectedHostelId) return;
    this.loading = true;
    this.cdr.detectChanges();

    const hId = Number(this.selectedHostelId);
    const mockRooms = this.generateFullRoomsListForHostel(hId);

    // Check localStorage first
    let storedRooms: RoomDto[] = [];
    try {
      const s = localStorage.getItem(`sdp_hostel_rooms_${hId}`);
      if (s) {
        storedRooms = JSON.parse(s);
        // Refresh stored rooms if they contain any 0-occupied rooms or lack resident cohorts
        if (storedRooms.some(r => !r.occupiedBeds || r.occupiedBeds === 0 || !r.residents || r.residents.length === 0)) {
          storedRooms = [];
        }
      }
    } catch (e) {}

    if (storedRooms && storedRooms.length >= 50) {
      this.rooms = storedRooms;
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    if (storedRooms && storedRooms.length > 0) {
      const existingNumbers = new Set(storedRooms.map(r => String(r.number).toLowerCase().trim()));
      const extra = mockRooms.filter(r => !existingNumbers.has(String(r.number).toLowerCase().trim()));
      this.rooms = [...storedRooms, ...extra];
    } else {
      this.rooms = mockRooms;
    }

    this.saveStoredRooms(hId, this.rooms);
    this.loading = false;
    this.cdr.detectChanges();
  }

  private saveStoredRooms(hostelId: number, rooms: RoomDto[]): void {
    try {
      localStorage.setItem(`sdp_hostel_rooms_${hostelId}`, JSON.stringify(rooms));
    } catch (e) {}
  }

  private generateFullRoomsListForHostel(hostelId: number): RoomDto[] {
    const roomsList: RoomDto[] = [];
    const blocks = ['Block A', 'Block B', 'Block C', 'Block D'];
    const bedCapacities = [2, 3, 4, 2, 4, 3, 6, 2, 4, 3, 2, 4, 6, 2, 3, 4];

    const maleFirst = ['Ali', 'Muhammad', 'Zubair', 'Bilal', 'Usman', 'Hamza', 'Tariq', 'Ahmed', 'Fahad', 'Saad', 'Asad', 'Owais', 'Shahzaib', 'Noman', 'Rashid', 'Waqas', 'Hassan', 'Hussain', 'Zayan', 'Danish', 'Sheraz', 'Kashif', 'Farhan', 'Imran', 'Kamran', 'Shoaib', 'Adnan'];
    const femaleFirst = ['Sara', 'Fatima', 'Ayesha', 'Zainab', 'Mariam', 'Sana', 'Hira', 'Laiba', 'Anum', 'Khadija', 'Dua', 'Iqra', 'Mehreen', 'Bisma', 'Nimra', 'Mahnoor', 'Sadia', 'Syeda', 'Sidra', 'Tayyaba', 'Areeba', 'Bushra', 'Kinza', 'Nida'];
    const lastNames = ['Raza', 'Khan', 'Ali', 'Ahmed', 'Tariq', 'Bibi', 'Hassan', 'Shah', 'Sheikh', 'Soomro', 'Junejo', 'Talpur', 'Kalhoro', 'Mangi', 'Syed', 'Solangi', 'Abro', 'Mahar', 'Chandio', 'Bhutto', 'Laghari', 'Khoso'];

    // Cohorts pool: Same department, program, batch, year for each room cohort
    const departmentPool = [
      { name: 'Software Engineering', code: 'SWE' },
      { name: 'Computer Science', code: 'CS' },
      { name: 'Information Technology', code: 'IT' },
      { name: 'Business Administration', code: 'BBA' },
      { name: 'Electrical Engineering', code: 'EE' },
      { name: 'Civil Engineering', code: 'CE' },
      { name: 'Physics', code: 'PHY' },
      { name: 'Law', code: 'LAW' },
      { name: 'Pharmacy', code: 'PHARM' },
      { name: 'Economics', code: 'ECO' },
      { name: 'Mathematics', code: 'MATH' },
      { name: 'English Literature', code: 'ENG' }
    ];

    const isFemaleHostel = hostelId <= 4;
    const isPostGraduateHostel = hostelId === 2;

    let roomCounter = 1;

    for (let floor = 1; floor <= 5; floor++) {
      for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
        const blockName = blocks[bIdx];
        const blockLetter = blockName.charAt(6);
        for (let seq = 1; seq <= 3; seq++) {
          const roomNum = `${blockLetter}-${floor}0${seq}`;
          const totalBeds = bedCapacities[(hostelId * 7 + roomCounter) % bedCapacities.length];
          
          // Guarantee 1 to totalBeds occupied beds (NEVER 0!)
          const occupiedCount = ((hostelId * 3 + roomCounter * 7) % totalBeds) + 1;

          // Pick ONE specific Academic Cohort for ALL residents in this room
          const cohortIdx = (hostelId * 11 + roomCounter) % departmentPool.length;
          const deptObj = departmentPool[cohortIdx];
          
          let program = 'BS';
          let batchYear = 2022 + ((hostelId + roomCounter) % 4);
          
          if (isPostGraduateHostel) {
            program = (roomCounter % 2 === 0) ? 'MS' : 'PhD';
            batchYear = 2024 + (roomCounter % 2);
          }

          const residents: RoomResidentDto[] = [];
          for (let b = 1; b <= occupiedCount; b++) {
            const seed = hostelId * 1000 + roomCounter * 10 + b;
            const fName = isFemaleHostel ? femaleFirst[seed % femaleFirst.length] : maleFirst[seed % maleFirst.length];
            const lName = lastNames[seed % lastNames.length];
            
            const rollSeq = String((b * 12 + roomCounter * 3) % 85 + 10).padStart(3, '0');
            const rollNo = `${deptObj.code}-${program}-${String(batchYear).slice(2)}-${rollSeq}`;

            residents.push({
              residentId: seed,
              name: `${fName} ${lName}`,
              rollNo: rollNo,
              cnic: `41304-${1000000 + (seed * 173) % 8999999}-${(seed % 9) + 1}`,
              department: deptObj.name,
              batch: `${batchYear}`,
              bedNo: `Bed ${b}`,
              phone: `0300-${2000000 + (seed * 4321) % 7999999}`
            });
          }

          roomsList.push({
            roomId: hostelId * 1000 + roomCounter,
            hostelId: hostelId,
            number: roomNum,
            block: blockName,
            floor: floor,
            totalBeds: totalBeds,
            occupiedBeds: occupiedCount,
            residents: residents,
            isActive: true
          });

          roomCounter++;
          if (roomsList.length >= 50) break;
        }
        if (roomsList.length >= 50) break;
      }
      if (roomsList.length >= 50) break;
    }

    return roomsList;
  }

  get filteredRooms(): RoomDto[] {
    if (!this.searchQuery.trim()) return this.rooms;
    const q = this.searchQuery.toLowerCase().trim();
    return this.rooms.filter(r =>
      (r.number && r.number.toString().toLowerCase().includes(q)) ||
      (r.block && r.block.toLowerCase().includes(q)) ||
      (r.floor && r.floor.toString().includes(q))
    );
  }

  getSelectedHostelName(): string {
    const found = this.hostels.find(h => h.hostelId === this.selectedHostelId);
    return found ? found.name : 'Selected Hostel';
  }

  viewResidents(room: RoomDto) {
    this.dialog.open(RoomResidentsDialogComponent, {
      width: '680px',
      data: { room, hostelName: this.getSelectedHostelName() }
    });
  }

  openForm(room?: RoomDto) {
    if (!this.selectedHostelId) {
      this.snack.open('Please select a hostel first', 'OK', { duration: 3000 });
      return;
    }
    const ref = this.dialog.open(RoomFormComponent, {
      width: '540px',
      data: { room, hostelId: this.selectedHostelId }
    });

    ref.afterClosed().subscribe((res: any) => {
      if (res && typeof res === 'object') {
        const hId = Number(this.selectedHostelId);

        if (room && (room.roomId || room.number)) {
          // Edit room
          this.rooms = this.rooms.map(r => {
            if ((room.roomId && r.roomId === room.roomId) || (room.number && r.number === room.number)) {
              return { ...r, ...res };
            }
            return r;
          });
        } else {
          // Add room
          const newRoom: RoomDto = {
            ...res,
            roomId: Date.now(),
            hostelId: hId,
            occupiedBeds: 1,
            residents: []
          };
          this.rooms = [newRoom, ...this.rooms];
        }

        this.saveStoredRooms(hId, this.rooms);
        this.snack.open(`✅ Room ${room ? 'updated' : 'created'} successfully!`, 'OK', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  deactivate(id: number) {
    if (!this.selectedHostelId) return;
    if (confirm('Are you sure you want to deactivate this room?')) {
      const hId = Number(this.selectedHostelId);
      this.rooms = this.rooms.filter(r => r.roomId !== id);
      this.saveStoredRooms(hId, this.rooms);
      this.snack.open('✅ Room deactivated', 'OK', { duration: 3000 });
      this.cdr.detectChanges();
    }
  }
}
