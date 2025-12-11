import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData, UserDataWithPerson } from '../models/user.model';
import { PatientBase  } from '../models/patient.model';
import { TherapistCreationData, TherapistData } from '../models/therapist.model';
import { environment } from '../../environments/environment';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  createUser(userData: UserData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }

  createPatient(userData: UserData, patientData: PatientBase): Observable<any> {
    return this.http.post(`${this.apiUrl}/patient`, { userData, patientData });
  }
}