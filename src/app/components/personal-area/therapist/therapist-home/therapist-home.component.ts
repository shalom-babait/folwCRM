// therapist-dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from 'src/app/services/patient.service';
import { ApppointmentService } from 'src/app/services/apppointment.service';
import { TherapistService } from 'src/app/services/therapist.service';
import { Appointment } from 'src/app/models/appointment.model';
import { Patient, PatientCreationData } from 'src/app/models/patient.model';

@Component({
  selector: 'app-therapist-home',
  templateUrl: './therapist-home.component.html',
  styleUrls: ['./therapist-home.component.css']

})
export class TherapistHomeComponent {

  therapistId: number | undefined = undefined;
  selectedPatient: PatientCreationData | null = null;
  appointments: Appointment[] = [];


  private destroy$ = new Subject<void>();

  constructor(
  private patientService: PatientService,
  private apppointmentService: ApppointmentService,
    private therapistService: TherapistService
  ) {}

  ngOnInit() {

    // קביעת מזהה מטפל
    const id = localStorage.getItem('therapist_id');
    this.therapistId = id ? Number(id) : undefined;

    // האזנה לבחירת מטופל מרשימת המטופלים
  this.patientService.selectedPatient$
      .pipe(takeUntil(this.destroy$))
      .subscribe(patientId => {
        if (patientId) {
          this.loadPatientData(patientId);
        } else {
          this.selectedPatient = null;
          this.appointments = [];
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // טעינת נתוני המטופל מהשרת
  loadPatientData(patientId: number) {
  this.patientService.getPatientById(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patient) => {
          this.selectedPatient = patient;
          console.log('Selected patient data:', this.selectedPatient);
          // טוענים את הפגישות של המטופל
        this.loadPatientAppointments(patientId);
        },
        error: (error) => {
          console.error('Error loading patient:', error);
          this.selectedPatient = null;
        }
      });
  }

  // טעינת פגישות של המטופל מהשרת
  loadPatientAppointments(patientId: number) {
  this.apppointmentService.getAppointmentsByPatient(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (appointments) => {
          this.appointments = appointments;
          console.log('Appointments loaded:', this.appointments);
        },
        error: (error) => {
          console.error('Error loading appointments:', error);
          this.appointments = [];
        }
      });
  }

  // חישוב סך שעות טיפול
  get totalHours(): number {
    const totalMinutes = this.appointments.reduce((sum, appointment) => sum + (appointment.total_minutes || 0), 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  }

  // חישוב סך עלות
  get totalCost(): number {
    return this.appointments.reduce((sum, appointment) => sum + (appointment.cost || 0), 0);
  }

  // עדכון פרטי מטופל
  onPatientUpdated(updatedPatient: PatientCreationData): void {
    this.selectedPatient = { ...updatedPatient };
    // כאן ניתן להוסיף שמירה לשרת
    console.log('Patient updated:', updatedPatient);
    // אם יש לך API לעדכון מטופל:
    // this.patientService.updatePatient(updatedPatient).subscribe(...)
  }
}
