import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-treatment-summary',
  templateUrl: './treatment-summary.component.html',
  styleUrls: ['./treatment-summary.component.css']
})
export class TreatmentSummaryComponent {
// treatment-hours-summary.component.ts
  @Input() totalHours: number = 0;
  @Input() totalCost: number = 0;
  @Input() treatmentCount: number = 0;

  constructor() { }

  // פורמט מחיר
  formatCurrency(amount: number): string {
    return `₪${amount.toLocaleString()}`;
  }

  // פורמט שעות
  formatHours(hours: number): string {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours} שעות`;
    } else {
      return `${wholeHours}:${minutes.toString().padStart(2, '0')} שעות`;
    }
  }
}
