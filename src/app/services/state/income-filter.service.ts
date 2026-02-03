import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IncomeFilterService {
  private filterSubject = new BehaviorSubject<{ year: number; months: number[] } | null>(null);
  filter$ = this.filterSubject.asObservable();

  setFilter(filter: { year: number; months: number[] }) {
    this.filterSubject.next(filter);
  }
}
