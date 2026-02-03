import { Component } from '@angular/core';
import { IncomeFilterService } from 'src/app/services/state/income-filter.service';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.css']
})
export class MonthSelectorComponent {
  constructor(private incomeFilterService: IncomeFilterService) {}
  getSelectedMonthsLabel(): string {
    return this.selectedMonthsCopy.map(i => this.months[i]?.label).filter(Boolean).join(', ');
  }
  years: number[] = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  selectedYear: number = new Date().getFullYear();
  months: { label: string, hasData: boolean }[] = [
    { label: 'ינואר', hasData: true },
    { label: 'פברואר', hasData: true },
    { label: 'מרץ', hasData: true },
    { label: 'אפריל', hasData: true },
    { label: 'מאי', hasData: true },
    { label: 'יוני', hasData: true },
    { label: 'יולי', hasData: true },
    { label: 'אוגוסט', hasData: true },
    { label: 'ספטמבר', hasData: true },
    { label: 'אוקטובר', hasData: true },
    { label: 'נובמבר', hasData: true },
    { label: 'דצמבר', hasData: true }
  ];

  // Removed drag selection logic
  selectedMonthsCopy: number[] = [];

  ngOnInit() {
    this.selectedMonthsCopy = [];
    this.updateFilter();
  }

  selectAllMonths() {
    this.selectedMonthsCopy = this.months.map((_, i) => i).filter(i => this.months[i].hasData);
    this.updateFilter();
  }

  resetMonths() {
    this.selectedMonthsCopy = [];
    this.updateFilter();
  }

  onYearChange(event: any) {
    this.selectedYear = Number(event.target.value);
    this.selectedMonthsCopy = [];
    this.updateFilter();
  }

  onMonthClick(index: number, event: MouseEvent) {
    if (!this.months[index].hasData) return;
    if (this.selectedMonthsCopy.includes(index)) {
      this.selectedMonthsCopy = this.selectedMonthsCopy.filter(i => i !== index);
    } else {
      this.selectedMonthsCopy = [...this.selectedMonthsCopy, index];
    }
    this.updateFilter();
  }

  updateFilter() {
    this.incomeFilterService.setFilter({
      year: this.selectedYear,
      months: [...this.selectedMonthsCopy]
    });
  }

  // Removed drag selection logic
}
