// import { Component, OnInit } from '@angular/core';
// import { PatientService, AppointmentResponse } from 'src/app/services/patient.service';


// @Component({
//   selector: 'app-patient-dashboard',
//   templateUrl: './patient-dashboard.component.html',
//   styleUrls: ['./patient-dashboard.component.css']
// })
// export class PatientDashboardComponent implements OnInit {
//   patient: Patient | null = null;
//   treatments: Treatment[] = [];

//   constructor(private patientService: PatientService) { }

//   ngOnInit(): void {
//     const patientId = 1; // דוגמה, יש להחליף ב-id דינמי
//     this.patientService.getPatientById(patientId).subscribe(data => {
//       // מיפוי Patient מהשרת למודל הפנימי
//       this.patient = {
//         id: data.patient_id || 0,
//         name: (data.firstName || '') + ' ' + (data.lastName || ''),
//         phone: '',
//         email: '',
//         birthDate: data.birth_date || '',
//         address: ''
//       };
//     });
//     this.patientService.getTreatments(patientId).subscribe(data => {
//       // מיפוי AppointmentResponse למודל Treatment
//       this.treatments = (data || []).map((t: any) => ({
//         id: t.appointment_id,
//         appointment_id: t.appointment_id,
//         appointment_date: t.appointment_date,
//         start_time: t.start_time,
//         end_time: t.end_time,
//         room: t.room,
//         status: t.status,
//         treatment_type: t.treatment_type,
//         patient_id: patientId,
//         total_minutes: t.total_minutes
//       }));
//     });
//   }

//   get totalHours(): number {
//     const totalMinutes = this.treatments.reduce((sum, treatment) => sum + (treatment.total_minutes || 0), 0);
//     return Math.round((totalMinutes / 60) * 10) / 10;
//   }

//   get totalCost(): number {
//     // אם יש שדה עלות בטיפול, להוסיף כאן. כרגע אין cost ב-Treatment, אפשר להוסיף בעתיד.
//     return 0;
//   }

//   // פונקציה לעדכון פרטי מטופל מה-child
//   onPatientUpdated(updatedPatient: Patient) {
//     this.patient = updatedPatient;
//   }

//   // פונקציה למחיקת טיפול מה-child
//   onTreatmentDeleted(treatmentId: number) {
//     this.treatments = this.treatments.filter(t => t.appointment_id !== treatmentId);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { PatientService, AppointmentResponse } from 'src/app/services/patient.service';
import { ActivatedRoute } from '@angular/router';

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  gender?: string;
  status?: string;
  teudat_zehut?: string;
  city?: string;
}

interface Treatment {
  id: number;
  appointment_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  room: string;
  status: string;
  treatment_type: string;
  patient_id: number;
  total_minutes?: number;
}

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  patient: Patient | null = null;
  treatments: Treatment[] = [];
  patientId: number = 0;

  constructor(private patientService: PatientService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.patientId = id;
      if (id) {
        this.patientService.getPatientById(id).subscribe(data => {
          console.log('Patient data from server:', data);
          this.patient = {
            id: data.patient_id || id || 0,
            name: (data.first_name || '') + ' ' + (data.last_name || ''),
            phone: data.phone || '',
            email: data.email || '',
            birthDate: data.birth_date || '',
            address: data.address || '',
            gender: data.gender || '',
            status: data.status || '',
            teudat_zehut: data.teudat_zehut || '',
            city: data.city || '',
          };
          console.log('Patient object for details:', this.patient);
        });
        this.patientService.getTreatments(id).subscribe(data => {
          this.treatments = (data || []).map((t: any) => ({
            id: t.appointment_id,
            appointment_id: t.appointment_id,
            appointment_date: t.appointment_date,
            start_time: t.start_time,
            end_time: t.end_time,
            room: t.room,
            status: t.status,
            treatment_type: t.treatment_type,
            patient_id: id,
            total_minutes: t.total_minutes
          }));
        });
      }
    });
  }

  onPatientUpdated(updatedPatient: Patient) {
    if (!this.patient) return;
    // Split name into first_name and last_name for backend
    let first_name = '';
    let last_name = '';
    if (updatedPatient.name) {
      const nameParts = updatedPatient.name.split(' ');
      first_name = nameParts[0] || '';
      last_name = nameParts.slice(1).join(' ') || '';
    }
    const backendPatient = {
      first_name,
      last_name,
      phone: updatedPatient.phone,
      email: updatedPatient.email,
      birth_date: updatedPatient.birthDate,
      address: updatedPatient.address,
      teudat_zehut: updatedPatient.teudat_zehut,
      city: updatedPatient.city,
      gender: updatedPatient.gender,
      status: updatedPatient.status
    };
    this.patientService.updatePatient(this.patient?.id ?? 0, backendPatient).subscribe(
      (res) => {
        console.log('Update response:', res);
        // לאחר עדכון, טען מחדש את הנתונים מהשרת כדי להציג את הערכים האמיתיים מה-SQL
        if (this.patient && this.patient.id) {
          // השתמש ב-endpoint שמחזיר את כל נתוני המטופל כולל Users
          this.patientService.getPatientOnly(this.patient.id).subscribe(data => {
            console.log('Reloaded patient after update:', data);
            if (data) {
              this.patient = {
                id: (data && data.patient_id != null) ? data.patient_id : ((this.patient && this.patient.id) ? this.patient.id : 0),
                name: (data.first_name ?? '') + ' ' + (data.last_name ?? ''),
                phone: data.phone ?? '',
                email: data.email ?? '',
                birthDate: data.birth_date ?? '',
                address: data.address ?? '',
                gender: data.gender ?? '',
                status: data.status ?? '',
                teudat_zehut: data.teudat_zehut ?? '',
                city: data.city ?? '',
              };
            }
          }, err => {
            console.error('Error reloading patient after update:', err);
          });
        }
      },
      (err) => {
        console.error('Error updating patient:', err);
      }
    );
  }

  onTreatmentDeleted(treatmentId: number) {
    this.treatments = this.treatments.filter(t => t.appointment_id !== treatmentId);
  }

  get totalHours(): number {
    const totalMinutes = this.treatments.reduce((sum, treatment) => sum + (treatment.total_minutes || 0), 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  }

  get totalCost(): number {
    return 0;
  }
}