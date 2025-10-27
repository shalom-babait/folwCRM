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
  ngOnChanges(changes: any): void {
    if (changes.appointments && changes.appointments.currentValue) {
      // ניתן להחזיר לוגים אם צריך דיבאג
      // console.log('Appointments @Input changed:', changes.appointments.currentValue);
      this.appointments = changes.appointments.currentValue;
    }
  }
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
  // ניתן להחזיר לוגים אם צריך דיבאג
  // console.log('Appointments @Input:', this.appointments);
    // Load treatments from the server if none are provided through Input
    if (this.appointments.length === 0) {
      // נניח שמועבר מזהה מטופל בקומפוננטה האב (אם לא, אפשר להוסיף @Input patientId)
      const patientId = this.appointments[0]?.patient_id;
      if (patientId) {
        this.patientService.getTreatments(patientId).subscribe(data => {
          console.log('Appointments data:', data);
          this.showAppointments = data;
          this.appointments = this.showAppointments.map(appointment => ({
            ...appointment,
            id: appointment.appointment_id,
            patient_id: patientId
          }));
        });
      }
    }
  }

  // פילטר טיפולים לפי תאריך
  get filteredAppointments(): Appointment[] {
    // סינון לפי המטופל הנבחר
    let filtered = this.appointments;
    // אם יש מזהה מטופל ברשומה, סנן רק עבורו
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
//         // יצירת טיפול חדש
//         const newTreatment: Treatment = {
//           id: this.treatments.length > 0 ? Math.max(...this.treatments.map(t => t.id)) + 1 : 1,
//           appointment_id: this.treatments.length > 0 ? Math.max(...this.treatments.map(t => t.appointment_id)) + 1 : 1,
//           appointment_date: result.date,
//           treatment_type: result.name || 'טיפול חדש',
//           room: result.place || '',
//           start_time: result.startTime,
//           end_time: result.endTime,
//           status: 'scheduled',
//           patient_id: 0 // This should be set based on the current patient context
//         };

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