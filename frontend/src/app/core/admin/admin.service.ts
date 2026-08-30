// src/app/core/admin/admin.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  DashboardStats,
  AllocationStatusDto,
  HostelDto,
  RoomDto,
  EligibilityRuleDto,
  StudentDto,
  ResidentDto,
  ApplicationDto,
  MeritResultDto,
  AdminSettingsDto
} from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/admin`;

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/dashboard`);
  }

  // Allocation status
  getAllocationStatus(): Observable<AllocationStatusDto> {
    return this.http.get<AllocationStatusDto>(`${this.base}/allocation/status`);
  }
  setAllocationStatus(open: boolean): Observable<void> {
    return this.http.put<void>(`${this.base}/allocation/status`, { open });
  }

  // Hostels
  getHostels(): Observable<HostelDto[]> {
    return this.http.get<HostelDto[]>(`${this.base}/hostels`);
  }
  createHostel(dto: HostelDto): Observable<HostelDto> {
    return this.http.post<HostelDto>(`${this.base}/hostels`, dto);
  }
  updateHostel(id: number, dto: HostelDto): Observable<HostelDto> {
    return this.http.put<HostelDto>(`${this.base}/hostels/${id}`, dto);
  }
  deactivateHostel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/hostels/${id}`);
  }

  // Rooms (nested under hostels)
  getRooms(hostelId: number): Observable<RoomDto[]> {
    return this.http.get<RoomDto[]>(`${this.base}/hostels/${hostelId}/rooms`);
  }
  createRoom(hostelId: number, dto: RoomDto): Observable<RoomDto> {
    return this.http.post<RoomDto>(`${this.base}/hostels/${hostelId}/rooms`, dto);
  }
  updateRoom(hostelId: number, roomId: number, dto: RoomDto): Observable<RoomDto> {
    return this.http.put<RoomDto>(`${this.base}/hostels/${hostelId}/rooms/${roomId}`, dto);
  }
  deactivateRoom(hostelId: number, roomId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/hostels/${hostelId}/rooms/${roomId}`);
  }

  // Eligibility rules
  getEligibilityRules(hostelId: number): Observable<EligibilityRuleDto[]> {
    return this.http.get<EligibilityRuleDto[]>(`${this.base}/hostels/${hostelId}/eligibility`);
  }
  saveEligibilityRules(hostelId: number, rules: EligibilityRuleDto[]): Observable<void> {
    return this.http.put<void>(`${this.base}/hostels/${hostelId}/eligibility`, rules);
  }

  // Students
  searchStudents(params: any): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(`${this.base}/students`, { params });
  }

  // Residents
  getResidents(filter: any = {}): Observable<ResidentDto[]> {
    return this.http.get<ResidentDto[]>(`${this.base}/residents`, { params: filter });
  }
  assignChallan(residentId: number, amount: number): Observable<void> {
    return this.http.post<void>(`${this.base}/residents/${residentId}/challan`, { amount });
  }
  getRoomHistory(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/residents/${studentId}/room-history`);
  }
  getRoomChangeRequest(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/residents/${studentId}/room-change`);
  }
  approveRoomChange(studentId: number, requestId: number): Observable<void> {
    return this.http.post<void>(`${this.base}/residents/${studentId}/room-change/${requestId}/approve`, {});
  }
  rejectRoomChange(studentId: number, requestId: number, reason: string): Observable<void> {
    return this.http.post<void>(`${this.base}/residents/${studentId}/room-change/${requestId}/reject`, { reason });
  }

  // Applications
  getApplications(filter: any = {}): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(`${this.base}/applications`, { params: filter });
  }

  // Merit & Allocation
  runEligibilityCheck(): Observable<void> {
    return this.http.post<void>(`${this.base}/merit/run-eligibility`, {});
  }
  generateMerit(): Observable<void> {
    return this.http.post<void>(`${this.base}/merit/generate`, {});
  }
  allocateRooms(): Observable<void> {
    return this.http.post<void>(`${this.base}/merit/allocate`, {});
  }
  startSecondRound(): Observable<void> {
    return this.http.post<void>(`${this.base}/merit/second-round`, {});
  }
  revertAllocation(): Observable<{ revertedCount: number; message: string }> {
    return this.http.post<{ revertedCount: number; message: string }>(`${this.base}/allocation/revert`, {});
  }
  getMeritResults(): Observable<MeritResultDto[]> {
    return this.http.get<MeritResultDto[]>(`${this.base}/merit/results`);
  }

  // Settings
  getSettings(): Observable<AdminSettingsDto> {
    return this.http.get<AdminSettingsDto>(`${this.base}/settings`);
  }
  updateSettings(dto: AdminSettingsDto): Observable<AdminSettingsDto> {
    return this.http.put<AdminSettingsDto>(`${this.base}/settings`, dto);
  }
}
