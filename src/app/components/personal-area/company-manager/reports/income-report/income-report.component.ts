import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PaymentService } from 'src/app/services/payments.service';
import { IncomeFilterService } from 'src/app/services/state/income-filter.service';
import { ReportsService } from 'src/app/services/reports.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { MONTH_LABELS } from 'src/app/shared/constants/month-labels';
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
    // ודא שהערכים הם מספרים
    const y = Number(year);
    const m = Array.isArray(months) ? months.map(Number).filter(v => !isNaN(v)) : [];
    const body = { year: y, months: m, therapistId: this.therapistId };
    // console.log('נשלח לשרת (income-by-months):', body);
    this.reportsService.getIncomeByMonths(y, m, this.therapistId).subscribe({
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
    this.months = MONTH_LABELS.map(label => ({ label, hasData: true }));


    // בחירת החודש הנוכחי כברירת מחדל
    const currentMonthIndex = new Date().getMonth(); // 0-based
    this.selectedMonths = [currentMonthIndex];

    // שליחה אוטומטית לשרת עם השנה והחודש הנוכחיים והtherapistId
    setTimeout(() => {
      if (this.therapistId) {
        this.sendFilterToServer(this.selectedYear, this.selectedMonths);
      }
    }, 0);

    // Debounce for slider changes
    this.sliderChange$.pipe(debounceTime(400)).subscribe(({start, end}) => {
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      this.loadReport();
    });
    // נטען את המזהה מה-localStorage אם לא הועבר מבחוץ
    if (!this.therapistId) {
      const storedId = localStorage.getItem('therapist_id');
      if (storedId) {
        this.therapistId = Number(storedId);
      }
    }
    this.loadReport(); // Call loadReport without filter values
    this.filterSubscription = this.incomeFilterService.filter$.subscribe(filterArr => {
      if (Array.isArray(filterArr) && filterArr.length > 0) {
        // שלח בקשה לכל בחירה (שנה+חודשים)
        filterArr.forEach(f => {
          if (f && f.year && Array.isArray(f.months) && f.months.length > 0) {
            this.sendFilterToServer(f.year, f.months);
          }
        });
      }
    });
  }

  onSelectedMonthsChange(selected: number[]) {
  // קבלת חודשים נבחרים בלבד, ללא ניהול או איפוס
  this.selectedMonths = selected;
  }

  onYearChange(year: number) {
    this.selectedYear = year;
    this.loadReport();
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

  filterType: 'month' = 'month';
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
  chartType: ChartType = 'bar';
  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  constructor(
    private paymentService: PaymentService,
    private incomeFilterService: IncomeFilterService,
    private reportsService: ReportsService
  ) {}

  // Getter שמבטיח תמיד string[] עבור labels
  get chartLabelsSafe(): string[] {
    return (this.chartData.labels as string[]) || [];
  }


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
    // טען נתוני גרף מהשרת בלבד
    this.loadChartYearMonths();
  }

  loadChartYearMonths() {
    // קריאה לשרת לקבלת הכנסות חודשי עבור השנה והחודש הנוכחיים
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-based
    this.reportsService.getMonthlyIncome(year, month).subscribe((res: any) => {
      // console.log('monthlyIncome response:', res);
      const monthlyIncome = Array.isArray(res.data?.monthlyIncome) ? res.data.monthlyIncome : Array(12).fill(0);
      // יצירת תוויות דינמיות בפורמט M/YYYY מהחודש הנוכחי אחורה 12 חודשים
      const now = new Date();
      let month = now.getMonth() + 1; // 1-based
      let year = now.getFullYear();
      const labels: string[] = [];
      for (let i = 0; i < 12; i++) {
        labels.unshift(`${month}/${year}`);
        month--;
        if (month === 0) {
          month = 12;
          year--;
        }
      }
      // המערך מהשרת כבר מסודר מהכי רחוק (שמאל) להכי קרוב (ימין)
      this.chartData = {
        labels,
        datasets: [
          {
            label: 'הכנסות',
            data: monthlyIncome,
            tension: 0.4,
            backgroundColor: 'rgba(0, 200, 83, 0.6)', // ירוק בהיר
            borderColor: 'rgba(0, 150, 50, 1)', // ירוק כהה
            borderWidth: 2
          }
        ]
      };
    });
  }



  reportPayment(row: import('src/app/models/reports.model').IncomeRow | { person_id: number, client_name: string, total: number }) {
    // תומך גם ב-IncomeRow וגם באובייקט מהשרת
    const name = (row as any).name || (row as any).client_name || '';
    alert('דיווח על תשלום עבור: ' + name);
  }
}