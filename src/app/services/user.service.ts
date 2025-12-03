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

  createTherapist(
    userData: UserDataWithPerson,
    therapistData: TherapistData,
    selectedDepartments: Array<{ department_id: number; group_ids: number[] }>
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/therapists/create`, {
      user: userData,
      therapist: therapistData,
      selectedDepartments
    });
  }

  createPatient(userData: UserData, patientData: PatientBase): Observable<any> {
    return this.http.post(`${this.apiUrl}/patient`, { userData, patientData });
  }

  getAllTherapists(): Observable<TherapistCreationData[]> {
    return this.http.get<TherapistCreationData[]>(`${this.apiUrl}/therapists/all`);
  }

  searchTherapists(searchTerm: string): Observable<TherapistCreationData[]> {
    return this.http.get<TherapistCreationData[]>(`${this.apiUrl}/therapists/search?name=${encodeURIComponent(searchTerm)}`);
  }
}