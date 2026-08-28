// ============================================================
// core/auth.service.ts — Core authentication service
// ============================================================
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { StudentLoginRequest, AdminLoginRequest, RegisterStudentRequest, AuthResponse } from '../models/auth.model';
import { tap } from 'rxjs';

const TOKEN_KEY = 'access_token';
const USER_KEY  = 'current_user';
const ROLE_KEY  = 'user_role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  private _currentUser = signal<AuthResponse | null>(this.loadUser());
  readonly currentUser  = this._currentUser.asReadonly();
  readonly isLoggedIn   = computed(() => this._currentUser() !== null && !!this.getToken());
  
  readonly userRole = computed(() => {
    const user = this._currentUser();
    if (!user || user.role === undefined || user.role === null) {
      return localStorage.getItem(ROLE_KEY);
    }
    const rawRole = user.role;
    if (typeof rawRole === 'string') {
      const lower = rawRole.toLowerCase();
      if (lower === 'admin') return 'Admin';
      if (lower === 'superadmin') return 'SuperAdmin';
      if (lower === 'student') return 'Student';
      return rawRole;
    }
    if (typeof rawRole === 'number') {
      const roleMap: Record<number, string> = { 1: 'Student', 2: 'Admin', 3: 'SuperAdmin' };
      return roleMap[rawRole] ?? null;
    }
    return null;
  });

  constructor(private http: HttpClient, private router: Router) {}

  loginStudent(credentials: StudentLoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/student-login`, credentials).pipe(
      tap((response) => this.handleAuthResponse(response))
    );
  }

  loginAdmin(credentials: AdminLoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/admin-login`, credentials).pipe(
      tap((response) => this.handleAuthResponse(response))
    );
  }

  registerStudent(data: RegisterStudentRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((response) => this.handleAuthResponse(response))
    );
  }

  logout(): void {
    const role = this.userRole();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    this._currentUser.set(null);

    if (role === 'Admin' || role === 'SuperAdmin') {
      this.router.navigate(['/auth/admin-login']);
    } else {
      this.router.navigate(['/auth/student-login']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private handleAuthResponse(rawResponse: any) {
    if (!rawResponse) return;

    // Handle direct properties (res.token, res.accessToken) or nested response (res.data)
    const res = rawResponse.data ? { ...rawResponse.data, ...rawResponse } : rawResponse;
    const token = res.token || res.accessToken || rawResponse.token || rawResponse.accessToken;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }

    const rawRole = res.role ?? rawResponse.role;
    let normalizedRole: string = 'Student';
    if (typeof rawRole === 'string') {
      const lower = rawRole.toLowerCase();
      if (lower === 'admin') normalizedRole = 'Admin';
      else if (lower === 'superadmin') normalizedRole = 'SuperAdmin';
      else if (lower === 'student') normalizedRole = 'Student';
      else normalizedRole = rawRole;
    } else if (typeof rawRole === 'number') {
      const roleMap: Record<number, string> = { 1: 'Student', 2: 'Admin', 3: 'SuperAdmin' };
      normalizedRole = roleMap[rawRole] ?? 'Student';
    }

    localStorage.setItem(ROLE_KEY, normalizedRole);

    const userObj: AuthResponse = {
      token,
      userId: res.userId ?? res.id,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      role: normalizedRole,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(userObj));
    this._currentUser.set(userObj);
  }

  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
