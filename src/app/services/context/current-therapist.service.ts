import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrentTherapistService {
  private therapistIdSubject = new BehaviorSubject<number | null>(null);

  // Observable למנויים
  therapistId$ = this.therapistIdSubject.asObservable();

  // קבלת מזהה המטפל הנוכחי
  getTherapistId(): number | null {
    return this.therapistIdSubject.value;
  }

  // הגדרת מזהה המטפל הנוכחי
  setTherapistId(id: number | null) {
    this.therapistIdSubject.next(id);
    if (id) {
      localStorage.setItem('therapist_id', String(id));
    } else {
      localStorage.removeItem('therapist_id');
    }
  }

  // טעינה אוטומטית מה-localStorage אם קיים
  loadFromStorage() {
    const storedId = localStorage.getItem('therapist_id');
    if (storedId) {
      this.setTherapistId(Number(storedId));
    }
  }
}
