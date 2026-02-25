import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  private apiUrl = `${environment.apiUrl}/sessions`;

  constructor(private http: HttpClient) { }

  updateNotes(appointmentId: number, notes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateNotes`, {
      appointmentId,
      notes
    });
  }
}