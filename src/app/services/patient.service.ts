import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/models/api-response.model';
import { Patient, CreatePatientRequest, UpdatePatientRequest, PatientCreationData } from 'src/app/models/patient.model';
import { Appointment, CreateAppointmentRequest, AppointmentResponse } from 'src/app/models/appointment.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  
  /** עדכון פציינט ברשימה המקומית */
  updatePatientInList(updatedPatient: PatientCreationData): void {
    const current = this.patientsListSubject.value || [];
    const newList = current.map(p =>
      p.patient.patient_id === updatedPatient.patient.patient_id ? updatedPatient : p
    );
    this.patientsListSubject.next(newList);
  }
  private apiUrl = environment.apiUrl;

  // --- מצב פנימי ---
  private selectedPatientSubject = new BehaviorSubject<number | null>(null);
  private patientsListSubject = new BehaviorSubject<PatientCreationData[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // --- Observable streams ---
  selectedPatient$ = this.selectedPatientSubject.asObservable();
  patientsList$ = this.patientsListSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  // --- יצירת מטופל חדש ---
  createPatient(patientData: PatientCreationData): Observable<ApiResponse<PatientCreationData>> {
    this.setLoading(true);
    console.log('Sending patient creation request:', {
      url: `${this.apiUrl}/patients/create`,
      data: patientData,
      options: this.httpOptions
    });
    return this.http.post<ApiResponse<PatientCreationData>>(
      `${this.apiUrl}/patients/create`,
      patientData,
      this.httpOptions
    ).pipe(
      tap(response => {
        console.log('Received response from patient creation:', response);
        if (response.success && response.data) {
          this.addPatientToLocalList(response.data);
        } else {
          console.error('Patient creation failed, response:', response);
        }
      }),
      catchError(error => {
        console.error('Error during patient creation HTTP request:', error);
        return this.handleError(error);
      }),
      tap(() => {
        console.log('Patient creation request finished');
        this.setLoading(false);
      })
    );
  }

  // --- עדכון מטופל ---
  updatePatient(patientId: number, updatedPatient: UpdatePatientRequest): Observable<ApiResponse<Patient>> {
    this.setLoading(true);
    return this.http.put<ApiResponse<Patient>>(
      `${this.apiUrl}/patients/updatePatient/${patientId}`,
      updatedPatient,
      this.httpOptions
    ).pipe(
      tap(response => {
        if (response && response.success && response.data) {
          const updated = response.data;
          const current = this.patientsListSubject.value || [];
          const newList = current.map(p =>
            p.patient.patient_id === updated.patient_id
              ? { ...p, patient: { ...p.patient, ...updated } }
              : p
          );
          this.patientsListSubject.next(newList);
        }
      }),
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }


  /** מחיקת מטופל כולל הכל */
  deletePatientFull(patientId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/patients/deleteFull/${patientId}`);
    // אם ה-API שלך מתחיל ב-/api, השתמשי ב-/api/patients/deleteFull/${patientId}
  }

  // --- שליפת מטופלים ---

  getAllPatients(): Observable<PatientCreationData[]> {
    this.setLoading(true);
    return this.http.get<any>(`${this.apiUrl}/patients/getAllPatients/`).pipe(
      map(response => {
        const raw = response.data || [];
        return raw.map((item: any) => ({
          person: item.person,
          patient: item.patient,
          user: item.user || {},
          selectedDepartments: item.selectedDepartments || []
        }));
      })
    );
  }

  getPatientsByTherapist(therapistId: number): Observable<PatientCreationData[]> {
    this.setLoading(true);
    return this.http.get<PatientCreationData[]>(`${this.apiUrl}/patients/byTherapist/${therapistId}`).pipe(
      tap(patients => this.patientsListSubject.next(patients)),
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }

  getPatientById(patient_id: number): Observable<PatientCreationData> {
    this.setLoading(true);
    return this.http.get<PatientCreationData>(`${this.apiUrl}/patients/only/${patient_id}`).pipe(
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }

  getPatientOnly(patientId: number): Observable<PatientCreationData> {
    return this.http.get<PatientCreationData>(`${this.apiUrl}/patients/only/${patientId}`);
  }

  searchPatients(searchTerm: string): Observable<PatientCreationData[]> {
    if (!searchTerm.trim()) {
      return of([]);
    }
    this.setLoading(true);
    return this.http.get<ApiResponse<PatientCreationData[]>>(
      `${this.apiUrl}/patients/search?q=${encodeURIComponent(searchTerm)}`
    ).pipe(
      map(response => response.data || []),
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }

  // --- ניהול בחירה ---
  selectPatient(patient_id: number | null): void {
    this.selectedPatientSubject.next(patient_id);
  }

  private addPatientToLocalList(patient: PatientCreationData): void {
    const currentList = this.patientsListSubject.value;
    this.patientsListSubject.next([...currentList, patient]);
  }

  // --- עזר לניהול טעינה ושגיאות ---
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    const errorMessage = this.errorHandler.handleHttpError(error);
    return throwError(() => new Error(errorMessage));
  }
  getTherapistIdByUserId(user_id: number): Observable<number | null> {
    return this.http.get<{ therapist_id?: number }>(`${this.apiUrl}/therapists/byUser/${user_id}`)
      .pipe(
        map((response: { therapist_id?: number }) => response.therapist_id !== undefined ? response.therapist_id : null),
        catchError(error => {
          console.error('Error fetching therapistId by user_id:', error);
          return of(null);
        })
      );
  }


  getAppointmentsForTherapist(therapistId: number): Observable<AppointmentResponse[]> {
    if (!therapistId) {
      console.error('getAppointmentsForTherapist: therapistId is missing!', therapistId);
      return of([]);
    }
    const url = `${this.apiUrl}/appointments/therapist/${therapistId}`;
    console.log('getAppointmentsForTherapist: GET', url, 'therapistId:', therapistId);
    return this.http.get<ApiResponse<AppointmentResponse[]>>(url).pipe(
      map((response: ApiResponse<AppointmentResponse[]>) => response.data || []),
      catchError((error) => {
        console.error('Error fetching appointments for therapist:', error);
        return of([]);
      })
    );
  }
}

