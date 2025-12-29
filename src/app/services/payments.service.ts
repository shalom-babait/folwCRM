
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PaymentService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /** מחזיר את כל התשלומים של מטופל לפי patient_id */
  getPaymentsByPatientId(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payments/getAllPatientPayments/${patientId}`);
  }

  /** דוח הכנסות לפי מטפל */
  getTherapistMonthlyPaymentsList(therapistId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/payments/monthly-list/${therapistId}`);
  }

  createPayment(paymentData: any) {
    console.log(paymentData);
    
    return this.http.post(`${this.apiUrl}/payments/create`, paymentData);
  }

  getAppointments(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/patient/${patientId}`);
  }
    /** מוחק תשלום לפי payment_id */
  deletePayment(paymentId: number) {
    return this.http.delete(`${this.apiUrl}/payments/delete/${paymentId}`);
  }
}
