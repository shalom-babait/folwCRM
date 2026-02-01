
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PaymentService } from 'src/app/services/payments.service';
import { IncomeFilterService } from 'src/app/services/state/income-filter.service';
import { ReportsService } from 'src/app/services/reports.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { IncomeRow } from 'src/app/models/reports.model';
@Component({
  selector: 'app-income-report',
  templateUrl: './income-report.component.html',
  styleUrls: ['./income-report.component.css']
})
export class IncomeReportComponent implements OnInit {
  /**
   * מבנה: [{ month: 0, total: 6385, clients: [...] }, ...]
   */
  incomeByMonths: Array<{ month: number, total: number, clients: Array<{ person_id: number, client_name: string, total: number }> }> = [];
  sendFilterToServer(year: number, months: number[]) {
    this.reportsService.getIncomeByMonths(year, months, this.therapistId).subscribe({
      next: (response) => {
        if (response && response.success && Array.isArray(response.data)) {
          this.incomeByMonths = response.data;
          // סכום כולל לכל החודשים שנבחרו
          this.totalIncome = this.incomeByMonths.reduce((sum, m) => sum + (m.total || 0), 0);
        } else {
          this.incomeByMonths = [];
          this.totalIncome = 0;
        }
      },
      error: (err) => {
        console.error('שגיאה בשליחת פילטר דוח הכנסות:', err);
        this.incomeByMonths = [];
        this.totalIncome = 0;
      }
    });
  }
  getSelectedMonthsLabel(): string {
    return this.selectedMonths.map(i => this.months[i]?.label).filter(label => !!label).join(', ');
  }
  years: number[] = [];
  selectedYear: number = new Date().getFullYear();
  months: { label: string, hasData: boolean }[] = [];
  selectedMonths: number[] = [];
  private filterSubscription: any;

  ngOnInit() {
    // Initialize years (last 5 years)
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    this.selectedYear = currentYear;
    // Initialize months
    this.months = [
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
  // Removed reset of selectedMonths to allow persistent selection

    // Debounce for slider changes
    this.sliderChange$.pipe(debounceTime(400)).subscribe(({start, end}) => {
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      this.loadReport();
    });
    // נטען את המזהה מה-localStorage אם לא הועבר מבחוץ
      // Subscribe to filter changes
    if (!this.therapistId) {
      const storedId = localStorage.getItem('therapist_id');
      if (storedId) {
        this.therapistId = Number(storedId);
      }
    }
    this.loadReport(); // Call loadReport without filter values
    this.filterSubscription = this.incomeFilterService.filter$.subscribe(filter => {
      if (filter) {
  this.selectedYear = filter.year;
  this.selectedMonths = filter.months;
  this.sendFilterToServer(filter.year, filter.months);
  this.loadReport();
      }
    });
  }

  onSelectedMonthsChange(selected: number[]) {
  // קבלת חודשים נבחרים בלבד, ללא ניהול או איפוס
  this.selectedMonths = selected;
  }

  onYearChange(event: any) {
  this.selectedYear = event;
  // אין איפוס של selectedMonths כאן
  // כאן אפשר לטעון נתונים חדשים לשנה שנבחרה
  // this.months.forEach(m => m.hasData = true/false);
  }

  // Timeline slider state
  minSliderDate: Date = new Date(new Date().getFullYear(), 0, 1);
  maxSliderDate: Date = new Date();
  get startDateObj(): Date {
    return this.startDate ? new Date(this.startDate) : this.minSliderDate;
  }

  get endDateObj(): Date {
    return this.endDate ? new Date(this.endDate) : this.maxSliderDate;
  }

  private sliderChange$ = new Subject<{start: Date, end: Date}>();
  @Input() therapistId?: number; // אפשר להעביר מבחוץ, אבל נטען כברירת מחדל מלוקאל סטורג'
  @Input() viewMode: 'table' | 'chart' = 'table';

  filterType: 'month' | 'quarter' | 'range' = 'month';
  startDate: string = '';
  endDate: string = '';
  rows: IncomeRow[] = [];
  totalIncome: number = 0;

  /**
   * מחזיר את שם החודש לפי אינדקס (0=ינואר)
   */
  getMonthLabel(idx: number): string {
    return this.months[idx]?.label || '';
  }

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

  constructor(
    private paymentService: PaymentService,
    private incomeFilterService: IncomeFilterService,
    private reportsService: ReportsService
  ) {}


  onSliderChange(event: {start: Date, end: Date}) {
    // Update state but do not load report yet
    this.sliderChange$.next(event);
  }

  onSliderRelease(event: {start: Date, end: Date}) {
    // On release, force immediate report load
    this.startDate = this.formatDate(event.start);
    this.endDate = this.formatDate(event.end);
    this.loadReport();
  }

  formatDate(date: Date): string {
    // yyyy-MM-dd
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
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
    reportPayment(row: IncomeRow | { person_id: number, client_name: string, total: number }) {
      // תומך גם ב-IncomeRow וגם באובייקט מהשרת
      const name = (row as any).name || (row as any).client_name || '';
      alert('דיווח על תשלום עבור: ' + name);
    }
}
