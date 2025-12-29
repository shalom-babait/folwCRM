import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css']
})
export class ReportDetailsComponent {
  @Input() report: any;

  onShareEmail() {
    alert('שליחה במייל - בקרוב');
  }

  onDownloadPDF() {
    alert('הורדה PDF - בקרוב');
  }

  onPrint() {
    window.print();
  }
}
