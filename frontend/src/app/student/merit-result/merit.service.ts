// =============================================================
// student/merit-result/merit.service.ts
// =============================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export interface FinalChallanDto {
  challanId: number;
  challanNumber: string;
  amount: number;
  status: string;
  generatedAt: string;
  expiresAt: string;
  isExpired: boolean;
  allocatedHostel?: string;
  allocatedRoom?: string;
  allocatedBed?: string;
}

export interface ChallanListDto {
  processingFeeChallan?: FinalChallanDto;
  finalHostelChallan?: FinalChallanDto;
}

export interface MeritResultDto {
  meritId: number;
  applicationId: number;
  studentName: string;
  rollNumber: string;
  department: string;
  program: string;
  academicYear: string;
  gender: string;
  district: string;
  cpn: number;
  cgpa?: number;
  meritScore: number;
  meritRank: number;
  totalApplicants: number;
  isEligible: boolean;
  allocationStatus: string;
  applicationStatus: string;
  preferredHostel?: string;
  allocatedHostel?: string;
  allocatedRoom?: string;
  allocatedBed?: string;
  finalChallan?: FinalChallanDto;
}

const MOCK_MERIT_RESULT: MeritResultDto = {
  meritId: 101,
  applicationId: 101,
  studentName: 'Ali Ahmed',
  rollNumber: '2K21/CSM/01',
  department: 'Computer Science',
  program: 'BS Computer Science',
  academicYear: '2025-2026',
  gender: 'Male',
  district: 'Hyderabad',
  cpn: 84.5,
  cgpa: 3.75,
  meritScore: 84.5,
  meritRank: 4,
  totalApplicants: 142,
  isEligible: true,
  allocationStatus: 'Allocated',
  applicationStatus: 'Submitted',
  preferredHostel: 'Lal Shahbaz Hostel',
  allocatedHostel: 'Lal Shahbaz Hostel',
  allocatedRoom: '101',
  allocatedBed: 'Bed-1',
  finalChallan: {
    challanId: 701,
    challanNumber: 'CH-HOSTEL-001-2025',
    amount: 25000,
    status: 'Unpaid',
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isExpired: false,
    allocatedHostel: 'Lal Shahbaz Hostel',
    allocatedRoom: '101',
    allocatedBed: 'Bed-1',
  }
};

const MOCK_CHALLANS: ChallanListDto = {
  processingFeeChallan: {
    challanId: 501,
    challanNumber: 'CH-2026-0091',
    amount: 100,
    status: 'Paid',
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isExpired: false,
  },
  finalHostelChallan: MOCK_MERIT_RESULT.finalChallan,
};

@Injectable({ providedIn: 'root' })
export class MeritService {
  private http = inject(HttpClient);
  private api  = `${environment.apiBaseUrl}`;

  getMeritResult(): Observable<MeritResultDto> {
    return this.http.get<MeritResultDto>(`${this.api}/students/merit-result`).pipe(
      catchError(() => of(MOCK_MERIT_RESULT))
    );
  }

  getChallans(): Observable<ChallanListDto> {
    return this.http.get<ChallanListDto>(`${this.api}/payments/challans`).pipe(
      catchError(() => of(MOCK_CHALLANS))
    );
  }
}
