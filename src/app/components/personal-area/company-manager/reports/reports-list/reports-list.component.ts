import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddReportsComponent } from '../add-reports/add-reports.component';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css',
    '../../../../../styles/list-cards.css'
  ]
})
export class ReportsListComponent {
  selectedReport: string | null = null;
  @Output() reportSelected = new EventEmitter<{ id: number, name: string }>();
  reports: { id: number, name: string }[] = [
    { id: 1, name: 'דוח הכנסות' },
    { id: 2, name: 'דוח הוצאות' },
    { id: 3, name: 'דוח פעילות חודשית' },
    { id: -1, name: 'דוח חובות פתוחות' }
  ];
  selectedReportId: number | null = null;
  isLoading: boolean = false;

  constructor(private dialog: MatDialog) {}

  openAddReportDialog(): void {
    const dialogRef = this.dialog.open(AddReportsComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false,
      direction: 'rtl',
      panelClass: 'add-report-dialog'
    });

    dialogRef.afterClosed().subscribe((result: { id: number, name: string } | null) => {
      if (result) {
        this.onReportSave(result);
      }
      // אם result הוא null/undefined - המשתמש לחץ על "ביטול"
    });
  }

  onReportSave(data: { id: number, name: string }) {
    // לאחר הוספת דוח חדש, טען מחדש את רשימת הדוחות
    this.refreshReportsList();
  }

  refreshReportsList(): void {
    // כאן תוכל להטעין מחדש מהשרת, כרגע דמו
    // this.loadReports();
  }

  openSearchDialog(): void {
    const searchTerm = prompt('הכנס שם דוח לחיפוש:');
    if (searchTerm && searchTerm.trim()) {
      this.isLoading = true;
      setTimeout(() => {
        this.reports = this.reports.filter(r => r.name.includes(searchTerm));
        this.isLoading = false;
      }, 700);
    }
  }


  viewReportDetails(report: { id: number, name: string }): void {
    this.selectedReportId = report.id;
    this.selectedReport = null;
    this.reportSelected.emit(report);
  }

  selectDebtsReport(): void {
    this.selectedReport = 'debts';
    this.selectedReportId = null;
  this.reportSelected.emit({ id: -1, name: 'דוח חובות פתוחות' });
  }

  downloadReport(report: { id: number, name: string }): void {
    alert('הורדת דוח: ' + report.name);
    // כאן תוכל להוסיף הורדה אמיתית
  }
}
