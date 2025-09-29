// therapist-dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PatientService, Patient } from 'src/app/services/patient.service';

interface Treatment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  place: string;
  notes: string;
  duration: number;
  cost: number;
  name?: string;
  therapist?: string;
  totalCost?: number;
}

@Component({
  selector: 'app-therapist-dashboard',
  templateUrl: './therapist-dashboard.component.html',
  styleUrls: ['./therapist-dashboard.component.css']
})
export class TherapistDashboardComponent implements OnInit, OnDestroy {
  selectedPatient: Patient | null = null;
  treatments: Treatment[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    // האזנה לבחירת מטופל מרשימת המטופלים
    this.patientService.selectedPatient$
      .pipe(takeUntil(this.destroy$))
      .subscribe(patientId => {
        if (patientId) {
          this.loadPatientData(patientId);
        } else {
          this.selectedPatient = null;
          this.treatments = [];
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
          // טוענים את הטיפולים של המטופל
          this.loadPatientTreatments(patientId);
        },
        error: (error) => {
          console.error('Error loading patient:', error);
          this.selectedPatient = null;
        }
      });
  }

  // טעינת טיפולים של המטופל מהשרת
  loadPatientTreatments(patientId: number) {
    this.patientService.getTreatments(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (treatments) => {
          // המרה לפורמט של Treatment
          this.treatments = treatments.map(t => ({
            id: t.appointment_id || 0,
            date: t.appointment_date,
            startTime: t.start_time,
            endTime: t.end_time,
            place: t.room,
            notes: '',
            duration: t.total_minutes,
            cost: 0, // יש להוסיף אם יש מידע על עלות
            name: t.treatment_type,
            therapist: t.room,
            totalCost: 0
          }));
          console.log('Treatments loaded:', this.treatments);
        },
        error: (error) => {
          console.error('Error loading treatments:', error);
          this.treatments = [];
        }
      });
  }

  // חישוב סך שעות טיפול
  get totalHours(): number {
    const totalMinutes = this.treatments.reduce((sum, treatment) => sum + treatment.duration, 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  }

  // חישוב סך עלות
  get totalCost(): number {
    return this.treatments.reduce((sum, treatment) => sum + treatment.cost, 0);
  }

  // עדכון פרטי מטופל
  onPatientUpdated(updatedPatient: Patient): void {
    this.selectedPatient = { ...updatedPatient };
    // כאן ניתן להוסיף שמירה לשרת
    console.log('Patient updated:', updatedPatient);
    // אם יש לך API לעדכון מטופל:
    // this.patientService.updatePatient(updatedPatient).subscribe(...)
  }

  // מחיקת טיפול
  onTreatmentDeleted(treatmentId: number): void {
    this.treatments = this.treatments.filter(t => t.id !== treatmentId);
    console.log('Treatment deleted:', treatmentId);
    // כאן ניתן להוסיף מחיקה בשרת
    // this.patientService.deleteTreatment(treatmentId).subscribe(...)
  }
}