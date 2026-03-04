import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service לניהול מצב היומן - State Management
 * גישה מקצועית יותר מאשר Output events
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarStateService {
  // מצב התאריך הנבחר ביומן
  private selectedDateSubject = new BehaviorSubject<Date | null>(null);
  public selectedDate$: Observable<Date | null> = this.selectedDateSubject.asObservable();

  constructor() { }

  /**
   * עדכון התאריך הנבחר
   */
  setSelectedDate(date: Date | null): void {
    this.selectedDateSubject.next(date);
  }

  /**
   * בדיקה האם תאריך מסוים הוא התאריך הנבחר
   */
  isDateSelected(date: Date): boolean {
    const selected = this.selectedDateSubject.value;
    if (!selected) return false;
    
    return date.getFullYear() === selected.getFullYear() &&
           date.getMonth() === selected.getMonth() &&
           date.getDate() === selected.getDate();
  }
}
