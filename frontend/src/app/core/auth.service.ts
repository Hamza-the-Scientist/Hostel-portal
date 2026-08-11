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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  private _currentUser = signal<AuthResponse | null>(this.loadUser());
  readonly currentUser  = this._currentUser.asReadonly();
  readonly isLoggedIn   = computed(() => this._currentUser() !== null);
  readonly userRole = computed(() => {
    const roleNum = this._currentUser()?.role;
    const roleMap: Record<number, string> = { 1: 'Student', 2: 'Admin', 3: 'SuperAdmin' };
    return roleNum ? roleMap[roleNum] ?? null : null;
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private handleAuthResponse(response: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, response.token);
    const { token, ...user } = response; // store user without token
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._currentUser.set(response);
  }

  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
