
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
  getIncomeByMonths(year: number, months: number[], therapistId?: number, userId?: number, organizationId?: number): Observable<any> {
    const body: any = { year, months };
    if (therapistId !== undefined) {
      body.therapist_id = therapistId;
    }
    if (userId !== undefined) {
      body.user_id = userId;
    }
    let orgId = organizationId;
    if (orgId === undefined) {
      const orgFromStorage = localStorage.getItem('organization_id');
      if (orgFromStorage) {
        orgId = Number(orgFromStorage);
      }
    }
    if (orgId !== undefined) {
      body.organization_id = orgId;
    }
    // הסר מפתחות לא דרושים אם הערך שלהם undefined
    Object.keys(body).forEach(key => {
      if (body[key] === undefined) {
        delete body[key];
      }
    });
    return this.http.post(`${this.apiUrl}/income-by-months`, body);
  }

  getOpenDebtsByTherapist(therapist_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/open-debts/${therapist_id}`);
  }
    /**
   * Get last 12 months income for a given year and month
   */
  getMonthlyIncome(year: number, month: number, userId?: number): Observable<any> {
    const body: any = { year, month };
    if (userId !== undefined) {
      body.userId = userId;
    }
    return this.http.post(`${this.apiUrl}/income-last-12`, body);
  }
  /**
   * Get monthly treatments report
   * @param body { therapist_id, organization_id, year, month }
   */
  getMonthlyTreatmentsReport(body: { therapist_id: number, organization_id: number, year: number, month: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/monthly-treatments`, body);
  }
}
