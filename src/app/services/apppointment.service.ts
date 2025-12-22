import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApppointmentService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/appointments/deleteAppointment/${appointmentId}`);
  }
}
