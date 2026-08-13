import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

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

  private mockProfile: StudentProfileDto = {
    studentId: 1,
    verifiedInfo: {
      fullName: 'Ali Khan',
      rollNumber: '2K22/BSCS/104',
      cnic: '41304-1234567-1',
      department: 'Computer Science',
      program: 'BS Computer Science',
      semester: 6,
      cgpa: 3.75,
      academicYear: '2025-2026',
      district: 'Hyderabad',
      gender: 'Male',
      dateOfBirth: '2002-05-14'
    },
    personalInfo: {
      email: 'ali.khan@student.usindh.edu.pk',
      phoneNumber: '0300-1234567',
      emergencyContact: '0301-7654321',
      guardianName: 'Tariq Khan',
      guardianPhone: '0301-7654321',
      guardianRelation: 'Father',
      homeAddress: 'House 42, Sector B, Qasimabad',
      city: 'Hyderabad',
      bloodGroup: 'B+',
      disabilities: 'None'
    }
  };

  getProfile(): Observable<StudentProfileDto> {
    return this.http.get<StudentProfileDto>(this.apiUrl).pipe(
      timeout(1500),
      catchError(() => of(this.mockProfile))
    );
  }

  updateProfile(data: UpdateStudentProfileRequest): Observable<StudentProfileDto> {
    this.mockProfile = {
      ...this.mockProfile,
      personalInfo: {
        ...this.mockProfile.personalInfo,
        ...data
      }
    };
    return this.http.put<StudentProfileDto>(this.apiUrl, data).pipe(
      timeout(1500),
      catchError(() => of(this.mockProfile))
    );
  }
}
