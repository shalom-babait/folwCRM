import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import { Appointment } from 'src/app/models/appointment.model';import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { ActivatedRoute } from '@angular/router';
//import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  onAppointmentAdded(event: any) {
    // ניתן להוסיף לוגיקה כאן אם תרצי בעתיד
  }

  onAppointmentDeleted(event: any) {
    // ניתן להוסיף לוגיקה כאן אם תרצי בעתיד
  }
  patient: Patient | null = null;
  appointments: Appointment[] = [];

  patientId: number = 0;

  constructor(
  private patientService: PatientService,
  private route: ActivatedRoute,
  private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.patientId = id;
      if (id) {
        // שימוש ב-getPatientOnly שמחזיר את כל השדות מה-Users ומה-Patients
        this.patientService.getPatientOnly(id).subscribe(data => {
          // ניתן להחזיר לוגים אם צריך דיבאג
          // console.log('Patient data from server:', data);
          this.patient = {
            ...data,
            patient_id: data.patient_id ?? id ?? 0,
            first_name: data.first_name ?? '',
            last_name: data.last_name ?? '',
            birth_date: data.birth_date ?? '',
            phone: data.phone ?? '',
            email: data.email ?? '',
            address: data.address ?? '',
            teudat_zehut: data.teudat_zehut ?? '',
            city: data.city ?? '',
            gender: data.gender ?? '',
            status: data.status ?? '',
            history_notes: data.history_notes ?? '',
            therapist_id: data.therapist_id ?? undefined,
            user_id: data.user_id ?? undefined
          };
          // קריאת הפגישות רק אחרי שהמטופל נטען
          this.patientService.getAppointmentsByPatientId(id).subscribe(data => {
            // ניתן להחזיר לוגים אם צריך דיבאג
            // console.log('Appointments raw from API:', data);
            this.appointments = (data || []).map((a: any) => ({
              ...a,
              appointment_id: a.appointment_id ?? 0,
              patient_id: a.patient_id ?? id,
              room: a.room ?? '',
              treatment_type: a.treatment_type ?? '',
              total_minutes: a.total_minutes ?? 0,
              status: a.status ?? 'מתוזמנת',
              cost: a.cost ?? 0,
              place: a.place ?? '',
              notes: a.notes ?? '',
              name: a.name ?? '',
              therapist: a.therapist ?? '',
              totalCost: a.totalCost ?? 0,
            }));
            // ניתן להחזיר לוגים אם צריך דיבאג
            // console.log('Appointments array for child:', this.appointments);
          });
        });
      }
    });
  }

  onPatientUpdated(updatedPatient: Patient) {
    if (!this.patient) return;
    const backendPatient = {
      first_name: updatedPatient.first_name ?? '',
      last_name: updatedPatient.last_name ?? '',
      phone: updatedPatient.phone ?? '',
      email: updatedPatient.email ?? '',
      birth_date: updatedPatient.birth_date ?? '',
      address: updatedPatient.address ?? '',
      teudat_zehut: updatedPatient.teudat_zehut ?? '',
      city: updatedPatient.city ?? '',
      gender: updatedPatient.gender ?? undefined,
      status: updatedPatient.status ?? undefined,
      history_notes: updatedPatient.history_notes ?? undefined,
    };
    this.patientService.updatePatient(this.patient?.patient_id ?? 0, backendPatient).subscribe(
      (res) => {
        console.log('Update response:', res);
        // לאחר עדכון, טען מחדש את הנתונים מהשרת כדי להציג את הערכים האמיתיים מה-SQL
        if (this.patient && this.patient.patient_id) {
          // השתמש ב-endpoint שמחזיר את כל נתוני המטופל כולל Users
          this.patientService.getPatientOnly(this.patient.patient_id).subscribe(data => {
            console.log('Reloaded patient after update:', data);
            if (data) {
              this.patient = {
                patient_id: data.patient_id ?? (this.patient ? this.patient.patient_id : 0),
                user_id: data.user_id ?? undefined,
                therapist_id: data.therapist_id ?? undefined,
                first_name: data.first_name ?? '',
                last_name: data.last_name ?? '',
                birth_date: data.birth_date ?? '',
                gender: data.gender ?? undefined,
                status: data.status ?? undefined,
                history_notes: data.history_notes ?? undefined,
                phone: data.phone ?? '',
                email: data.email ?? '',
                address: data.address ?? '',

//     // Split name into first_name and last_name for backend
//     let first_name = '';
//     let last_name = '';
//     if (updatedPatient.name) {
//       const nameParts = updatedPatient.name.split(' ');
//       first_name = nameParts[0] || '';
//       last_name = nameParts.slice(1).join(' ') || '';
//     }
//     const backendPatient = {
//       first_name,
//       last_name,
//       phone: updatedPatient.phone,
//       email: updatedPatient.email,
//       birth_date: updatedPatient.birthDate,
//       address: updatedPatient.address,
//       teudat_zehut: updatedPatient.teudat_zehut,
//       city: updatedPatient.city,
//       gender: updatedPatient.gender,
//       status: updatedPatient.status
//     };
//     this.patientService.updatePatient(this.patient?.id ?? 0, backendPatient).subscribe(
//       (res) => {
//         console.log('Update response:', res);
//         // לאחר עדכון, טען מחדש את הנתונים מהשרת כדי להציג את הערכים האמיתיים מה-SQL
//         if (this.patient && this.patient.id) {
//           // השתמש ב-endpoint שמחזיר את כל נתוני המטופל כולל Users
//           this.patientService.getPatientOnly(this.patient.id).subscribe(data => {
//             console.log('Reloaded patient after update:', data);
//             if (data) {
//               this.patient = {
//                 id: (data && data.patient_id != null) ? data.patient_id : ((this.patient && this.patient.id) ? this.patient.id : 0),
//                 name: (data.first_name ?? '') + ' ' + (data.last_name ?? ''),
//                 phone: data.phone ?? '',
//                 email: data.email ?? '',
//                 birthDate: data.birth_date ?? '',
//                 address: data.address ?? '',
//                 gender: data.gender ?? '',
//                 status: data.status ?? '',
                teudat_zehut: data.teudat_zehut ?? '',
                city: data.city ?? '',
              };
            }
          }, err => {
            console.error('Error reloading patient after update:', err);
          });
        }
        this.snackBar.open('העריכה בוצעה בהצלחה!', 'סגור', {
          duration: 3500,
          panelClass: 'custom-snackbar',
          direction: 'rtl'
        });
      },
      (err) => {
        console.error('Error updating patient:', err);
        this.snackBar.open('אירעה שגיאה בעת העריכה.', 'סגור', {
          duration: 3500,
          panelClass: 'custom-snackbar',
          direction: 'rtl'
        });
      }
    );
  }

  onTreatmentDeleted(treatmentId: number) {
    this.appointments = this.appointments.filter(t => t.appointment_id !== treatmentId);
  }

  get totalHours(): number {
  const totalMinutes = (this.appointments || []).reduce((sum, appointment) => sum + (appointment.total_minutes || 0), 0);
  return Math.round((totalMinutes / 60) * 10) / 10;
  }

  get totalCost(): number {
    return 0;
  }
}