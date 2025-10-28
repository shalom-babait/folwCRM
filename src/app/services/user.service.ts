import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from '../models/user.model';
import { PatientData } from '../models/patient.model';
import { TherapistCreationData, TherapistData } from '../models/therapist.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  createUser(userData: UserData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }

  createTherapist(userData: UserData, therapistData: TherapistData): Observable<any> {
    console.log("service front end!!!!!!!!!!!!!");
    console.log(this.http.post(`${this.apiUrl}/therapists`, { user: userData, therapist: therapistData }));
    return this.http.post(`${this.apiUrl}/therapists/create`, { user: userData, therapist: therapistData });
  }

  createPatient(userData: UserData, patientData: PatientData): Observable<any> {
    return this.http.post(`${this.apiUrl}/patient`, { userData, patientData });
  }

  getAllTherapists(): Observable<TherapistCreationData[]> {
    return this.http.get<TherapistCreationData[]>(`${this.apiUrl}/therapists/all`);
  }

  searchTherapists(searchTerm: string): Observable<TherapistCreationData[]> {
    return this.http.get<TherapistCreationData[]>(`${this.apiUrl}/therapists/search?name=${encodeURIComponent(searchTerm)}`);
  }
}