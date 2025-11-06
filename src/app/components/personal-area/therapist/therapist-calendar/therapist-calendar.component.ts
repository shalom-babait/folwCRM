import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { PatientService } from 'src/app/services/patient.service';
import { Appointment } from 'src/app/models/appointment.model';
import { Patient } from 'src/app/models/patient.model';

@Component({
  selector: 'app-therapist-calendar',
  templateUrl: './therapist-calendar.component.html',
  styleUrls: ['./therapist-calendar.component.css']
})
export class TherapistCalendarComponent implements OnInit, OnDestroy {
  allAppointments: Appointment[] = [];
  calendarEvents: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    let user_id: number | null = null;
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        user_id = userObj.user_id;
      } catch (e) {
        user_id = null;
      }
    }
    if (user_id) {
      this.patientService.getTherapistIdByUserId(user_id).subscribe(therapistId => {
        if (therapistId) {
          this.patientService.getTreatmentsForTherapist(therapistId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (appointments) => {
                this.allAppointments = appointments;
                // get all unique patient ids
                const patientIds = Array.from(new Set(appointments.map(app => app.patient_id)));
                // fetch all patients in parallel
                forkJoin(
                  patientIds.map(pid => this.patientService.getPatientById(pid!))
                ).subscribe((patients: Patient[]) => {
                  // map patientId to name
                  const patientMap: { [id: number]: string } = {};
                  patients.forEach(p => {
                    patientMap[p.patient_id!] = (p.first_name ||  '') + ' ' + (p.last_name ||  '');
                  });
                  this.calendarEvents = appointments.map(app => {
                    const dateStr = app.appointment_date ? app.appointment_date.substring(0, 10) : '';
                    const start = dateStr + 'T' + (app.start_time ? app.start_time.substring(0,5) : '00:00');
                    const end = dateStr + 'T' + (app.end_time ? app.end_time.substring(0,5) : '00:00');
                    return {
                      title: patientMap[app.patient_id!] || 'פגישה',
                      start,
                      end,
                      color: '#1a237e'
                    };
                  });
                  console.log('All therapist appointments loaded:', this.allAppointments);
                  console.log('calendarEvents:', this.calendarEvents);
                });
              },
              error: (error) => {
                console.error('Error loading all therapist appointments:', error);
                this.allAppointments = [];
              }
            });
        } else {
          console.error('No therapistId found for user_id:', user_id);
          this.allAppointments = [];
        }
      });
    } else {
      console.error('No user_id found in localStorage');
      this.allAppointments = [];
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
