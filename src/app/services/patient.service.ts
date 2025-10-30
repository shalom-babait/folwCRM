
import { Patient, CreatePatientRequest, UpdatePatientRequest } from 'src/app/models/patient.model';
import { ApiResponse } from 'src/app/models/api-response.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Appointment, CreateAppointmentRequest, AppointmentResponse } from 'src/app/models/appointment.model';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  getPatientOnly(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/only/${patientId}`);
  }

  /**
   * מחזיר את כל הפגישות של חדר מסוים
   */
  getAppointmentsByRoomId(roomId: number): Observable<Appointment[]> {
    return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/appointments/byRoom/${roomId}`)
      .pipe(
        map((response: ApiResponse<Appointment[]>) => response.data || []),
        catchError(() => of([]))
      );
  }

  /**
   * מחזיר פגישה בודדת לפי מזהה
   */
  getAppointmentById(appointmentId: number): Observable<Appointment> {
    return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/appointments/${appointmentId}`)
      .pipe(
        map((response: ApiResponse<Appointment>) => response.data as Appointment)
      );
  }
  private apiUrl = environment.apiUrl;

  // BehaviorSubjects לניהול מצב
  private selectedPatientSubject = new BehaviorSubject<number | null>(null);
  private patientsListSubject = new BehaviorSubject<Patient[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observable streams
  selectedPatient$ = this.selectedPatientSubject.asObservable();
  patientsList$ = this.patientsListSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }


  createPatient(patientData: CreatePatientRequest): Observable<ApiResponse<Patient>> {
    this.setLoading(true);

    return this.http.post<ApiResponse<Patient>>(
      this.apiUrl + '/patients',
      patientData,
      this.httpOptions
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.addPatientToLocalList(response.data);
        }
      }),
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }

  createAppointment(appointmentData: CreateAppointmentRequest): Observable<ApiResponse<Appointment>> {
    this.setLoading(true);

    return this.http.post<ApiResponse<Appointment>>(
      this.apiUrl + '/appointments',
      appointmentData,
      this.httpOptions
    ).pipe(
      tap(response => {
        console.log('Appointment created successfully:', response);
      }),
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }
updatePatient(patientId: number, updatedPatient: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/patients/updatePatient/${patientId}`, updatedPatient);
}
  getAllPatients(): Observable<Patient[]> {
    this.setLoading(true);

    return this.http.get<ApiResponse<Patient[]>>(`${this.apiUrl}/patients`).pipe(
      map(response => response.data || []),
      tap(patients => this.patientsListSubject.next(patients)),
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }


getPatientsByTherapist(therapistId: number): Observable<Patient[]> {
  this.setLoading(true);

  return this.http.get<Patient[]>(
    `${this.apiUrl}/patients/byTherapist/${therapistId}`
  ).pipe(
    tap(patients => this.patientsListSubject.next(patients)),
    catchError(this.handleError.bind(this)),
    tap(() => this.setLoading(false))
  );
}
  getPatientById(patient_id: number): Observable<Patient> {
    this.setLoading(true);

    return this.http.get<Patient>(
      `${this.apiUrl}/patients/only/${patient_id}`
    ).pipe(
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }

  searchPatients(searchTerm: string): Observable<Patient[]> {
    if (!searchTerm.trim()) {
      return of([]);
    }

    this.setLoading(true);

    return this.http.get<ApiResponse<Patient[]>>(
      `${this.apiUrl}/patients/search?q=${encodeURIComponent(searchTerm)}`
    ).pipe(
      map(response => response.data || []),
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }


  selectPatient(patient_id: number | null): void {
    this.selectedPatientSubject.next(patient_id);
  }


  private addPatientToLocalList(patient: Patient): void {
    const currentList = this.patientsListSubject.value;
    this.patientsListSubject.next([...currentList, patient]);
  }


getTreatments(patient_id?: number): Observable<AppointmentResponse[]> {
  if (patient_id) {
    return this.http.get<ApiResponse<AppointmentResponse[]>>(
      `${environment.apiUrl}/treatments/patient/${patient_id}`
    ).pipe(
      map(response => response.data || []),
      catchError(() => this.getMockTreatments(patient_id))
    );
  }
  return this.getMockTreatments(patient_id);
}

  private getMockTreatments(patient_id?: number): Observable<AppointmentResponse[]> {
    const id = patient_id || 1;
    console.log('Fetching appointments for patient_id:', id);
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/appointments/${id}/1`).pipe(
      tap(appointments => {
        console.log('Raw appointments:', appointments);
      }),
      map(appointments => {
        if (!appointments || appointments.length === 0) {
          console.log('No appointments found');
          return [];
        }
        return appointments;
      }),
      catchError(error => {
        console.error('Error fetching appointments:', error);
        return of([]);
      })
    );
  }
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);

    let errorMessage = 'שגיאה לא ידועה בשרת';

    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.error) {
        errorMessage = error.error.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    switch (error.status) {
      case 400:
        errorMessage = 'נתונים שגויים או חסרים';
        break;
      case 401:
        errorMessage = 'אין הרשאה לבצע פעולה זו';
        break;
      case 403:
        errorMessage = 'גישה אסורה';
        break;
      case 404:
        errorMessage = 'המטופל לא נמצא';
        break;
      case 409:
        errorMessage = 'המטופל כבר קיים במערכת';
        break;
      case 500:
        errorMessage = 'שגיאה בשרת - נסה שוב מאוחר יותר';
        break;
      case 0:
        errorMessage = 'אין חיבור לשרת';
        break;
    }

    return throwError(() => new Error(errorMessage));
  }
deletePatient(patientId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/patients/deletePatient/${patientId}`);
}

getAppointmentsByPatientId(patientId: number): Observable<Appointment[]> {
  // שימוש במוק עבור סביבת פיתוח/טסט
  const obs = this.getMockTreatments(patientId) as Observable<Appointment[]>;
  obs.subscribe(appointments => {
    console.log('Appointments returned from getAppointmentsByPatientId:', appointments);
  });
  return obs;
}
}