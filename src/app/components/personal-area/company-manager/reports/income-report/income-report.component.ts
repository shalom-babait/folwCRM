import { Component, Input, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payments.service';

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
  filterType: 'month' | 'quarter' | 'range' = 'month';
  startDate: string = '';
  endDate: string = '';
  rows: IncomeRow[] = [];
  totalIncome: number = 0;

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
      });
    } else {
      // דמו לשאר הפילטרים
      this.rows = [];
      this.totalIncome = 0;
    }
  }
}
