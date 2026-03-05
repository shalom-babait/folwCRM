import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as e from 'express';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
    window.addEventListener('unload', () => {
      localStorage.clear();
    });
  }

login(user_name: string, password: string): Observable<{ success: boolean; token: string; user?: any }> {
  return this.http.post<{ success: boolean; token: string; user?: any }>(
    `${this.apiUrl}/login`,
    { user_name, password }
  );
}

  // שליחת בקשה לשחזור סיסמה
  forgotPassword(user_name: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/login/forgot-password`,
      { user_name }
    );
  }
  
  // החלפת סיסמה (משתמש מחובר)
  changePassword(user_name: string, oldPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/login/change-password`,
      { user_name, oldPassword, newPassword }
    );
  }

  // שולף את ה־token מה־localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // מפענח את ה־role מתוך ה־JWT
  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  }

  // בודק אם המשתמש מחובר
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

    // מחלץ מזהה משתמש מה-token
    getCurrentUserId(): number | null {
      const token = this.getToken();
      // console.log('JWT token:', token);
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // console.log('JWT payload:', payload);
    return payload.id || null;
      } catch (err) {
        console.error('JWT decode error:', err);
        return null;
      }
    }

  // בודק אם למשתמש יש role מסוים
  hasRole(expectedRole: string): boolean {
    const role = this.getRoleFromToken();
    return role === expectedRole;
  }

  // התנתקות – מוחק את ה־token
  logout(): void {
  localStorage.clear();
  }
}