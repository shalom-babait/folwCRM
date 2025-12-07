import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateTreatmentDialogComponent } from '../add-treatment-dialog/add-treatment-dialog.component';
import { PatientService } from 'src/app/services/patient.service';
import { Appointment } from 'src/app/models/appointment.model';
import { RoomCalendarComponent } from '../../company-manager/rooms/room-calendar/room-calendar.component';
@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.component.html',
  styleUrls: ['./treatment-list.component.css',
    '../../../../styles/list-cards.css']
})
export class TreatmentListComponent implements OnInit {
  ngOnChanges(changes: any): void {
    if (changes.appointments && changes.appointments.currentValue) {
      this.appointments = changes.appointments.currentValue;
    }
  }
  @Input() appointments: Appointment[] = [];
  @Input() patientId: number | undefined;
  @Input() patient?: Patient;
  @Output() appointmentAdded = new EventEmitter<Appointment>();
  @Output() appointmentDeleted = new EventEmitter<number>();

  searchTerm: string = '';
  showAppointments: Appointment[] = [];
  editingAppointment: Appointment | null = null;
  statusOptions: string[] = ['מתוזמנת', 'בוטלה', 'נדחתה', 'הושלמה'];

  constructor(
    private dialog: MatDialog,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    // טען טיפולים מהשרת אם לא מועבר מערך טיפולים
    if (this.appointments.length === 0 && this.patientId) {
      this.patientService.getTreatments(this.patientId).subscribe(data => {
        this.appointments = data;
      });
    }
  }

  // פתיחת דיאלוג יומן עם הפגישות
  openCalendarDialog(): void {
    // המרת הפגישות לפורמט FullCalendar
    const events = this.filteredAppointments.map(app => {
      // יצירת תאריך התחלה וסיום לפי אזור זמן ישראל
      const baseDate = new Date(app.appointment_date);
      const [startHour, startMinute] = app.start_time.split(':');
      const [endHour, endMinute] = app.end_time.split(':');
      // תאריך התחלה
      const startDate = new Date(baseDate);
      startDate.setHours(Number(startHour), Number(startMinute), 0, 0);
      // תאריך סיום
      const endDate = new Date(baseDate);
      endDate.setHours(Number(endHour), Number(endMinute), 0, 0);
      return {
        id: app.appointment_id,
        title: (app.group_name ) + (app.room ? ' - ' + app.room : ''),
        start: startDate.toISOString().slice(0, 16),
        end: endDate.toISOString().slice(0, 16),
        extendedProps: {
          patient_id: app.patient_id,
          total_minutes: app.total_minutes
        }
      };
    });
    this.dialog.open(RoomCalendarComponent, {
      width: '900px',
      direction: 'rtl',
      data: {
        events,
        patientId: this.patientId
      }
    });
  }

  // פילטר טיפולים לפי תאריך
  get filteredAppointments(): Appointment[] {
    let filtered = this.appointments;
    if (this.appointments.length > 0 && this.appointments[0].patient_id) {
      const patientId = this.appointments[0].patient_id;
      filtered = filtered.filter(a => a.patient_id === patientId);
    }
    if (!this.searchTerm.trim()) {
      return filtered;
    }
    return filtered.filter(appointment =>
      appointment.appointment_date.includes(this.searchTerm)
    );
  }

  // פתיחת דיאלוג הוספת טיפול
  openCreateAppointmentDialog(): void {
    const dialogRef = this.dialog.open(CreateTreatmentDialogComponent, {
      width: '500px',
      direction: 'rtl',
      data: { patient_id: this.patientId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // רענון מלא של הרשימה מהשרת
        this.patientService.getTreatments(this.patientId).subscribe(data => {
          this.appointments = data;
        });
      }
    });
  }
  //    עריכת סטטוס
  startEditStatus(appointment: Appointment): void {
    this.editingAppointment = appointment;
  }
  
  saveStatus(appointment: Appointment): void {
    const id = appointment.appointment_id;
    if (id == null) {
      console.warn('אין appointment_id לעדכון סטטוס', appointment);
      this.editingAppointment = null;
      return;
    }

    const status = appointment.status ?? '';
    this.patientService.updateAppointmentStatus(id, status)
      .subscribe({
        next: () => console.log('סטטוס עודכן בהצלחה'),
        error: err => console.error('שגיאה בעדכון סטטוס:', err)
      });

    this.editingAppointment = null;
  }

  // פורמט תאריך לתצוגה
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  }


  // עריכת טיפול
  editAppointment(appointment: Appointment): void {
    console.log('עריכת פגישה:', appointment);
  }
}