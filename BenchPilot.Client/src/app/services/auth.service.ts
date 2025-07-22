import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SignUpRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserInfo;
  errors: string[];
}

export interface UserInfo {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  roleId: number;
  teamName?: string;
  teamId?: number;
  isEmailConfirmed: boolean;
  lastLoginAt?: Date;
  limits?: UserLimitInfo;
}

export interface UserLimitInfo {
  maxResumes: number;
  maxSubmissionsPerDay: number;
  maxAIMatches: number;
  maxResumeEnhancements: number;
  maxSubmissionHistory: number;
  isTrialUser: boolean;
  trialExpiryDate?: Date;
  currentResumes: number;
  todaySubmissions: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user data from localStorage on service initialization
    this.loadStoredAuthData();
  }

  signup(signupData: SignUpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, signupData);
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData);
  }

  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(resetData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/reset-password`, resetData);
  }

  setAuthData(token: string, user: UserInfo): void {
    // Store in localStorage
    localStorage.setItem('benchpilot_token', token);
    localStorage.setItem('benchpilot_user', JSON.stringify(user));
    
    // Update subjects
    this.tokenSubject.next(token);
    this.currentUserSubject.next(user);
  }

  private loadStoredAuthData(): void {
    const token = localStorage.getItem('benchpilot_token');
    const userStr = localStorage.getItem('benchpilot_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuthData();
      }
    }
  }

  clearAuthData(): void {
    localStorage.removeItem('benchpilot_token');
    localStorage.removeItem('benchpilot_user');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  logout(): void {
    this.clearAuthData();
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  isRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  isSuperAdmin(): boolean {
    return this.isRole('SuperAdmin');
  }

  isTeamAdmin(): boolean {
    return this.isRole('TeamAdmin');
  }

  isRecruiter(): boolean {
    return this.isRole('Recruiter');
  }

  isAdmin(): boolean {
    return this.isSuperAdmin() || this.isTeamAdmin();
  }

  hasPermission(permission: string): boolean {
    const role = this.getUserRole();
    
    switch (permission) {
      case 'manage_all_teams':
        return this.isSuperAdmin();
      
      case 'manage_team':
        return this.isAdmin();
      
      case 'manage_consultants':
        return true; // All roles can manage consultants
      
      case 'view_analytics':
        return this.isAdmin();
      
      case 'system_settings':
        return this.isSuperAdmin();
      
      default:
        return false;
    }
  }

  getQuotaUsage(): UserLimitInfo | null {
    const user = this.getCurrentUser();
    return user?.limits || null;
  }

  isQuotaExceeded(quotaType: string): boolean {
    const limits = this.getQuotaUsage();
    if (!limits) return false;

    switch (quotaType) {
      case 'resumes':
        return limits.currentResumes >= limits.maxResumes;
      
      case 'submissions':
        return limits.todaySubmissions >= limits.maxSubmissionsPerDay;
      
      default:
        return false;
    }
  }

  getQuotaPercentage(quotaType: string): number {
    const limits = this.getQuotaUsage();
    if (!limits) return 0;

    switch (quotaType) {
      case 'resumes':
        return (limits.currentResumes / limits.maxResumes) * 100;
      
      case 'submissions':
        return (limits.todaySubmissions / limits.maxSubmissionsPerDay) * 100;
      
      default:
        return 0;
    }
  }

  isTrialUser(): boolean {
    const limits = this.getQuotaUsage();
    return limits?.isTrialUser || false;
  }

  getTrialDaysRemaining(): number {
    const limits = this.getQuotaUsage();
    if (!limits?.trialExpiryDate) return 0;

    const expiryDate = new Date(limits.trialExpiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }
}