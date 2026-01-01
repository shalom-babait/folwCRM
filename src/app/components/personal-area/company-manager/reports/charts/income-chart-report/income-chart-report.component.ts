import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-income-chart-report',
  templateUrl: './income-chart-report.component.html',
  styleUrls: ['./income-chart-report.component.css']
})
export class IncomeChartReportComponent {
  @Input() report: any;
  chartType: ChartType = 'line';

  chartData: ChartConfiguration['data'] = {
    labels: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
    datasets: [
      {
        label: 'הכנסות',
        data: [12000, 9500, 14300, 17000, 0, 0, 0, 0, 0, 0, 0, 0], // עדכן ערכים לפי הצורך
        tension: 0.4
      }
    ]
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true
  };
}
}
