import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-chart-base',
  templateUrl: './chart-base.component.html',
  styleUrls: ['./chart-base.component.css']
})
export class ChartBaseComponent implements OnInit {
  /**
   * אירוע שמופעל כאשר הקומפוננטה נטענת
   */
  @Output() chartInit = new EventEmitter<void>();
  ngOnInit() {
    this.chartInit.emit();
  }
  /**
   * סוג הגרף: 'bar' | 'line' | 'pie' | ...
   */
  @Input() type: ChartType = 'bar';
  /**
   * תוויות ציר X
   */
  @Input() labels: string[] = [];
  /**
   * מערך datasets (כל סדרת נתונים)
   */
  @Input() datasets: ChartData<any>["datasets"] = [];
  /**
   * אפשרויות עיצוב, legend, tooltips וכו'
   */
  @Input() options: ChartOptions = {};

  get chartData(): ChartData {
    return {
      labels: this.labels,
      datasets: this.datasets
    };
  }
}
