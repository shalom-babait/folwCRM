

import { Component } from '@angular/core';
import { IncomeFilterService } from 'src/app/services/state/income-filter.service';
import { MONTH_LABELS } from 'src/app/shared/constants/month-labels';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.css']
})
export class MonthSelectorComponent {
  constructor(private incomeFilterService: IncomeFilterService) {}

  years: number[] = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  months: { label: string, hasData: boolean }[] = MONTH_LABELS.map(label => ({ label, hasData: true }));

  // כל שורה: { year: number, months: number[] }
  selections: Array<{ year: number, months: number[] }> = [
    { year: new Date().getFullYear(), months: [] }
  ];

  ngOnInit() {
    this.updateFilter();
  }

  addYearSelection() {
    // ברירת מחדל: שנה אחרונה שעדיין לא נבחרה, או השנה הנוכחית
    const usedYears = this.selections.map(sel => sel.year);
    const available = this.years.find(y => !usedYears.includes(y)) ?? this.years[0];
    this.selections.push({ year: available, months: [] });
    this.updateFilter();
  }

  removeYearSelection(idx: number) {
    this.selections.splice(idx, 1);
    this.updateFilter();
  }

  onYearChange(idx: number, event: any) {
    const year = Number(event.target.value);
    this.selections[idx].year = year;
    this.selections[idx].months = [];
    this.updateFilter();
  }

  onMonthClick(idx: number, monthIdx: number) {
    const sel = this.selections[idx];
    if (!this.months[monthIdx].hasData) return;
    if (sel.months.includes(monthIdx)) {
      sel.months = sel.months.filter(i => i !== monthIdx);
    } else {
      sel.months = [...sel.months, monthIdx];
    }
    this.updateFilter();
  }

  selectAllMonths(idx: number) {
    this.selections[idx].months = this.months.map((_, i) => i).filter(i => this.months[i].hasData);
    this.updateFilter();
  }

  resetMonths(idx: number) {
    this.selections[idx].months = [];
    this.updateFilter();
  }

  getSelectedMonthsLabel(idx: number): string {
    return this.selections[idx].months.map(i => this.months[i]?.label).filter(Boolean).join(', ');
  }

  updateFilter() {
    // שלח מערך של {year, months}
    this.incomeFilterService.setFilter(this.selections.map(sel => ({ year: sel.year, months: [...sel.months] })));
  }
}
