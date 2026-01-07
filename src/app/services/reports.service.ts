import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) { }

  getOpenDebtsByTherapist(therapist_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/open-debts/${therapist_id}`);
  }
}
