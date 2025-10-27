import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import { Appointment } from 'src/app/models/appointment.model';import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
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
        this.patientService.getPatientById(id).subscribe(data => {
          console.log('Patient data from server:', data);
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
          };
          console.log('Patient object for details:', this.patient);
        });
            this.patientService.getAppointmentsByPatientId(id).subscribe(data => {
              this.appointments = (data || []).map((a: any) => ({
                ...a,
                appointment_id: a.appointment_id ?? 0,
                patient_id: a.patient_id ?? this.patientId,
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
    const totalMinutes = this.appointments.reduce((sum, appointment) => sum + (appointment.total_minutes || 0), 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  }

  get totalCost(): number {
    return 0;
  }
}