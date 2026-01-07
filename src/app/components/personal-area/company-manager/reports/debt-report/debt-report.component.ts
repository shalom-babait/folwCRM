import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';
import { OpenDebtReportItem } from 'src/app/models/reports.model';

@Component({
  selector: 'app-debt-report',
  templateUrl: './debt-report.component.html',
  styleUrls: ['./debt-report.component.css']
})
export class DebtReportComponent implements OnInit {
  debts: OpenDebtReportItem[] = [];

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    const therapistId = this.getTherapistId();
    if (therapistId) {
      this.reportsService.getOpenDebtsByTherapist(therapistId).subscribe((data: any) => {
        let debtsList: any[] = [];
        if (Array.isArray(data)) {
          debtsList = data;
        } else if (data && Array.isArray(data.items)) {
          debtsList = data.items;
        } else if (data && Array.isArray(data.rows)) {
          debtsList = data.rows;
        } else if (data && Array.isArray(data.data)) {
          debtsList = data.data;
        }
        this.debts = debtsList;
        console.log('רשימת החובות מהשרת:', debtsList);
      });
    }
  }

  getTherapistId(): number | null {
    // נטען מה-localStorage או ממקור אחר
    const id = localStorage.getItem('therapist_id');
    return id ? Number(id) : null;
  }

  getTotalDebts(): number {
    return this.debts.reduce((sum, row) => sum + Number(row.open_balance), 0);
  }
}
