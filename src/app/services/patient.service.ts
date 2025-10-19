// // patient.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
// import { catchError, tap, map } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';

export interface Patient {
  patient_id?: number;
  user_id?: number;
  therapist_id?: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  gender?: 'זכר' | 'נקבה' | 'אחר';
  status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
  history_notes?: string;
  phone?: string;      
  email?: string;
  address?: string;
  teudat_zehut?: string;
  city?: string
}

// export interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   error?: string;
// }

// export interface CreatePatientRequest {
//   user_id: number;
//   therapist_id?: number;
//   birth_date?: string;
//   gender?: 'זכר' | 'נקבה' | 'אחר';
//   status?: 'פעיל' | 'לא פעיל' | 'בהמתנה';
//   history_notes?: string;
// }

// export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
//   patient_id: number;
// }

// export interface Treatment {
//   treatment_id?: number;
//   patient_id: number;
//   therapist_id: number;
//   date: string;
//   name: string;
//   therapist: string;
//   startTime: string;
//   endTime: string;
//   totalCost: number;
//   notes?: string;
//   status?: 'מתוכנן' | 'בוצע' | 'בוטל';
// }

// export interface Appointment {
//   appointment_id?: number;
//   therapist_id: number;
//   patient_id: number;
//   type_id: number;
//   room_id: number;
//   appointment_date: string;
//   start_time: string;
//   end_time: string;
//   status?: string;
//   notes?: string;
//   total_minutes?: number;
// }

// export interface CreateAppointmentRequest {
//   therapist_id: number;
//   patient_id: number;
//   type_id: number;
//   room_id: number;
//   appointment_date: string;
//   start_time: string;
//   end_time: string;
//   status?: string;
//   notes?: string;
// }

// export interface AppointmentResponse {
//   appointment_date: string;
//   appointment_id: number;
//   end_time: string;
//   room: string;
//   start_time: string;
//   status: string;
//   total_minutes: number;
//   treatment_type: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class PatientService {
//   private apiUrl = environment.apiUrl;

//   // BehaviorSubjects לניהול מצב
//   private selectedPatientSubject = new BehaviorSubject<number | null>(null);
//   private patientsListSubject = new BehaviorSubject<Patient[]>([]);
//   private loadingSubject = new BehaviorSubject<boolean>(false);

//   // Observable streams
//   selectedPatient$ = this.selectedPatientSubject.asObservable();
//   patientsList$ = this.patientsListSubject.asObservable();
//   loading$ = this.loadingSubject.asObservable();

//   private httpOptions = {
//     headers: new HttpHeaders({
//       'Content-Type': 'application/json'
//     })
//   };

//   constructor(private http: HttpClient) { }

//   createPatient(patientData: CreatePatientRequest): Observable<ApiResponse<Patient>> {
//     this.setLoading(true);

//     return this.http.post<ApiResponse<Patient>>(
//       this.apiUrl + '/patients',
//       patientData,
//       this.httpOptions
//     ).pipe(
//       tap(response => {
//         if (response.success && response.data) {
//           this.addPatientToLocalList(response.data);
//         }
//       }),
//       catchError(this.handleError.bind(this)),
//       tap(() => this.setLoading(false))
//     );
//   }

//   createAppointment(appointmentData: CreateAppointmentRequest): Observable<ApiResponse<Appointment>> {
//     this.setLoading(true);

//     return this.http.post<ApiResponse<Appointment>>(
//       this.apiUrl + '/appointments',
//       appointmentData,
//       this.httpOptions
//     ).pipe(
//       tap(response => {
//         console.log('Appointment created successfully:', response);
//       }),
//       catchError(this.handleError.bind(this)),
//       tap(() => this.setLoading(false))
//     );
//   }

//   getAllPatients(): Observable<Patient[]> {
//     this.setLoading(true);

//     return this.http.get<ApiResponse<Patient[]>>(`${this.apiUrl}/patients`).pipe(
//       map(response => response.data || []),
//       tap(patients => this.patientsListSubject.next(patients)),
//       catchError(this.handleError.bind(this)),
//       tap(() => this.setLoading(false))
//     );
//   }




//   getPatientById(patient_id: number): Observable<Patient> {
//     this.setLoading(true);

