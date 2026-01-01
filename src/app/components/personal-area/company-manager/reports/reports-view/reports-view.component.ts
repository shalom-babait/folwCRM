import { Component } from '@angular/core';

@Component({
  selector: 'app-reports-view',
  templateUrl: './reports-view.component.html',
  styleUrls: ['./reports-view.component.css']
})
export class ReportsViewComponent {
  selectedReport: any = null;

  onReportSelected(report: any) {
    this.selectedReport = report;
  }
}
