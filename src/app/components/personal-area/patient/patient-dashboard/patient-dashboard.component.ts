import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient, PatientCreationData } from 'src/app/models/patient.model';
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
  patient: PatientCreationData | null = null;
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
            user: {
              first_name: data.user?.first_name ?? '',
              last_name: data.user?.last_name ?? '',
              birth_date: data.user?.birth_date ?? '',
              phone: data.user?.phone ?? '',
              email: data.user?.email ?? '',
              address: data.user?.address ?? '',
              teudat_zehut: data.user?.teudat_zehut ?? '',
              city: data.user?.city ?? '',
              user_id: data.user?.user_id ?? undefined,
              gender: data.user?.gender ?? undefined,
            },
            patient: {
              patient_id: data.patient?.patient_id ?? id ?? 0,
              user_id: data.user?.user_id ?? 0,
              therapist_id: data.patient?.therapist_id ?? 0,
              birth_date: data.patient?.birth_date ?? '',
              gender: data.patient?.gender ?? 'אחר',
              // status: data.patient?.status ?? '',
              history_notes: data.patient?.history_notes ?? '',
            },
            selectedDepartments: []
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

  onPatientUpdated(updatedPatient: PatientCreationData) {
    if (!this.patient) return;
    const backendPatient = {
      first_name: updatedPatient.user.first_name ?? '',
      last_name: updatedPatient.user.last_name ?? '',
      phone: updatedPatient.user.phone ?? '',
      email: updatedPatient.user.email ?? '',
      birth_date: updatedPatient.user.birth_date ?? '',
      address: updatedPatient.user.address ?? '',
      teudat_zehut: updatedPatient.user.teudat_zehut ?? '',
      city: updatedPatient.user.city ?? '',
      gender: updatedPatient.user.gender ?? undefined,
      // status: updatedPatient.user.status ?? undefined,
      // history_notes: updatedPatient.user.history_notes ?? undefined,
    };
  this.patientService.updatePatient(this.patient?.patient.patient_id ?? 0, backendPatient).subscribe(
      (res) => {
        console.log('Update response:', res);
        // לאחר עדכון, טען מחדש את הנתונים מהשרת כדי להציג את הערכים האמיתיים מה-SQL
        if (this.patient && this.patient.patient.patient_id) {
          // השתמש ב-endpoint שמחזיר את כל נתוני המטופל כולל Users
          this.patientService.getPatientOnly(this.patient.patient.patient_id).subscribe(data => {
            console.log('Reloaded patient after update:', data);
            if (data) {
              this.patient = data;
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