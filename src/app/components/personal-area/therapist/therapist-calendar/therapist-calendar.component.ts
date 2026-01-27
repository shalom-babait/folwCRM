import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { ApppointmentService } from 'src/app/services/apppointment.service';
import { PatientService } from 'src/app/services/patient.service';
import { Appointment } from 'src/app/models/appointment.model';
import { Patient, PatientCreationData } from 'src/app/models/patient.model';

@Component({
  selector: 'app-therapist-calendar',
  templateUrl: './therapist-calendar.component.html',
  styleUrls: ['./therapist-calendar.component.css']
})
export class TherapistCalendarComponent implements OnInit, OnDestroy {
  @Input() therapistId?: number;
  @Input() compact: boolean = false;
  allAppointments: Appointment[] = [];
  calendarEvents: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private apppointmentService: ApppointmentService, private patientService: PatientService) { }

  ngOnInit() {
    let therapistIdToUse = this.therapistId;
    if (!therapistIdToUse) {
      const therapistIdStr = localStorage.getItem('therapist_id');
      if (therapistIdStr) {
        therapistIdToUse = Number(therapistIdStr);
      } else {
        const therapistObjStr = localStorage.getItem('therapist');
        if (therapistObjStr) {
          try {
            const therapistObj = JSON.parse(therapistObjStr);
            if (therapistObj && therapistObj.therapist_id) {
              therapistIdToUse = Number(therapistObj.therapist_id);
            }
          } catch { }
        }
      }
    }
    if (therapistIdToUse) {
      this.therapistId = therapistIdToUse;
  this.apppointmentService.getAppointmentsForTherapist(therapistIdToUse)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (appointments) => {
            this.allAppointments = appointments;
            const patientIds = Array.from(new Set(appointments.map(app => app.patient_id)));
            forkJoin(
              patientIds.map(pid => this.patientService.getPatientById(pid!))
            ).subscribe((patients: PatientCreationData[]) => {
              const patientMap: { [id: number]: string } = {};
              patients.forEach((p, idx) => {
                // console.log('getPatientById for pid', patientIds[idx], 'returned:', p);
                if (p && p.patient && p.patient.patient_id) {
              patientMap[p.patient.patient_id] = (p.person.first_name || '') + ' ' + (p.person.last_name || '');                }
              });
              // console.log('patientMap:', patientMap);

              this.calendarEvents = appointments.map(app => {
                const dateStr = app.appointment_date ? app.appointment_date.substring(0, 10) : '';
                const startTimeStr = app.start_time ? app.start_time.substring(0, 5) : '00:00';
                const endTimeStr = app.end_time ? app.end_time.substring(0, 5) : '00:00';
                return { title: patientMap[app.patient_id!] || 'פגישה', start: this.formatWithAddedDays(dateStr, startTimeStr), end: this.formatWithAddedDays(dateStr, endTimeStr), color: '#1a237e' };
              });
              // console.log('All therapist appointments loaded:', this.allAppointments);
              // console.log('calendarEvents:', this.calendarEvents);
            });
          },
          error: (error) => {
            console.error('Error loading all therapist appointments:', error);
            this.allAppointments = [];
          }
        });
    } else {
      console.error('No therapistId provided to TherapistCalendarComponent');
      this.allAppointments = [];
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formatWithAddedDays(date?: string, time = '00:00', days = 1): string {
    if (!date) return '';
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    const dt = new Date(y, m - 1, d, hh, mm);
    dt.setDate(dt.getDate() + days);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  }
}
