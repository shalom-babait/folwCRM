import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css']
})


export class ReportDetailsComponent {
  constructor(private pdfService: PdfService) {}
  @Input() report: any;
  @ViewChild('reportContent') reportContent!: ElementRef;

  onShareEmail() {
    alert('שליחה במייל - בקרוב');
  }

  onDownloadPDF() {
    const html = this.reportContent.nativeElement.innerHTML;
  this.pdfService.generatePdf(html).subscribe((blob: any) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Report.pdf';
      a.click();
    });
  }

  onPrint() {
    window.print();
  }
}
