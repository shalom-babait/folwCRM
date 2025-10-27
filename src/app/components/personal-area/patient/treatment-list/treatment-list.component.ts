import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateTreatmentDialogComponent } from '../add-treatment-dialog/add-treatment-dialog.component';
import { PatientService } from 'src/app/services/patient.service';
import { Appointment } from 'src/app/models/appointment.model';
@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.component.html',
  styleUrls: ['./treatment-list.component.css']
})
export class TreatmentListComponent implements OnInit {
  @Input() appointments: Appointment[] = [];
  @Output() appointmentAdded = new EventEmitter<Appointment>();
  @Output() appointmentDeleted = new EventEmitter<number>();

  searchTerm: string = '';
  showAppointments: Appointment[] = [];

  constructor(
    private dialog: MatDialog,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    // Load treatments from the server if none are provided through Input
    if (this.appointments.length === 0) {
      this.patientService.getTreatments().subscribe(data => {
        console.log('Appointments data:', data);
        this.showAppointments = data;
        // Map server response to Appointment interface
        this.appointments = this.showAppointments.map(appointment => ({
          ...appointment,
          id: appointment.appointment_id,
          patient_id: 0 // This should be set based on the current patient context
        }));
      });
    }
  }

  // פילטר טיפולים לפי תאריך
  get filteredAppointments(): Appointment[] {
    if (!this.searchTerm.trim()) {
      return this.appointments;
    }
    
    return this.appointments.filter(appointment => 
      appointment.appointment_date.includes(this.searchTerm)
      // אפשר להוסיף כאן סינון לפי שדות נוספים אם תרצי
    );
  }

  // פתיחת דיאלוג הוספת טיפול
  openCreateAppointmentDialog(): void {
    const dialogRef = this.dialog.open(CreateTreatmentDialogComponent, {
      width: '500px',
      direction: 'rtl'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // יצירת פגישה חדשה
        const newAppointment: Appointment = {
          appointment_id: this.appointments.length > 0 ? Math.max(...this.appointments.map(a => a.appointment_id || 0)) + 1 : 1,
          appointment_date: result.date,
          // שדות נוספים לפי הצורך
          start_time: result.startTime,
          end_time: result.endTime,
          status: 'מתוזמנת',
          patient_id: 0 // This should be set based on the current patient context
        } as Appointment;

        // הוספה לרשימה המקומית
        this.appointments.push(newAppointment);
        
        // שליחת האירוע לקומפוננטה האב
        this.appointmentAdded.emit(newAppointment);
      }
    });
  }

  // פורמט תאריך לתצוגה
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  }

  // עריכת טיפול
  editAppointment(appointment: Appointment): void {
    // יכול לפתוח דיאלוג עריכה או להוסיף לוגיקה אחרת
    console.log('עריכת פגישה:', appointment);
    // TODO: להוסיף דיאלוג עריכה
  }
}