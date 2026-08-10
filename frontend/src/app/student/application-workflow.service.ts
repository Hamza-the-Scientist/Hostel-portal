import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getEligibleHostels(): Observable<EligibleHostel[]> {
    return this.http.get<EligibleHostel[]>(`${this.apiBase}/hostels/eligible`);
  }

  getActiveApplication(): Observable<ApplicationDto> {
    return this.http.get<ApplicationDto>(`${this.apiBase}/students/application`);
  }

  generateProcessingFee(): Observable<ProcessingFeeChallan> {
    return this.http.post<ProcessingFeeChallan>(`${this.apiBase}/payments/processing-fee`, {});
  }

  verifyPayment(request: VerifyPaymentRequest): Observable<ApplicationDto> {
    return this.http.post<ApplicationDto>(`${this.apiBase}/payments/verify`, request);
  }

  updatePreferences(request: UpdatePreferencesRequest): Observable<ApplicationDto> {
    return this.http.put<ApplicationDto>(`${this.apiBase}/applications/preferences`, request);
  }

  submitApplication(): Observable<ApplicationDto> {
    return this.http.post<ApplicationDto>(`${this.apiBase}/students/application`, {});
  }
}
