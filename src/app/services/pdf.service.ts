
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private http: HttpClient) {}

  generatePdf(html: string): Observable<Blob> {
    return this.http.post(
      `${environment.apiUrl}/reports/generate-pdf`,
      { html },
      { responseType: 'blob' }
    );
  }
}
