import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface YearMonthsSelection {
  year: number;
  months: number[];
}

@Injectable({ providedIn: 'root' })
export class IncomeFilterService {
  private filterSubject = new BehaviorSubject<YearMonthsSelection[] | null>(null);
  filter$ = this.filterSubject.asObservable();

  setFilter(filter: YearMonthsSelection[]) {
    this.filterSubject.next(filter);
  }
}
