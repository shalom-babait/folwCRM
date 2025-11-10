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
        // שימוש ב-getPatientOnly שמחזיר את כל השדות מה-Users ומה-Patients
        this.patientService.getPatientOnly(id).subscribe(data => {
          // ניתן להחזיר לוגים אם צריך דיבאג
          // console.log('Patient data from server:', data);
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
    // Convert gender from 'male'|'female'|'other' to 'זכר'|'נקבה'|'אחר'
    let gender: 'זכר' | 'נקבה' | 'אחר' = 'אחר';
    switch (updatedPatient.user.gender) {
      case 'male':
        gender = 'זכר';
        break;
      case 'female':
        gender = 'נקבה';
        break;
      case 'other':
        gender = 'אחר';
        break;
      default:
        gender = 'אחר';
    }
    const backendPatient = {
      patient_id: this.patient?.patient.patient_id ?? 0,
      user_id: updatedPatient.user.user_id ?? undefined,
      first_name: updatedPatient.user.first_name ?? '',
      last_name: updatedPatient.user.last_name ?? '',
      teudat_zehut: updatedPatient.user.teudat_zehut ?? '',
      phone: updatedPatient.user.phone ?? '',
      city: updatedPatient.user.city ?? '',
      address: updatedPatient.user.address ?? '',
      email: updatedPatient.user.email ?? '',
      password: updatedPatient.user.password ?? undefined,
      role: updatedPatient.user.role ?? undefined,
      agree: updatedPatient.user.agree ?? undefined,
      created_at: updatedPatient.user.created_at ?? undefined,
      gender: gender,
      birth_date: updatedPatient.user.birth_date ?? '',
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
  const totalMinutes = (this.appointments || []).reduce((sum, appointment) => sum + (appointment.total_minutes || 0), 0);
  return Math.round((totalMinutes / 60) * 10) / 10;
  }

  get totalCost(): number {
    return 0;
  }
  
  // Added to resolve template errors
  onAppointmentAdded(event: any) {
    // Optionally, reload appointments or push to this.appointments
    // Example: this.appointments.push(event);
    // You can implement logic as needed
    this.snackBar.open('פגישה נוספה בהצלחה!', 'סגור', {
      duration: 2500,
      panelClass: 'custom-snackbar',
      direction: 'rtl'
    });
  }

  onAppointmentDeleted(event: any) {
    // Optionally, remove from this.appointments or reload
    // Example: this.appointments = this.appointments.filter(a => a.appointment_id !== event);
    this.snackBar.open('פגישה נמחקה בהצלחה!', 'סגור', {
      duration: 2500,
      panelClass: 'custom-snackbar',
      direction: 'rtl'
    });
  }
}