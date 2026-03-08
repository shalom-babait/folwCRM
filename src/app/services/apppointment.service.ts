import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Appointment, CreateAppointmentRequest, AppointmentResponse } from '../models/appointment.model';
import { ApiResponse } from '../models/api-response.model';


@Injectable({
  providedIn: 'root'
})
export class ApppointmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/appointments/deleteAppointment/${appointmentId}`);
  }

  /** עדכון פגישה מלאה */
  updateAppointment(appointmentId: number, appointment: Partial<Appointment>): Observable<ApiResponse<Appointment>> {
    console.log('updateAppointment - sending object:', appointment);
    const url = `${this.apiUrl}/appointments/updateAppointment/${appointmentId}`;
    console.log('updateAppointment - url:', url);
    return this.http.put<ApiResponse<Appointment>>(
      url,
      appointment
    ).pipe(
      tap({
        next: (res: ApiResponse<Appointment>) => console.log('updateAppointment - response:', res),
        error: (err: any) => console.error('updateAppointment - error:', err)
      })
    );
  }

  // --- CRUD ופונקציות נוספות לפגישות ---
  createAppointment(appointmentData: CreateAppointmentRequest): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(
      `${this.apiUrl}/appointments`,
      appointmentData
    ).pipe(
      tap(response => console.log('Appointment created successfully:', response)),
      catchError((error) => { console.error('Error creating appointment:', error); throw error; })
    );
  }

  getAppointmentsByRoom(roomId: number): Observable<Appointment[]> {
    return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/appointments/byRoom/${roomId}`).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  getAppointmentById(appointmentId: number): Observable<Appointment> {
    return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/appointments/${appointmentId}`).pipe(
      map(response => response.data as Appointment)
    );
  }

  getAppointmentsByPatient(patientId: number, therapistId?: number): Observable<Appointment[]> {
    const tid = typeof therapistId === 'number' ? therapistId : 0;
    // console.log('getAppointmentsByPatient - patientId:', patientId, 'therapistId:', tid);
    const url = `${this.apiUrl}/appointments/byPatientAndTherapist/${patientId}/${tid}`;
    return this.http.get<ApiResponse<Appointment[]>>(url)
      .pipe(
        map(response => Array.isArray(response) ? response : (response.data || [])),
        tap(appointments => {
          // console.log('Appointments returned from getAppointmentsByPatient:', appointments);
        }),
        catchError(error => {
          console.error('Error fetching appointments for patient:', error);
          return of([]);
        })
      );
  }

  updateAppointmentStatus(appointmentId: number, status: string): Observable<ApiResponse<any>> {
    const body = { status };
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/appointments/${appointmentId}/status`,
      body
    ).pipe(
      tap(response => console.log('Appointment status updated:', response)),
      catchError((error) => { console.error('Error updating appointment status:', error); throw error; })
    );
  }

  getAppointmentsByPatientId(patient_id: number): Observable<AppointmentResponse[]> {
    if (patient_id) {
      return this.http.get<any>(
        `${this.apiUrl}/appointments/patient/${patient_id}`
      ).pipe(
        map((response: any) => {
          const arr = Array.isArray(response) ? response : (response.data || []);
          return arr.map((item: any) => ({
            ...item,
            group_name: item.type_name ?? '',
            room: item.room ?? '',
            end_time: item.end_time ?? '',
            total_minutes: item.total_minutes ?? 0,
            status: item.status ?? '',
          }));
        }),
        catchError(error => {
          return of([]);
        })
      );
    }
    return of([]);
  }

  getAppointmentsForTherapist(therapistId: number): Observable<AppointmentResponse[]> {
    // console.log('getAppointmentsForTherapist - therapistId:', therapistId);
    if (!therapistId) {
      // console.error('getAppointmentsForTherapist: therapistId is missing!', therapistId);
      return of([]);
    }
    const url = `${this.apiUrl}/appointments/therapist/${therapistId}`;
    return this.http.get<ApiResponse<AppointmentResponse[]>>(url).pipe(
      map((response: ApiResponse<AppointmentResponse[]>) => response.data || []),
      catchError((error) => {
        console.error('Error fetching appointments for therapist:', error);
        return of([]);
      })
    );
  }
  
  updateNotes(appointmentId: number, notes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/appointments/updateNotes`, {
      appointmentId,
      notes
    });
  }
}
