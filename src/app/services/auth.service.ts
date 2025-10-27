import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // התחברות – שולחת email וסיסמה ומקבלת token
login(email: string, password: string): Observable<{ success: boolean; token: string }> {
  alert("email: " + email + " password: " + password);
  return this.http.post<{ success: boolean; token: string }>(
    `${this.apiUrl}/login`,
    { email, password }
  ).pipe(
    tap(res => {
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
      }
    })
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

  // בודק אם למשתמש יש role מסוים
  hasRole(expectedRole: string): boolean {
    const role = this.getRoleFromToken();
    return role === expectedRole;
  }

  // התנתקות – מוחק את ה־token
  logout(): void {
    localStorage.removeItem('token');
  }
}