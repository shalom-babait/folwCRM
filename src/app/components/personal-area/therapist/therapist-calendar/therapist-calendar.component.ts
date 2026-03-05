import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { ApppointmentService } from 'src/app/services/apppointment.service';
import { PatientService } from 'src/app/services/patient.service';
import { Appointment } from 'src/app/models/appointment.model';
import { Patient, PatientCreationData } from 'src/app/models/patient.model';
import { FilterSelection } from 'src/app/models/calendar-filter.model';
import { DisplayCalendarComponent } from '../../company-manager/calendars/display-calendar/display-calendar.component';
import { CalendarStateService } from 'src/app/services/calendar-state.service';

@Component({
  selector: 'app-therapist-calendar',
  templateUrl: './therapist-calendar.component.html',
  styleUrls: ['./therapist-calendar.component.css']
})
export class TherapistCalendarComponent implements OnInit, OnDestroy {
  @Input() therapistId?: number;
  @Input() compact: boolean = false;
  @ViewChild('mainCalendar') mainCalendar?: DisplayCalendarComponent;
  
  allAppointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  calendarEvents: any[] = [];
  
  private patientMap: { [id: number]: string } = {};
  private currentFilter: FilterSelection = {
    selectedPatientIds: [],
    selectedRoomIds: [],
    showAll: true
  };
  
  private destroy$ = new Subject<void>();

  constructor(
    private apppointmentService: ApppointmentService, 
    private patientService: PatientService,
    private calendarStateService: CalendarStateService
  ) { }

  ngOnInit() {
    // האזנה לשינויים במצב התאריך הנבחר
    this.calendarStateService.selectedDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        if (date && this.mainCalendar) {
          this.mainCalendar.navigateToDate(date);
        }
      });

    let therapistIdToUse = this.therapistId;
    if (!therapistIdToUse) {
      const therapistIdStr = localStorage.getItem('therapist_id');
      if (therapistIdStr) {
        therapistIdToUse = Number(therapistIdStr);
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
              // בניית מפת מטופלים
              patients.forEach((p, idx) => {
                if (p && p.patient && p.patient.patient_id) {
                  this.patientMap[p.patient.patient_id] = (p.person.first_name || '') + ' ' + (p.person.last_name || '');
                }
              });
              
              // עדכון בהתחלה - הצגת הכל
              this.filteredAppointments = [...appointments];
              this.updateCalendarEvents();
            });
          },
          error: (error) => {
            this.allAppointments = [];
            this.filteredAppointments = [];
          }
        });
    } else {
      this.allAppointments = [];
      this.filteredAppointments = [];
    }
  }

  /**
   * טיפול בשינוי סינון מהמניו
   */
  onFilterChanged(filter: FilterSelection): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  /**
   * יישום הסינון על הפגישות
   */
  private applyFilter(): void {
    if (this.currentFilter.showAll) {
      // הצגת הכל
      this.filteredAppointments = [...this.allAppointments];
    } else {
      // סינון לפי מטופלים וחדרים נבחרים
      const hasPatientFilter = this.currentFilter.selectedPatientIds.length > 0;
      const hasRoomFilter = this.currentFilter.selectedRoomIds.length > 0;
      
      this.filteredAppointments = this.allAppointments.filter(app => {
        // אם אין סינון מטופלים - כל המטופלים עוברים
        const patientMatch = !hasPatientFilter || 
          this.currentFilter.selectedPatientIds.includes(app.patient_id!);
        
        // אם אין סינון חדרים - כל הפגישות עוברות
        // אם יש סינון חדרים - פגישות ללא חדר תמיד עוברות, ופגישות עם חדר רק אם החדר נבחר
        const roomMatch = !hasRoomFilter || 
          !app.room_id || 
          this.currentFilter.selectedRoomIds.includes(app.room_id);
        
        return patientMatch && roomMatch;
      });
    }
    
    this.updateCalendarEvents();
  }

  /**
   * עדכון אירועי היומן על בסיס הפגישות המסוננות
   */
  private updateCalendarEvents(): void {
    this.calendarEvents = this.filteredAppointments.map(app => {
      const dateStr = app.appointment_date ? app.appointment_date.substring(0, 10) : '';
      const startTimeStr = app.start_time ? app.start_time.substring(0, 5) : '00:00';
      const endTimeStr = app.end_time ? app.end_time.substring(0, 5) : '00:00';
      
      return {
        title: this.patientMap[app.patient_id!] || 'פגישה',
        start: this.formatWithAddedDays(dateStr, startTimeStr, 0),
        end: this.formatWithAddedDays(dateStr, endTimeStr, 0),
        color: '#1a237e'
      };
    });
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
