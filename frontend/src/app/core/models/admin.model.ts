// src/app/core/models/admin.model.ts
export interface DashboardStats {
  totalStudents: number;
  totalResidents: number;
  totalApplicants: number;
  availableSeats: number;
  pendingApplications: number;
  pendingPayments: number;
  roomChangeRequests: number;
  openComplaints: number;
}

export interface AllocationStatusDto {
  open: boolean;
  deadline?: string; // ISO date string
}

export interface HostelDto {
  hostelId?: number;
  name: string;
  gender: 'Male' | 'Female';
  address: string;
  description?: string;
  totalCapacity?: number;
  totalRooms?: number;
  allotedRooms?: number;
  availableRooms?: number;
  amenities?: string[];
  images?: string[];
  eligibilityRequirement?: string;
  isActive?: boolean;
}

export interface RoomResidentDto {
  residentId?: number;
  name: string;
  rollNo: string;
  cnic: string;
  department: string;
  batch: string;
  bedNo: string;
  allocatedDate?: string;
  phone?: string;
  gender?: string;
}

export interface RoomDto {
  roomId?: number;
  hostelId?: number;
  block: string;
  floor: number;
  number: string;
  totalBeds: number;
  occupiedBeds?: number;
  residents?: RoomResidentDto[];
  isActive?: boolean;
  isUnderMaintenance?: boolean;
}

export interface EligibilityRuleDto {
  ruleId?: number;
  field: string;
  operator: string;
  value: any;
}

export interface StudentDto {
  studentId?: number;
  cnic: string;
  rollNumber: string;
  name: string;
  department: string;
  academicYear: string;
  district: string;
  gender: string;
}

export interface ResidentDto {
  residentId?: number;
  studentId: number;
  studentName?: string;
  cnic?: string;
  rollNumber?: string;
  department?: string;
  district?: string;
  gender?: string;
  hostelId: number;
  hostelName?: string;
  block: string;
  room: string;
  bed: string;
  academicYear?: string;
  annualFeeStatus?: 'Paid' | 'Pending' | 'Unpaid';
  annualFeeAmount?: number;
  status: string;
}

export interface RoomHistoryDto {
  historyId?: number;
  date: string;
  hostel: string;
  block: string;
  room: string;
  bed: string;
  action: string;
  status: string;
}

export interface ApplicationDto {
  applicationId?: number;
  studentId: number;
  hostelId: number;
  preferenceOrder: number;
  status: string;
}

export interface MeritResultDto {
  rank: number;
  studentId: number;
  meritScore: number;
  allocatedHostelId?: number;
}

export interface AdminSettingsDto {
  sindhProvinceFee: number;
  otherProvincesFee: number;
  internationalStudentsFee: number;
  processingFee: number;
  hostelFee?: number;
  applicationDeadline: string | null;
  allocationOpen: boolean;
  academicYear: string;
  meritRules?: any;
  notificationSettings?: any;
  emailConfig?: any;
}