//     return this.http.get<ApiResponse<Patient>>(
//       `${this.apiUrl}/patients/${patient_id}`
//     ).pipe(
//       map(response => response.data || {} as Patient),
//       catchError(this.handleError.bind(this)),
//       tap(() => this.setLoading(false))
//     );
//   }

//   searchPatients(searchTerm: string): Observable<Patient[]> {
//     if (!searchTerm.trim()) {
//       return of([]);
//     }

//     this.setLoading(true);

//     return this.http.get<ApiResponse<Patient[]>>(
//       `${this.apiUrl}/patients/search?q=${encodeURIComponent(searchTerm)}`
//     ).pipe(
//       map(response => response.data || []),
//       catchError(this.handleError.bind(this)),
//       tap(() => this.setLoading(false))
//     );
//   }

//   selectPatient(patient_id: number | null): void {
//     this.selectedPatientSubject.next(patient_id);
//   }

//   // פונקציה חדשה - קבלת המטופל הנוכחי
//   getCurrentPatient(): Patient | null {
//     const selectedId = this.selectedPatientSubject.value;
//     if (!selectedId) return null;
    
//     const patients = this.patientsListSubject.value;
//     return patients.find(p => p.patient_id === selectedId) || null;
//   }

//   private addPatientToLocalList(patient: Patient): void {
//     const currentList = this.patientsListSubject.value;
//     this.patientsListSubject.next([...currentList, patient]);
//   }

//   getTreatments(patient_id?: number): Observable<AppointmentResponse[]> {
//     // אם יש patientId, קרא מהשרת
//     if (patient_id) {
//       return this.http.get<ApiResponse<AppointmentResponse[]>>(
//         `${environment.apiUrl}/treatments/patient/${patient_id}`
//       ).pipe(
//         map(response => response.data || []),
//         catchError(() => this.getMockTreatments()) // fallback למידע מקומי
//       );
//     }

//     // אחרת השתמש במידע המקומי הקיים
//     return this.getMockTreatments();
//   }

//   private getMockTreatments(): Observable<AppointmentResponse[]> {
//     console.log('Fetching all appointments');
//     return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/appointments/2/1`).pipe(
//       tap(appointments => {
//         console.log('Raw appointments:', appointments);
//       }),
//       map(appointments => {
//         if (!appointments || appointments.length === 0) {
//           console.log('No appointments found');
//           return [];
//         }
//         return appointments; 
//       }),
//       catchError(error => {
//         console.error('Error fetching appointments:', error);
//         return of([]);
//       })
//     );
//   }

//   private setLoading(loading: boolean): void {
//     this.loadingSubject.next(loading);
//   }

//   private handleError(error: HttpErrorResponse): Observable<never> {
//     console.error('An error occurred:', error);

//     let errorMessage = 'שגיאה לא ידועה בשרת';

//     if (error.error) {
//       if (typeof error.error === 'string') {
//         errorMessage = error.error;
//       } else if (error.error.message) {
//         errorMessage = error.error.message;
//       } else if (error.error.error) {
//         errorMessage = error.error.error;
//       }
//     } else if (error.message) {
//       errorMessage = error.message;
//     }

//     switch (error.status) {
//       case 400:
//         errorMessage = 'נתונים שגויים או חסרים';
//         break;
//       case 401:
//         errorMessage = 'אין הרשאה לבצע פעולה זו';
//         break;
//       case 403:
//         errorMessage = 'גישה אסורה';
//         break;
//       case 404:
//         errorMessage = 'המטופל לא נמצא';
//         break;
//       case 409:
//         errorMessage = 'המטופל כבר קיים במערכת';
//         break;
//       case 500:
//         errorMessage = 'שגיאה בשרת - נסה שוב מאוחר יותר';
//         break;
//       case 0:
//         errorMessage = 'אין חיבור לשרת';
//         break;
//     }

//     return throwError(() => new Error(errorMessage));
//   }
// }

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
  total_minutes?: number;
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

export interface AppointmentResponse {
  appointment_date: string;
  appointment_id: number;
  end_time: string;
  room: string;
  start_time: string;
  status: string;
  total_minutes: number;
  treatment_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  getPatientOnly(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/only/${patientId}`);
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
    console.log('Fetching all appointments');
      const id = patient_id || 1;

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
}