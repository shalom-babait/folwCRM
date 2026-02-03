
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

  /**
   * Get income report by months and year
   * @param year Selected year
   * @param months Array of selected month numbers (1-12)
   * @param therapistId Optional therapist id
   */
  getIncomeByMonths(year: number, months: number[], therapistId?: number): Observable<any> {
    const body: any = { year, months };
    if (therapistId !== undefined) {
      body.therapistId = therapistId;
    }
    console.log('getIncomeByMonths - body:', body);
    return this.http.post(`${this.apiUrl}/income-by-months`, body);
  }

  getOpenDebtsByTherapist(therapist_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/open-debts/${therapist_id}`);
  }
    /**
   * Get last 12 months income for a given year and month
   */
  getMonthlyIncome(year: number, month: number): Observable<any> {
    const body = { year, month };
    return this.http.post(`${this.apiUrl}/income-last-12`, body);
  }
}
