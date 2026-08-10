// =============================================================
// student/merit-result/merit.service.ts
// =============================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class MeritService {
  private http = inject(HttpClient);
  private api  = `${environment.apiBaseUrl}`;

  getMeritResult(): Observable<MeritResultDto> {
    return this.http.get<MeritResultDto>(`${this.api}/students/merit-result`);
  }

  getChallans(): Observable<ChallanListDto> {
    return this.http.get<ChallanListDto>(`${this.api}/payments/challans`);
  }
}
