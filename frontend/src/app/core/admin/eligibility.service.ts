import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DistrictItem {
  districtId: number;
  name: string;
  province: string;
  isAllowed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampusItem {
  campusId: number;
  name: string;
  code: string;
  isEligible: boolean;
  location?: string;
}

@Injectable({ providedIn: 'root' })
export class EligibilityService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/eligibility`;
  private readonly adminBase = `${environment.apiUrl}/api/admin`;

  private readonly CAMPUS_STORAGE_KEY = 'sdp_campuses_eligibility';
  private readonly DISTRICT_STORAGE_KEY = 'sdp_districts_eligibility';

  // Initial 7 Campuses of University of Sindh
  private defaultCampuses: CampusItem[] = [
    { campusId: 1, name: 'Allama I.I. Kazi Campus (Main Campus)', code: 'MAIN-JAM', isEligible: true, location: 'Jamshoro' },
    { campusId: 2, name: 'Elsa Kazi Campus (Old Campus)', code: 'OLD-HYD', isEligible: true, location: 'Hyderabad' },
    { campusId: 3, name: 'Laar Campus (Badin)', code: 'LAAR-BDN', isEligible: true, location: 'Badin' },
    { campusId: 4, name: 'Mohtarma Benazir Bhutto Shaheed Campus (Dadu)', code: 'MBBS-DAD', isEligible: true, location: 'Dadu' },
    { campusId: 5, name: 'Khan Bahadur Syed Allahndo Shah Campus (Naushahro Feroze)', code: 'KBSAS-NF', isEligible: true, location: 'Naushahro Feroze' },
    { campusId: 6, name: 'Thatta Campus (Thatta)', code: 'TTA-TTA', isEligible: true, location: 'Thatta' },
    { campusId: 7, name: 'Thar Campus (Tharparkar)', code: 'THAR-THAR', isEligible: true, location: 'Tharparkar' }
  ];

  private getStoredCampuses(): CampusItem[] {
    try {
      const stored = localStorage.getItem(this.CAMPUS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored campuses:', e);
    }
    return this.defaultCampuses;
  }

  private saveStoredCampuses(campuses: CampusItem[]): void {
    try {
      localStorage.setItem(this.CAMPUS_STORAGE_KEY, JSON.stringify(campuses));
    } catch (e) {
      console.warn('Error saving campuses:', e);
    }
  }

  private getStoredDistricts(): DistrictItem[] | null {
    try {
      const stored = localStorage.getItem(this.DISTRICT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored districts:', e);
    }
    return null;
  }

  private saveStoredDistricts(districts: DistrictItem[]): void {
    try {
      localStorage.setItem(this.DISTRICT_STORAGE_KEY, JSON.stringify(districts));
    } catch (e) {
      console.warn('Error saving districts:', e);
    }
  }

  // District-Wise Eligibility Management
  getDistrictsManagement(): Observable<DistrictItem[]> {
    const stored = this.getStoredDistricts();
    return this.http.get<DistrictItem[]>(`${this.base}/districts-management`).pipe(
      map(res => {
        if (stored) {
          const merged = (res && res.length > 0) ? res : stored;
          return merged.map(d => {
            const match = stored.find(s => s.districtId === d.districtId || s.name === d.name);
            return match ? { ...d, isAllowed: match.isAllowed } : d;
          });
        }
        return res;
      }),
      catchError(() => of(stored || []))
    );
  }

  updateDistrictStatus(districtId: number, isAllowed: boolean): Observable<DistrictItem> {
    return this.http.put<DistrictItem>(`${this.base}/districts/${districtId}/status`, { isAllowed }).pipe(
      map(res => res),
      catchError(() => of({ districtId, name: '', province: 'Sindh', isAllowed }))
    );
  }

  saveAllDistricts(districts: DistrictItem[]): Observable<DistrictItem[]> {
    this.saveStoredDistricts(districts);
    districts.forEach(d => {
      this.updateDistrictStatus(d.districtId, d.isAllowed).subscribe({ error: () => {} });
    });
    return of(districts);
  }

  // Campus-Wise Eligibility Management
  getCampusesManagement(): Observable<CampusItem[]> {
    const campuses = this.getStoredCampuses();
    return this.http.get<CampusItem[]>(`${this.base}/campuses-management`).pipe(
      map(res => (res && res.length > 0) ? res : campuses),
      catchError(() => of(campuses))
    );
  }

  saveAllCampuses(campuses: CampusItem[]): Observable<CampusItem[]> {
    this.saveStoredCampuses(campuses);
    campuses.forEach(c => {
      this.updateCampusStatus(c.campusId, c.isEligible).subscribe({ error: () => {} });
    });
    return of(campuses);
  }

  updateCampusStatus(campusId: number, isEligible: boolean): Observable<CampusItem> {
    const current = this.getStoredCampuses();
    const found = current.find(c => c.campusId === campusId);
    if (found) {
      found.isEligible = isEligible;
      this.saveStoredCampuses(current);
    }

    return this.http.put<CampusItem>(`${this.base}/campuses/${campusId}/status`, { isEligible }).pipe(
      map(res => res),
      catchError(() => {
        return of({ campusId, name: found?.name || '', code: found?.code || '', isEligible });
      })
    );
  }

  // Metadata
  getDistricts(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/districts`);
  }

  getCampuses(): Observable<string[]> {
    return of(this.getStoredCampuses().filter(c => c.isEligible).map(c => c.name));
  }
}
