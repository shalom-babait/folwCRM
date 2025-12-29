
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDataWithPerson } from '../models/user.model';
import { TherapistCreationData, TherapistData } from '../models/therapist.model';

@Injectable({
  providedIn: 'root'
})
export class TherapistService {
  getTherapistMonthlyStats(therapistId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/therapists/${therapistId}/monthly-stats`);
  }
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  createTherapist(data: TherapistCreationData): Observable<any> {
    return this.http.post(`${this.apiUrl}/therapists/create`, data);
  }

  getAllTherapists(): Observable<TherapistCreationData[]> {
    return this.http.get<TherapistCreationData[]>(`${this.apiUrl}/therapists/all`);
  }

  searchTherapists(searchTerm: string): Observable<TherapistCreationData[]> {
    return this.http.get<TherapistCreationData[]>(`${this.apiUrl}/therapists/search?name=${encodeURIComponent(searchTerm)}`);
  }
}
