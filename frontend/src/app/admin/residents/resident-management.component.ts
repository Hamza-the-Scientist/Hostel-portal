import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../core/admin/admin.service';
import { ResidentDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-resident-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './resident-management.component.html',
  styleUrls: ['./resident-management.component.css']
})
export class ResidentManagementComponent implements OnInit {
  private admin = inject(AdminService);
  private snack = inject(MatSnackBar);

  residents: ResidentDto[] = [];
  filtered: ResidentDto[] = [];
  hostels: { hostelId: number; name: string }[] = [];
  loading = false;
  searchTerm = '';
  filterHostel = 'all';
  filterFeeStatus = 'all';

  // Modals
  showProfileModal = false;
  showChallanModal = false;
  showHistoryModal = false;
  showRoomChangeModal = false;
  showConfirmApproveModal = false;
  showRejectModal = false;

  selectedResident: ResidentDto | null = null;
  roomHistory: any[] = [];
  pendingRequest: any = null;
  challanLoading = false;
  actionLoading = false;
  rejectReason = '';
  historyLoading = false;
  roomChangeLoading = false;

  ngOnInit() { this.load(); this.loadHostels(); }

  load() {
    this.loading = true;
    this.admin.getResidents().subscribe({
      next: (data) => {
        this.residents = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.snack.open('Unable to load current residents. Please try again.', 'Close', { duration: 4000 });
        this.loading = false;
      }
    });
  }

  loadHostels() {
    this.admin.getHostels().subscribe({
      next: (h) => { this.hostels = h.map(x => ({ hostelId: x.hostelId!, name: x.name })); },
      error: () => { }
    });
  }

  applyFilter() {
    let list = [...this.residents];
    const q = this.searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter(r =>
        r.studentName?.toLowerCase().includes(q) ||
        r.rollNumber?.toLowerCase().includes(q) ||
        r.cnic?.toLowerCase().includes(q) ||
        r.hostelName?.toLowerCase().includes(q) ||
        r.room?.toLowerCase().includes(q) ||
        String(r.studentId).includes(q)
      );
    }
    if (this.filterHostel !== 'all') {
      list = list.filter(r => String(r.hostelId) === this.filterHostel);
    }
    if (this.filterFeeStatus !== 'all') {
      list = list.filter(r => r.annualFeeStatus === this.filterFeeStatus);
    }
    this.filtered = list;
  }

  onSearch() { this.applyFilter(); }
  onFilterChange() { this.applyFilter(); }

  viewProfile(r: ResidentDto) {
    this.selectedResident = r;
    this.showProfileModal = true;
  }

  openChallanModal(r: ResidentDto) {
    this.selectedResident = r;
    this.showChallanModal = true;
  }

  generateChallan() {
    if (!this.selectedResident) return;
    this.challanLoading = true;
    this.admin.assignChallan(this.selectedResident.studentId, this.selectedResident.annualFeeAmount || 25000).subscribe({
      next: () => {
        this.challanLoading = false;
        this.showChallanModal = false;
        this.snack.open('Annual challan generated successfully.', 'OK', { duration: 3000 });
        this.load();
      },
      error: (err) => {
        this.challanLoading = false;
        const msg = err?.error?.message || 'Unable to generate annual challan. Please try again.';
        this.snack.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  viewRoomHistory(r: ResidentDto) {
    this.selectedResident = r;
    this.showHistoryModal = true;
    this.historyLoading = true;
    this.roomHistory = [];
    this.admin.getRoomHistory(r.studentId).subscribe({
      next: (data) => { this.roomHistory = data; this.historyLoading = false; },
      error: () => { this.historyLoading = false; this.snack.open('Unable to load room history.', 'Close', { duration: 3000 }); }
    });
  }

  openRoomChange(r: ResidentDto) {
    this.selectedResident = r;
    this.pendingRequest = null;
    this.showRoomChangeModal = true;
    this.roomChangeLoading = true;
    this.admin.getRoomChangeRequest(r.studentId).subscribe({
      next: (data) => { this.pendingRequest = data; this.roomChangeLoading = false; },
      error: () => { this.roomChangeLoading = false; this.snack.open('Unable to load room change request.', 'Close', { duration: 3000 }); }
    });
  }

  confirmApprove() {
    this.showRoomChangeModal = false;
    this.showConfirmApproveModal = true;
  }

  doApprove() {
    if (!this.selectedResident || !this.pendingRequest) return;
    this.actionLoading = true;
    this.admin.approveRoomChange(this.selectedResident.studentId, this.pendingRequest.requestId).subscribe({
      next: () => {
        this.actionLoading = false;
        this.showConfirmApproveModal = false;
        this.snack.open('Room change approved successfully.', 'OK', { duration: 3000 });
        this.load();
      },
      error: (err) => {
        this.actionLoading = false;
        this.snack.open(err?.error?.message || 'Unable to process room change. Please try again.', 'Close', { duration: 4000 });
      }
    });
  }

  openRejectModal() {
    this.showRoomChangeModal = false;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  doReject() {
    if (!this.selectedResident || !this.pendingRequest) return;
    this.actionLoading = true;
    this.admin.rejectRoomChange(this.selectedResident.studentId, this.pendingRequest.requestId, this.rejectReason).subscribe({
      next: () => {
        this.actionLoading = false;
        this.showRejectModal = false;
        this.snack.open('Room change rejected successfully.', 'OK', { duration: 3000 });
        this.load();
      },
      error: () => {
        this.actionLoading = false;
        this.snack.open('Unable to process rejection. Please try again.', 'Close', { duration: 4000 });
      }
    });
  }

  closeAll() {
    this.showProfileModal = false;
    this.showChallanModal = false;
    this.showHistoryModal = false;
    this.showRoomChangeModal = false;
    this.showConfirmApproveModal = false;
    this.showRejectModal = false;
  }
}
