// patient-list.component.ts
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from 'src/app/services/patient.service';
import { AddPatientDialogComponent } from '../add-patient-dialog/add-patient-dialog.component';
import { Patient, PatientCreationData } from 'src/app/models/patient.model';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {
  @Output() patientSelected = new EventEmitter<PatientCreationData>();
  patients: PatientCreationData[] = [];
  selectedPatientId: number | null = null;
  therapist_id: number = 0; 
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
  // קבלת המטפל המחובר מה-localStorage (TherapistData)
  const therapistStr = localStorage.getItem('therapist');
  let therapistObj: any = {};
  if (therapistStr) {
    try {
      therapistObj = JSON.parse(therapistStr);
    } catch (e) {
      therapistObj = {};
    }
  }
  this.therapist_id = therapistObj.therapist_id || 0;
  this.loadPatients();

    // האזנה לשינויים ברשימת המטופלים
    this.patientService.patientsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(patients => {
        this.patients = patients;
      });

    // האזנה למצב טעינה
    this.patientService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    // האזנה למטופל שנבחר
    this.patientService.selectedPatient$
      .pipe(takeUntil(this.destroy$))
      .subscribe(patient_id => {
        this.selectedPatientId = patient_id;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPatients() {
    this.patientService.getPatientsByTherapist(this.therapist_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.patients = data;
          // ...existing code...
        },
        error: (error) => {
          // ...existing code...
        }
      });
  }

  viewPatientDetails(patient: PatientCreationData) {
    const patient_id = patient.patient?.patient_id;
    if (patient_id) {
      this.selectedPatientId = patient_id;
      this.patientSelected.emit(patient); // שליחת האירוע להורה
    }
  }

  openAddPatientDialog(): void {
    const dialogRef = this.dialog.open(AddPatientDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'custom-dialog-panel',
      direction: 'rtl',
      data: {
        initialData: {
          therapist_id: this.therapist_id,
          status: 'פעיל'
        },
        context: 'patient-list',
        therapistId: this.therapist_id
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result && result.success && result.data) {
          console.log('מטופל חדש נוסף:', result.data);
          this.patients = [...this.patients, result.data];
          if (result.data.patient?.patient_id) {
            const newPatientId = result.data.patient.patient_id;
            setTimeout(() => {
              this.patientService.selectPatient(newPatientId);
            }, 500);
          }
        }
      });
  }

  refreshPatientsList(): void {
    this.loadPatients();
  }

  openSearchDialog(): void {
    const searchTerm = prompt('הכנס שם לחיפוש:');
    if (searchTerm) {
      this.patientService.searchPatients(searchTerm)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (results) => {
            console.log('תוצאות חיפוש:', results);
            if (results.length > 0) {
              this.patients = results;
            } else {
              alert('לא נמצאו תוצאות');
            }
          },
          error: (error) => {
            console.error('Error searching patients:', error);
          }
        });
    }
  }
}
