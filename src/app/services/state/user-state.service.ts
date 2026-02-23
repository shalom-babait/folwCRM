import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserData, UserDataWithPerson } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private userSubject = new BehaviorSubject<UserDataWithPerson | null>(null);
  user$ = this.userSubject.asObservable();

  /** טען נתוני משתמש מה-localStorage */
  loadFromLocalStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        this.setUser(userObj);
      } catch {}
    }
  }

  /** עדכון נתוני משתמש בסטייט וב-localStorage */
  setUser(user: UserDataWithPerson) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    if (user.user && user.user.organization_id) {
      localStorage.setItem('organization_id', String(user.user.organization_id));
    }
    // אם יש טוקן, שמור אותו
    if ((user as any).token) {
      localStorage.setItem('token', (user as any).token);
    }
  }

  /** מחיקת נתוני משתמש מהסטייט ומה-localStorage */
  clearUser() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('organization_id');
    localStorage.removeItem('token');
  }

  /** קבלת נתוני המשתמש הנוכחי */
  getUser(): UserDataWithPerson | null {
    return this.userSubject.value;
  }
}
