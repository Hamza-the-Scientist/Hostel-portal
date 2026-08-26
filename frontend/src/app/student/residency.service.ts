// ============================================================
// student/residency.service.ts — Residency & Room Change API
// Falls back to rich mock data when backend is unavailable
// ============================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface ProcessingFeeChallan {
  feeId: number;
  challanNumber: string;
  amount: number;
  status: string;
  createdAt: string;
  dueDate: string;
}

export interface StudentResidencyDto {
  isExistingResident: boolean;
  residentId?: number;
  residencyStatus: string;
  hostelName: string;
  blockName: string;
  roomNumber: string;
  bedLabel: string;
  checkInDate?: string;
  annualFeeStatus: string;
  annualChallan?: ProcessingFeeChallan;
  canRequestRoomChange: boolean;
  allowFreshApplication: boolean;
}

export interface RoomChangeRequestDto {
  requestId: number;
  residentId: number;
  currentHostelRoom: string;
  preferredBlock?: string;
  reason: string;
  additionalDetails?: string;
  attachmentUrl?: string;
  status: string;
  adminRemarks?: string;
  createdAt: string;
}

export interface VerifyPaymentRequest {
  feeId: number;
  transactionReference: string;
  paymentMethod: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_RESIDENCY: StudentResidencyDto = {
  isExistingResident: true,
  residentId: 1,
  residencyStatus: 'Active',
  hostelName: 'Allama Iqbal Hostel',
  blockName: 'Block A',
  roomNumber: '204',
  bedLabel: 'Bed-2',
  checkInDate: '2024-09-01',
  annualFeeStatus: 'paid',
  annualChallan: undefined,
  canRequestRoomChange: true,
  allowFreshApplication: false,
};

const MOCK_ROOM_CHANGE_REQUESTS: RoomChangeRequestDto[] = [
  // {
  //   requestId: 1,
  //   residentId: 1,
  //   currentHostelRoom: 'Allama Iqbal Hostel — Block A, Room 204',
  //   preferredBlock: 'Block B',
  //   reason: 'Room is too far from the study hall. I need a quieter environment closer to the library.',
  //   additionalDetails: 'Any room on the 1st floor of Block B would be preferred.',
  //   status: 'Under Review',
  //   adminRemarks: undefined,
  //   createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  // },
  // {
  //   requestId: 2,
  //   residentId: 1,
  //   currentHostelRoom: 'Allama Iqbal Hostel — Block A, Room 204',
  //   preferredBlock: 'Block C',
  //   reason: 'Noise issue — the room adjacent to the common room is too loud at night.',
  //   status: 'Rejected',
  //   adminRemarks: 'No vacancies currently available in Block C. Please try again next semester.',
  //   createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  // },
];

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ResidencyService {
  private http = inject(HttpClient);
  private apiBase = `${environment.apiBaseUrl}`;

  /** GET /api/students/residency — identifies if student is existing resident or fresh applicant */
  getResidencyStatus(): Observable<StudentResidencyDto> {
    return this.http.get<StudentResidencyDto>(`${this.apiBase}/students/residency`).pipe(
      catchError(() => of(MOCK_RESIDENCY))
    );
  }

  /** POST /api/students/residency/annual-challan — generate annual fee challan */
  generateAnnualChallan(): Observable<ProcessingFeeChallan> {
    return this.http.post<ProcessingFeeChallan>(`${this.apiBase}/students/residency/annual-challan`, {}).pipe(
      catchError(() => of({
        feeId: 101,
        challanNumber: 'ANN-2026-0001',
        amount: 15000,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      } as ProcessingFeeChallan))
    );
  }

  /** POST /api/students/residency/verify-annual-fee — mark annual fee as paid */
  verifyAnnualFee(request: VerifyPaymentRequest): Observable<StudentResidencyDto> {
    return this.http.post<StudentResidencyDto>(`${this.apiBase}/students/residency/verify-annual-fee`, request).pipe(
      catchError(() => of({
        ...MOCK_RESIDENCY,
        annualFeeStatus: 'Paid',
        annualChallan: {
          feeId: request.feeId,
          challanNumber: 'ANN-2026-0001',
          amount: 12000,
          status: 'Paid',
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
      }))
    );
  }

  /** GET /api/room-changes — list all room change requests for current student */
  getRoomChangeRequests(): Observable<RoomChangeRequestDto[]> {
    return this.http.get<RoomChangeRequestDto[]>(`${this.apiBase}/room-changes`).pipe(
      catchError(() => of(MOCK_ROOM_CHANGE_REQUESTS))
    );
  }

  /** GET /api/room-changes/{id} */
  getRoomChangeById(id: number): Observable<RoomChangeRequestDto> {
    return this.http.get<RoomChangeRequestDto>(`${this.apiBase}/room-changes/${id}`).pipe(
      catchError(() => of(MOCK_ROOM_CHANGE_REQUESTS.find(r => r.requestId === id)!))
    );
  }

  /** POST /api/room-changes — submit new room change request (multipart/form-data) */
  createRoomChangeRequest(formData: FormData): Observable<RoomChangeRequestDto> {
    return this.http.post<RoomChangeRequestDto>(`${this.apiBase}/room-changes`, formData).pipe(
      catchError(() => of({
        requestId: Date.now(),
        residentId: 1,
        currentHostelRoom: 'Allama Iqbal Hostel — Block A, Room 204',
        preferredBlock: formData.get('preferredBlock') as string ?? undefined,
        reason: formData.get('reason') as string ?? '',
        additionalDetails: formData.get('additionalDetails') as string ?? undefined,
        status: 'Submitted',
        createdAt: new Date().toISOString(),
      } as RoomChangeRequestDto))
    );
  }
}
