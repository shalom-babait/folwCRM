import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Patient {
  patient_id?: number;
  user_id?: number;    
  therapist_id?: number;
  firstName?: string;
  lastName?: string;
  birth_date?: string;
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CreatePatientRequest {
  user_id: number;
  therapist_id?: number;
  birth_date?: string;
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  patient_id: number;
}

export interface Treatment {
  treatment_id?: number;
  patient_id: number;
  therapist_id: number;
  date: string;
  name: string;
  therapist: string;
  startTime: string;
  endTime: string;
  totalCost: number;
  notes?: string;
  status?: 'מתוכנן' | 'בוצע' | 'בוטל';
}
export interface Appointment {
  appointment_id?: number;
  therapist_id: number;
  patient_id: number;
  type_id: number;
  room_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAppointmentRequest {
  therapist_id: number;
  patient_id: number;
  type_id: number;
  room_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status?: string;
  notes?: string;
}
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = environment.apiUrl ;
  
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

  constructor(private http: HttpClient) {}


  createPatient(patientData: CreatePatientRequest): Observable<ApiResponse<Patient>> {
    this.setLoading(true);
    
    return this.http.post<ApiResponse<Patient>>(
      this.apiUrl+ '/patients', 
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

  getAllPatients(): Observable<Patient[]> {
    this.setLoading(true);
    
    return this.http.get<ApiResponse<Patient[]>>(`${this.apiUrl}`).pipe(
      map(response => response.data || []),
      tap(patients => this.patientsListSubject.next(patients)),
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }


  getPatientsByTherapist(therapistId: number): Observable<Patient[]> {
    this.setLoading(true);
    
    return this.http.get<ApiResponse<Patient[]>>(
      `${this.apiUrl}/byTherapist/${therapistId}`
    ).pipe(
      map(response => response.data || []),
      tap(patients => this.patientsListSubject.next(patients)),
      catchError(this.handleError.bind(this)),
      tap(() => this.setLoading(false))
    );
  }

  getPatientById(patient_id: number): Observable<Patient> {
    this.setLoading(true);
    
    return this.http.get<ApiResponse<Patient>>(
      `${this.apiUrl}/${patient_id}`
    ).pipe(
      map(response => response.data || {} as Patient),
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
      `${this.apiUrl}/search?q=${encodeURIComponent(searchTerm)}`
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


  getTreatments(patient_id?: number): Observable<Treatment[]> {
    // אם יש patientId, קרא מהשרת
    if (patient_id) {
      return this.http.get<ApiResponse<Treatment[]>>(
        `${environment.apiUrl}/treatments/patient/${patient_id}`
      ).pipe(
        map(response => response.data || []),
        catchError(() => this.getMockTreatments()) // fallback למידע מקומי
      );
    }
    
    // אחרת השתמש במידע המקומי הקיים
    return this.getMockTreatments();
  }

 
  private getMockTreatments(): Observable<Treatment[]> {
    const treatments: Treatment[] = [
      { 
        treatment_id: 1,
        patient_id: 1,
        therapist_id: 1,
        date: '15/09/2025', 
        name: 'פגישה טלפונית', 
        therapist: 'מרפאה מרכזית', 
        startTime: '10:00', 
        endTime: '11:00', 
        totalCost: 200,
        status: 'בוצע'
      },
      { 
        treatment_id: 2,
        patient_id: 1,
        therapist_id: 1,
        date: '10/09/2025', 
        name: 'פגישה אישית', 
        therapist: 'קליניקה רעננה', 
        startTime: '14:30', 
        endTime: '15:30', 
        totalCost: 350,
        status: 'בוצע'
      },
      { 
        treatment_id: 3,
        patient_id: 1,
        therapist_id: 1,
        date: '01/09/2025', 
        name: 'פגישה בזום', 
        therapist: 'משרד ביתי', 
        startTime: '09:00', 
        endTime: '10:00', 
        totalCost: 250,
        status: 'בוצע'
      }
    ];
    return of(treatments);
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

 
}