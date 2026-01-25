import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionComponent } from 'src/app/components/personal-area/company-manager/payment/add-transaction/add-transaction.component';
import { ReportsService } from 'src/app/services/reports.service';
import { OpenDebtReportItem } from 'src/app/models/reports.model';

@Component({
  selector: 'app-debt-report',
  templateUrl: './debt-report.component.html',
  styleUrls: ['./debt-report.component.css']
})
export class DebtReportComponent implements OnInit {
  debts: OpenDebtReportItem[] = [];

  constructor(private reportsService: ReportsService, private dialog: MatDialog) {}

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

  reportPayment(row: OpenDebtReportItem): void {
    const dialogRef = this.dialog.open(AddTransactionComponent, {
      width: '500px',
      data: {
        person_id: row.person_id,
        mode: 'add',
        openMode: 'credit',
        therapist_id: this.getTherapistId()
      }
    });

    dialogRef.componentInstance.transactionAdded.subscribe(() => {
      this.ngOnInit(); // רענון הדוח
      dialogRef.close();
    });

    dialogRef.componentInstance.cancelled.subscribe(() => {
      dialogRef.close();
    });
  }
}
