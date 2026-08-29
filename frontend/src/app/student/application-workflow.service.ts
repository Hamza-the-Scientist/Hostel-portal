import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { environment } from '../../environments/environment';

export interface EligibleHostel {
  hostelId: number;
  name: string;
  gender: string;
  location: string;
  totalCapacity: number;
  availableBeds: number;
  rating: number;
  keyAmenities: string[];
  isEligible: boolean;
  eligibilityReason: string;
}

export interface ProcessingFeeChallan {
  feeId: number;
  challanNumber: string;
  amount: number;
  status: string;
  createdAt: string;
  dueDate: string;
}

export interface ApplicationTimelineStep {
  stepName: string;
  isCompleted: boolean;
  isCurrent: boolean;
  description: string;
  date?: string;
}

export interface ApplicationDto {
  applicationId: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  status: string;
  displayStatus: string;
  submittedAt?: string;
  processingFee?: ProcessingFeeChallan;
  preferences: EligibleHostel[];
  timeline: ApplicationTimelineStep[];
}

export interface HostelPreferenceRequest {
  hostelId: number;
  priorityOrder: number;
}

export interface UpdatePreferencesRequest {
  applicationId: number;
  preferences: HostelPreferenceRequest[];
}

export interface VerifyPaymentRequest {
  feeId: number;
  transactionReference: string;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationWorkflowService {
  private http = inject(HttpClient);
  private apiBase = `${environment.apiBaseUrl}`;

  private mockApplication: ApplicationDto = {
    applicationId: 101,
    studentId: 1,
    studentName: 'Ali Khan',
    rollNumber: '2K22/BSCS/104',
    status: 'Draft',
    displayStatus: 'In Progress',
    processingFee: {
      feeId: 501,
      challanNumber: 'CH-2026-0091',
      amount: 100,
      status: 'Unpaid',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString()
    },
    preferences: [],
    timeline: [
      { stepName: 'Registration', isCompleted: true, isCurrent: false, description: 'Student verified & registered' },
      { stepName: 'Processing Fee Paid', isCompleted: false, isCurrent: true, description: 'Pay PKR 100 Challan' },
      { stepName: 'Hostel Preferences Submitted', isCompleted: false, isCurrent: false, description: 'Pending Selection' },
      { stepName: 'Merit Processing', isCompleted: false, isCurrent: false, description: 'Under Merit Review' },
      { stepName: 'Room Allocated', isCompleted: false, isCurrent: false, description: 'Pending Allocation' },
      { stepName: 'Final Challan', isCompleted: false, isCurrent: false, description: 'Hostel Allotment Fee' },
      { stepName: 'Allocation Complete', isCompleted: false, isCurrent: false, description: 'Resident Card Issued' }
    ]
  };

  private mockHostels: EligibleHostel[] = [
    {
      hostelId: 1,
      name: 'Allama I.I. Kazi Hostel',
      gender: 'Male',
      location: 'Main Campus',
      totalCapacity: 300,
      availableBeds: 45,
      rating: 4.5,
      keyAmenities: ['WiFi', 'Mess', 'Library'],
      isEligible: true,
      eligibilityReason: 'Matches Gender & Academic Program'
    },
    {
      hostelId: 2,
      name: 'Hyder Bux Jatoi Hostel',
      gender: 'Male',
      location: 'North Campus',
      totalCapacity: 250,
      availableBeds: 20,
      rating: 4.2,
      keyAmenities: ['WiFi', 'Sports Complex'],
      isEligible: true,
      eligibilityReason: 'Matches Gender & District Criteria'
    },
    {
      hostelId: 3,
      name: 'Marvi Girls Hostel',
      gender: 'Female',
      location: 'Girls Sector',
      totalCapacity: 400,
      availableBeds: 60,
      rating: 4.8,
      keyAmenities: ['High Security', 'WiFi', 'Gym'],
      isEligible: false,
      eligibilityReason: 'Ineligible due to Gender criteria'
    }
  ];

  getEligibleHostels(): Observable<EligibleHostel[]> {
    return this.http.get<EligibleHostel[]>(`${this.apiBase}/hostels/eligible`).pipe(
      timeout(1500),
      catchError(() => of(this.mockHostels))
    );
  }

  getActiveApplication(): Observable<ApplicationDto> {
    return this.http.get<ApplicationDto>(`${this.apiBase}/students/application`).pipe(
      timeout(1500),
      catchError(() => of(this.mockApplication))
    );
  }

  generateProcessingFee(): Observable<ProcessingFeeChallan> {
    const fee = this.mockApplication.processingFee!;
    return this.http.post<ProcessingFeeChallan>(`${this.apiBase}/payments/processing-fee`, {}).pipe(
      timeout(1500),
      catchError(() => of(fee))
    );
  }

  verifyPayment(request: VerifyPaymentRequest): Observable<ApplicationDto> {
    if (this.mockApplication.processingFee) {
      this.mockApplication.processingFee.status = 'Paid';
    }
    return this.http.post<ApplicationDto>(`${this.apiBase}/payments/verify`, request).pipe(
      timeout(1500),
      catchError(() => of(this.mockApplication))
    );
  }

  updatePreferences(request: UpdatePreferencesRequest): Observable<ApplicationDto> {
    if (request.preferences) {
      this.mockApplication.preferences = request.preferences.map((p, idx) => {
        const found = this.mockHostels.find(h => h.hostelId === p.hostelId);
        return found || {
          hostelId: p.hostelId,
          name: `Hostel #${p.hostelId}`,
          gender: 'Male',
          location: 'Jamshoro Campus',
          totalCapacity: 200,
          availableBeds: 30,
          rating: 4.0,
          keyAmenities: [],
          isEligible: true,
          eligibilityReason: `Priority #${idx + 1}`
        };
      });
    }
    return this.http.put<ApplicationDto>(`${this.apiBase}/applications/preferences`, request).pipe(
      timeout(1500),
      catchError(() => of(this.mockApplication))
    );
  }

  getDistrictEligibility(): Observable<{ isAllowed: boolean; districtName: string; message: string }> {
    return this.http.get<{ isAllowed: boolean; districtName: string; message: string }>(`${this.apiBase}/students/eligibility-status`).pipe(
      timeout(2000),
      catchError(() => of({
        isAllowed: true,
        districtName: 'Hyderabad',
        message: 'Your district is eligible for hostel admission.'
      }))
    );
  }

  submitApplication(preferences?: any[]): Observable<ApplicationDto> {
    this.mockApplication.status = 'Submitted';
    this.mockApplication.displayStatus = 'Submitted';
    this.mockApplication.submittedAt = new Date().toISOString();
    return this.http.post<ApplicationDto>(`${this.apiBase}/students/application`, { preferences }).pipe(
      timeout(3000),
      catchError((err) => {
        if (err?.status === 403 || err?.error?.message) {
          throw err;
        }
        return of(this.mockApplication);
      })
    );
  }
}
