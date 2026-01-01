
import { Component, Input, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payments.service';
import { ChartConfiguration, ChartType } from 'chart.js';

interface IncomeRow {
  name: string;
  amount: number;
}


@Component({
  selector: 'app-income-report',
  templateUrl: './income-report.component.html',
  styleUrls: ['./income-report.component.css']
})
export class IncomeReportComponent implements OnInit {
  @Input() therapistId?: number; // אפשר להעביר מבחוץ, אבל נטען כברירת מחדל מלוקאל סטורג'
  @Input() viewMode: 'table' | 'chart' = 'table';

  filterType: 'month' | 'quarter' | 'range' = 'month';
  startDate: string = '';
  endDate: string = '';
  rows: IncomeRow[] = [];
  totalIncome: number = 0;

  // Chart properties
  chartType: ChartType = 'line';
  chartData: ChartConfiguration['data'] = {
    labels: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
    datasets: [
      {
        label: 'הכנסות',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        tension: 0.4
      }
    ]
  };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    // נטען את המזהה מה-localStorage אם לא הועבר מבחוץ
    if (!this.therapistId) {
      const storedId = localStorage.getItem('therapist_id');
      if (storedId) {
        this.therapistId = Number(storedId);
      }
    }
    this.loadReport();
  }

  loadReport() {
    // כרגע רק month, אפשר להרחיב בהמשך
    if (this.filterType === 'month' && this.therapistId) {
      this.paymentService.getTherapistMonthlyPaymentsList(this.therapistId).subscribe(data => {
        console.log('נתונים מהשרת לדוח הכנסות:', data);
        this.rows = data.map((item: any) => ({
          name: item.patient_name,
          amount: Number(item.total_payments)
        }));
        this.totalIncome = this.rows.reduce((sum, row) => sum + row.amount, 0);
        // עדכון נתוני הגרף
        this.updateChartData();
      });
    } else {
      // דמו לשאר הפילטרים
      this.rows = [];
      this.totalIncome = 0;
      this.updateChartData();
    }
  }

  updateChartData() {
    // דוגמה: סכום הכנסות לכל חודש (בהנחה שיש שדה month בנתונים)
    const monthlyTotals = Array(12).fill(0);
    this.rows.forEach(row => {
      // כאן יש להוסיף לוגיקה לפי החודש של כל שורה
      // monthlyTotals[monthIndex] += row.amount;
      // כרגע דמו: הכל בחודש ינואר
      monthlyTotals[0] += row.amount;
    });
    this.chartData = {
      labels: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
      datasets: [
        {
          label: 'הכנסות',
          data: monthlyTotals,
          tension: 0.4
        }
      ]
    };
  }
}
