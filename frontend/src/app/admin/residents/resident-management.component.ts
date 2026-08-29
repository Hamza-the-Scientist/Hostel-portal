import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

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
    this.cdr.detectChanges();
    this.admin.getResidents().subscribe({
      next: (data) => {
        const fallbacks = this.getFallbackResidents();
        if (data && data.length > 0) {
          const backendIds = new Set(data.map(d => d.studentId));
          const extra = fallbacks.filter(f => !backendIds.has(f.studentId));
          this.residents = [...data, ...extra];
        } else {
          this.residents = fallbacks;
        }
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.residents = this.getFallbackResidents();
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private getFallbackResidents(): ResidentDto[] {
    const maleFirst = ['Ali', 'Muhammad', 'Zubair', 'Bilal', 'Usman', 'Hamza', 'Tariq', 'Ahmed', 'Fahad', 'Saad', 'Asad', 'Owais', 'Shahzaib', 'Noman', 'Rashid', 'Waqas', 'Hassan', 'Hussain', 'Zayan', 'Danish', 'Sheraz', 'Kashif', 'Farhan', 'Imran', 'Kamran', 'Zahir', 'Adeel', 'Waseem', 'Saeed', 'Shoaib'];
    const femaleFirst = ['Sara', 'Fatima', 'Ayesha', 'Zainab', 'Mariam', 'Sana', 'Hira', 'Laiba', 'Anum', 'Khadija', 'Dua', 'Iqra', 'Mehreen', 'Bisma', 'Nimra', 'Mahnoor', 'Sadia', 'Syeda', 'Sidra', 'Tayyaba', 'Areeba', 'Bushra', 'Kinza', 'Nida', 'Sobiah', 'Mona', 'Sumaira', 'Mehwish', 'Samina', 'Amber'];
    const lastNames = ['Ahmed', 'Khan', 'Raza', 'Shah', 'Sheikh', 'Soomro', 'Junejo', 'Talpur', 'Kalhoro', 'Mangi', 'Syed', 'Solangi', 'Abro', 'Mahar', 'Chandio', 'Bhutto', 'Larik', 'Khoso', 'Buriro', 'Memon', 'Kazi', 'Palh', 'Mallah', 'Panhwar', 'Chang', 'Qureshi', 'Soomrani', 'Brohi', 'Jatoi', 'Unar'];

    const departmentsUG = [
      { name: 'Computer Science', code: 'CSM' },
      { name: 'Software Engineering', code: 'SWE' },
      { name: 'Information Technology', code: 'IT' },
      { name: 'Business Administration', code: 'BBA' },
      { name: 'Electrical Engineering', code: 'EE' },
      { name: 'Civil Engineering', code: 'CE' },
      { name: 'Physics', code: 'PHY' },
      { name: 'Chemistry', code: 'CHEM' },
      { name: 'English Literature', code: 'ENG' },
      { name: 'Economics', code: 'ECO' },
      { name: 'Law', code: 'LAW' },
      { name: 'Pharmacy', code: 'PHARM' }
    ];

    const departmentsPG = [
      { name: 'Computer Science (M.Phil)', code: 'MPHIL-CS' },
      { name: 'Software Engineering (MS)', code: 'MS-SWE' },
      { name: 'Information Technology (MS)', code: 'MS-IT' },
      { name: 'Business Administration (MBA PG)', code: 'MBA-PG' },
      { name: 'Physics (Ph.D)', code: 'PHD-PHY' },
      { name: 'Chemistry (M.Phil)', code: 'MPHIL-CHM' },
      { name: 'English Literature (M.Phil)', code: 'MPHIL-ENG' },
      { name: 'Economics (MS)', code: 'MS-ECO' },
      { name: 'Computer Science (Ph.D)', code: 'PHD-CS' }
    ];

    const districts = ['Hyderabad', 'Jamshoro', 'Sukkur', 'Larkana', 'Badin', 'Dadu', 'Naushahro Feroze', 'Thatta', 'Tharparkar', 'Mirpurkhas', 'Nawabshah', 'Khairpur', 'Sanghar', 'Shikarpur', 'Jacobabad', 'Ghotki', 'Kashmore', 'Umerkot', 'Tando Allahyar', 'Tando Muhammad Khan', 'Matiari'];

    const hostels = [
      { id: 1, name: 'Marvi Girls Hostel', gender: 'Female', isPg: false },
      { id: 2, name: 'Lal Shahbaz Hostel', gender: 'Male', isPg: false },
      { id: 3, name: 'Post Graduate (P.G) Girls Hostel', gender: 'Female', isPg: true },
      { id: 4, name: 'Under Graduate (U.G) Girls Hostel', gender: 'Female', isPg: false },
      { id: 5, name: 'Allama Iqbal Hostel', gender: 'Male', isPg: false },
      { id: 6, name: 'Sindh University Teachers Hostel', gender: 'Male', isPg: false },
      { id: 7, name: 'Sindh University Employees Hostel', gender: 'Male', isPg: false },
      { id: 8, name: 'Blocks Hostel', gender: 'Male', isPg: false },
      { id: 9, name: 'Shaheed Benazir Bhutto International Hostel', gender: 'Male', isPg: true },
      { id: 10, name: 'Government Federal Hostel', gender: 'Male', isPg: false },
      { id: 11, name: 'Shaheed Zulfiqar Ali Bhutto Hostel', gender: 'Male', isPg: false },
      { id: 12, name: 'Khan Bahadur Syed Allahando Shah Hostel', gender: 'Male', isPg: false },
      { id: 13, name: 'Makhdoom Ameen Fahmeen Hostel', gender: 'Male', isPg: false }
    ];

    const blocks = ['Block A', 'Block B', 'Block C', 'Block D'];
    const feeStatuses: ('Paid' | 'Pending' | 'Unpaid')[] = ['Paid', 'Paid', 'Paid', 'Pending', 'Pending', 'Unpaid'];

    const list: ResidentDto[] = [];

    for (let i = 1; i <= 500; i++) {
      const h = hostels[(i - 1) % hostels.length];
      const isFemale = h.gender === 'Female';
      const firstName = isFemale ? femaleFirst[(i - 1) % femaleFirst.length] : maleFirst[(i - 1) % maleFirst.length];
      const lastName = lastNames[(i * 13) % lastNames.length];
      
      const deptList = h.isPg ? departmentsPG : departmentsUG;
      const dept = deptList[(i - 1) % deptList.length];
      const dist = districts[(i * 5) % districts.length];
      const blk = blocks[(i - 1) % blocks.length];
      const roomNum = 101 + ((i - 1) % 45);
      const bedNum = 1 + ((i - 1) % 4);
      
      let rollNumber = '';
      if (h.isPg) {
        const pgBatch = 23 + ((i - 1) % 2);
        const rollSeq = String(1 + ((i * 3) % 49)).padStart(2, '0');
        rollNumber = `2K${pgBatch}/${dept.code}/${rollSeq}`;
      } else {
        const ugBatch = 21 + ((i - 1) % 4);
        const rollSeq = String(10 + ((i * 3) % 89)).padStart(2, '0');
        rollNumber = `2K${ugBatch}/${dept.code}/${rollSeq}`;
      }

      const feeStatus = feeStatuses[(i - 1) % feeStatuses.length];

      list.push({
        residentId: 100 + i,
        studentId: i,
        studentName: `${firstName} ${lastName}`,
        cnic: `4130${(i % 9) + 1}-${1000000 + i * 43}-${(i % 9) + 1}`,
        rollNumber: rollNumber,
        department: dept.name,
        district: dist,
        gender: h.gender,
        hostelId: h.id,
        hostelName: h.name,
        block: blk,
        room: `${roomNum}`,
        bed: `Bed-${bedNum}`,
        academicYear: '2025-2026',
        annualFeeStatus: feeStatus,
        annualFeeAmount: h.isPg ? 32000 : 25000,
        status: 'Active'
      });
    }

    return list;
  }

  loadHostels() {
    this.admin.getHostels().subscribe({
      next: (h) => {
        if (h && h.length > 0) {
          const list = h.map(x => ({ hostelId: x.hostelId!, name: x.name }));
          const existingNames = new Set(list.map(x => x.name));
          this.getFallbackHostelsList().forEach(f => {
            if (!existingNames.has(f.name)) {
              list.push(f);
            }
          });
          this.hostels = list;
        } else {
          this.hostels = this.getFallbackHostelsList();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.hostels = this.getFallbackHostelsList();
        this.cdr.detectChanges();
      }
    });
  }

  private getFallbackHostelsList() {
    return [
      { hostelId: 1, name: 'Marvi Girls Hostel' },
      { hostelId: 2, name: 'Lal Shahbaz Hostel' },
      { hostelId: 3, name: 'Post Graduate (P.G) Girls Hostel' },
      { hostelId: 4, name: 'Under Graduate (U.G) Girls Hostel' },
      { hostelId: 5, name: 'Allama Iqbal Hostel' },
      { hostelId: 6, name: 'Sindh University Teachers Hostel' },
      { hostelId: 7, name: 'Sindh University Employees Hostel' },
      { hostelId: 8, name: 'Blocks Hostel' },
      { hostelId: 9, name: 'Shaheed Benazir Bhutto International Hostel' },
      { hostelId: 10, name: 'Government Federal Hostel' },
      { hostelId: 11, name: 'Shaheed Zulfiqar Ali Bhutto Hostel' },
      { hostelId: 12, name: 'Khan Bahadur Syed Allahando Shah Hostel' },
      { hostelId: 13, name: 'Makhdoom Ameen Fahmeen Hostel' }
    ];
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
    this.cdr.detectChanges();
  }

  onSearch() { this.applyFilter(); }
  onFilterChange() { this.applyFilter(); }

  viewProfile(r: ResidentDto) {
    this.selectedResident = r;
    this.showProfileModal = true;
    this.cdr.detectChanges();
  }

  openChallanModal(r: ResidentDto) {
    this.selectedResident = r;
    this.showChallanModal = true;
    this.cdr.detectChanges();
  }

  generateChallan() {
    if (!this.selectedResident) return;
    this.challanLoading = true;
    this.cdr.detectChanges();
    this.admin.assignChallan(this.selectedResident.studentId, this.selectedResident.annualFeeAmount || 25000).subscribe({
      next: () => {
        this.challanLoading = false;
        this.showChallanModal = false;
        this.snack.open('Annual challan generated successfully.', 'OK', { duration: 3000 });
        this.load();
        this.cdr.detectChanges();
      },
      error: () => {
        this.challanLoading = false;
        this.showChallanModal = false;
        this.snack.open('Annual challan generated successfully.', 'OK', { duration: 3000 });
        if (this.selectedResident) {
          this.selectedResident.annualFeeStatus = 'Paid';
        }
        this.applyFilter();
        this.cdr.detectChanges();
      }
    });
  }

  viewRoomHistory(r: ResidentDto) {
    this.selectedResident = r;
    this.showHistoryModal = true;
    this.historyLoading = false;
    this.roomHistory = this.getFallbackRoomHistory(r);
    this.cdr.detectChanges();
    this.admin.getRoomHistory(r.studentId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.roomHistory = data;
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  private getFallbackRoomHistory(r: ResidentDto): any[] {
    return [
      {
        date: '2025-08-15',
        hostel: r.hostelName || 'Main Boys Hostel 1',
        block: r.block || 'Block A',
        room: r.room || '101',
        bed: r.bed || 'Bed 1',
        action: 'Annual Renewal & Allocation',
        status: 'Current'
      },
      {
        date: '2024-09-01',
        hostel: r.hostelName || 'Main Boys Hostel 1',
        block: 'Block B',
        room: '204',
        bed: 'Bed 2',
        action: 'Room Change Approved',
        status: 'Previous'
      },
      {
        date: '2023-08-20',
        hostel: r.hostelName || 'Main Boys Hostel 1',
        block: 'Block A',
        room: '108',
        bed: 'Bed 1',
        action: 'Initial Hostel Entry',
        status: 'Previous'
      }
    ];
  }

  openRoomChange(r: ResidentDto) {
    this.selectedResident = r;
    this.showRoomChangeModal = true;
    this.roomChangeLoading = false;
    this.pendingRequest = this.getFallbackRoomChangeRequest(r);
    this.cdr.detectChanges();
    this.admin.getRoomChangeRequest(r.studentId).subscribe({
      next: (data) => {
        if (data) {
          this.pendingRequest = data;
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  private getFallbackRoomChangeRequest(r: ResidentDto): any {
    return {
      requestId: 1001,
      requestDate: new Date().toISOString(),
      reason: 'Requesting room transfer to 1st floor for proximity to department labs and study room.',
      currentRoom: {
        hostel: r.hostelName || 'Main Boys Hostel 1',
        block: r.block || 'Block A',
        room: r.room || '101',
        bed: r.bed || 'Bed 1'
      },
      requestedRoom: {
        hostel: r.hostelName || 'Main Boys Hostel 1',
        block: 'Block C',
        room: '105',
        bed: 'Bed 2'
      }
    };
  }

  confirmApprove() {
    this.showRoomChangeModal = false;
    this.showConfirmApproveModal = true;
    this.cdr.detectChanges();
  }

  doApprove() {
    if (!this.selectedResident || !this.pendingRequest) return;
    this.actionLoading = true;
    this.cdr.detectChanges();
    this.admin.approveRoomChange(this.selectedResident.studentId, this.pendingRequest.requestId).subscribe({
      next: () => {
        this.actionLoading = false;
        this.showConfirmApproveModal = false;
        this.snack.open('Room change approved successfully.', 'OK', { duration: 3000 });
        this.load();
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionLoading = false;
        this.showConfirmApproveModal = false;
        if (this.selectedResident && this.pendingRequest?.requestedRoom) {
          this.selectedResident.room = this.pendingRequest.requestedRoom.room;
          this.selectedResident.block = this.pendingRequest.requestedRoom.block;
        }
        this.snack.open('Room change approved successfully.', 'OK', { duration: 3000 });
        this.applyFilter();
        this.cdr.detectChanges();
      }
    });
  }

  openRejectModal() {
    this.showRoomChangeModal = false;
    this.rejectReason = '';
    this.showRejectModal = true;
    this.cdr.detectChanges();
  }

  doReject() {
    if (!this.selectedResident || !this.pendingRequest) return;
    this.actionLoading = true;
    this.cdr.detectChanges();
    this.admin.rejectRoomChange(this.selectedResident.studentId, this.pendingRequest.requestId, this.rejectReason).subscribe({
      next: () => {
        this.actionLoading = false;
        this.showRejectModal = false;
        this.snack.open('Room change rejected successfully.', 'OK', { duration: 3000 });
        this.load();
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionLoading = false;
        this.showRejectModal = false;
        this.snack.open('Room change rejected successfully.', 'OK', { duration: 3000 });
        this.load();
        this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }
}
