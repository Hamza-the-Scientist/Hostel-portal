// ============================================================
// models/auth.model.ts — Authentication TypeScript interfaces
// ============================================================

export interface StudentLoginRequest {
  cnic: string;
  password: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface RegisterStudentRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  registrationNumber: string;
  cnic: string;
  gender: number; // Enum: 0=Male, 1=Female, etc.
  dateOfBirth: string; 
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  userId?: number;
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string | number;
  data?: any;
}

export type UserRole = 'Student' | 'Admin' | 'SuperAdmin' | 'Provost';
