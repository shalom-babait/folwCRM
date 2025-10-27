import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from '../models/user.model';
import { PatientData } from '../models/patient.model';
import { TherapistData } from '../models/therapist.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  createUser(userData: UserData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }

  createTherapist(userData: UserData, therapistData: TherapistData): Observable<any> {
    alert('Creating therapist with userData: ' + JSON.stringify(userData) + ' and therapistData: ' + JSON.stringify(therapistData));  
    return this.http.post(`${this.apiUrl}/therapist`, { userData, therapistData });
  }

  createPatient(userData: UserData, patientData: PatientData): Observable<any> {
    return this.http.post(`${this.apiUrl}/patient`, { userData, patientData });
  }

  getAllTherapists(): Observable<TherapistData[]> {
    return this.http.get<TherapistData[]>(`${this.apiUrl}/therapists`);
  }

  searchTherapists(searchTerm: string): Observable<TherapistData[]> {
    return this.http.get<TherapistData[]>(`${this.apiUrl}/therapists/search?name=${encodeURIComponent(searchTerm)}`);
  }
}