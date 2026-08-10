import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface VerifiedUniversityInfo {
  fullName: string;
  rollNumber: string;
  cnic: string;
  department: string;
  program: string;
  semester: number;
  cgpa: number;
  academicYear: string;
  district: string;
  gender: string;
  dateOfBirth: string;
}

export interface PersonalInfo {
  email: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  homeAddress?: string;
  city?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  disabilities?: string;
}

export interface StudentProfileDto {
  studentId: number;
  verifiedInfo: VerifiedUniversityInfo;
  personalInfo: PersonalInfo;
}

export interface UpdateStudentProfileRequest {
  phoneNumber?: string;
  profilePictureUrl?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  homeAddress?: string;
  city?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  disabilities?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentProfileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/students/profile`;

  getProfile(): Observable<StudentProfileDto> {
    return this.http.get<StudentProfileDto>(this.apiUrl);
  }

  updateProfile(data: UpdateStudentProfileRequest): Observable<StudentProfileDto> {
    return this.http.put<StudentProfileDto>(this.apiUrl, data);
  }
}
