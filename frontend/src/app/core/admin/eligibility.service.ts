import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface EligibilityRule {
  ruleId?: number;
  hostelId: number;
  ruleType: 'District' | 'Campus';
  mode: 'Include' | 'Exclude';
  values: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class EligibilityService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/eligibility`;
  private readonly adminBase = `${environment.apiUrl}/api/admin`;

  // Hostels
  getHostels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminBase}/hostels`);
  }

  // Rules
  getRulesByHostel(hostelId: number): Observable<EligibilityRule[]> {
    return this.http.get<EligibilityRule[]>(`${this.base}/hostel/${hostelId}`);
  }

  createRule(rule: EligibilityRule): Observable<EligibilityRule> {
    return this.http.post<EligibilityRule>(this.base, rule);
  }

  updateRule(id: number, rule: Partial<EligibilityRule>): Observable<EligibilityRule> {
    return this.http.put<EligibilityRule>(`${this.base}/${id}`, rule);
  }

  deleteRule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // Metadata
  getDistricts(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/districts`);
  }

  getCampuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/campuses`);
  }
}
