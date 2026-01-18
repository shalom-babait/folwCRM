// ...
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { MatDialog } from '@angular/material/dialog';
import { AddAppointmentDialogComponent } from '../add-appointment-dialog/add-appointment-dialog.component';
import { PatientService } from 'src/app/services/patient.service';
import { ApppointmentService } from 'src/app/services/apppointment.service';
import { Appointment } from 'src/app/models/appointment.model';
import { RoomCalendarComponent } from '../../company-manager/rooms/room-calendar/room-calendar.component';
import { co } from '@fullcalendar/core/internal-common';
@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css',
    '../../../../styles/shared-table.css']
})
export class AppointmentListComponent implements OnInit {
  @Input() statusFilter: string = 'מתוזמנת';
  selectedStatus: string = '';

  // פורמט דקות לשעות ודקות בעברית
  formatMinutes(minutes: number | undefined): string {
    if (minutes === undefined || minutes === null) {
      return '';
    }
    if (minutes < 60) {
      return `${minutes} דקות`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    // שעות שלמות
    if (mins === 0) {
      return `${hours} שעות`;
    }
    // שעה ומשהו
    let result = `${hours} שעות`;
    result += ` ו-${mins} דקות`;
    return result;
  }

  @Input() appointments: Appointment[] = [];
  @Input() therapistId?: number;
  @Input() patient?: Patient;
  @Output() appointmentAdded = new EventEmitter<Appointment>();
  @Output() appointmentDeleted = new EventEmitter<number>();

  searchTerm: string = '';
  showAppointments: Appointment[] = [];
  editingAppointment: Appointment | null = null;
  statusOptions: string[] = ['מתוזמנת', 'בוטלה', 'נדחתה', 'הושלמה'];

  constructor(
  private dialog: MatDialog,
  private patientService: PatientService,
  private apppointmentService: ApppointmentService
  ) { }

  ngOnInit(): void {
    // אם מוצגים כל הפגישות של מטפל (ולא של מטופל מסוים) - סנן כברירת מחדל לפי "מתוזמנת"
    if (typeof this.therapistId === 'number' && !(this.patient && typeof this.patient.patient_id === 'number')) {
      this.selectedStatus = this.statusFilter;
    }
    // אם הועבר מזהה מטופל, נטען לפי מטופל, אחרת אם הועבר מזהה מטפל - נטען לפי מטפל
    const patientId = this.patient?.patient_id;
    if (typeof patientId === 'number') {
      this.apppointmentService.getAppointmentsByPatient(patientId, this.therapistId).subscribe(data => {
        this.appointments = data;
      });
    } else if (typeof this.therapistId === 'number') {
      this.apppointmentService.getAppointmentsForTherapist(this.therapistId).subscribe((data: Appointment[]) => {
        this.appointments = data;
      });
    }
  }
  ngOnChanges(changes: any): void {
    if (changes.appointments && changes.appointments.currentValue) {
      this.appointments = changes.appointments.currentValue;
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
  patientId: this.patient?.patient_id
      }
    });
  }

  // פילטר טיפולים לפי תאריך
  get filteredAppointments(): Appointment[] {
    let filtered = this.appointments;
    // סינון לפי סטטוס
    if (this.selectedStatus) {
      filtered = filtered.filter(a => a.status === this.selectedStatus);
    }
    // סינון לפי תאריך
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(appointment =>
        appointment.appointment_date.includes(this.searchTerm)
      );
    }
    return filtered;
  }

  // פתיחת דיאלוג הוספת טיפול
  openCreateAppointmentDialog(): void {
    // שליחת שם המטופל אם קיים
    const data: any = {};
    if (this.patient) {
      data.patient_id = (this.patient as any).patient_id;
      // תמיכה ב-PersonData/PatientCreationData
      if ((this.patient as any).first_name && (this.patient as any).last_name) {
        data.first_name = (this.patient as any).first_name;
        data.last_name = (this.patient as any).last_name;
      } else if ((this.patient as any).person) {
        data.first_name = (this.patient as any).person.first_name;
        data.last_name = (this.patient as any).person.last_name;
      }
    }
  const dialogRef = this.dialog.open(AddAppointmentDialogComponent, {
      width: '500px',
      direction: 'rtl',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // רענון מלא של הרשימה מהשרת
        const patientId = this.patient?.patient_id;
        if (typeof patientId === 'number') {
          this.apppointmentService.getAppointmentsByPatient(patientId, this.therapistId).subscribe(data => {
            this.appointments = data;
          });
        }
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
    this.apppointmentService.updateAppointmentStatus(id, status)
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
  const dialogRef = this.dialog.open(AddAppointmentDialogComponent, {
      width: '600px',
      data: { ...appointment, patient_id: (this.patient as any)?.patient_id || appointment.patient_id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // עדכן את הרשימה המקומית אם צריך
        const idx = this.filteredAppointments.findIndex(a => a.appointment_id === result.appointment_id);
        if (idx > -1) {
          this.filteredAppointments[idx] = { ...this.filteredAppointments[idx], ...result };
        }
      }
    });
  }

  // מחיקת פגישה
  deleteAppointment(appointment: Appointment): void {
    if (!appointment.appointment_id) return;
    if (confirm('האם אתה בטוח שברצונך למחוק את הפגישה?')) {
  this.apppointmentService.deleteAppointment(appointment.appointment_id).subscribe({
        next: () => {
          this.appointments = this.appointments.filter(a => a.appointment_id !== appointment.appointment_id);
        },
        error: err => console.error('שגיאה במחיקת פגישה:', err)
      });
    }
  }
}