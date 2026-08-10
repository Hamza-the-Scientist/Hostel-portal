// ============================================================
// models/application.model.ts — Application & Allocation models
// ============================================================

export interface Application {
  applicationId: number;
  studentId: number;
  academicYearId: number;
  academicYearLabel: string;
  status: ApplicationStatus;
  submittedAt: string;
  preferences: ApplicationHostelPreference[];
}

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'UnderReview'
  | 'MeritListed'
  | 'Approved'
  | 'Rejected'
  | 'Withdrawn'
  | 'WaitingList';

export interface ApplicationHostelPreference {
  prefId: number;
  applicationId: number;
  hostelId: number;
  hostelName: string;
  preferenceOrder: number;
}

export interface ApplicationStatusHistory {
  historyId: number;
  applicationId: number;
  oldStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  remarks?: string;
  changedAt: string;
}

export interface MeritResult {
  meritId: number;
  applicationId: number;
  meritScore: number;
  meritRank: number;
  isFinalized: boolean;
}

export interface Allocation {
  allocationId: number;
  applicationId: number;
  studentId: number;
  bedId: number;
  bedLabel: string;
  roomNumber: string;
  blockName: string;
  hostelName: string;
  isActive: boolean;
  allocatedAt: string;
}
