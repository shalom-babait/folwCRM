// patient-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from 'src/app/services/patient.service';
import { AddPatientDialogComponent } from '../../patient/add-patient-dialog/add-patient-dialog.component';
import { Patient } from 'src/app/models/patient.model';
@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];
  selectedPatientId: number | null = null;
  therapistId: number = 1; // שנה לפי המטפל המחובר
  isLoading = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    // טעינת רשימת מטופלים מהשרת
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
    this.patientService.getPatientsByTherapist(this.therapistId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.patients = data;
          console.log('Patients loaded:', data);
        },
        error: (error) => {
          console.error('Error loading patients:', error);
        }
      });
  }

  viewPatientDetails(patient: Patient) {
    const patient_id = patient.patient_id;
    if (patient_id) {
      this.patientService.selectPatient(patient_id);
      this.selectedPatientId = patient_id;
      // ניווט תקני של Angular
      this.router.navigate(['/patient', patient_id]);
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
          therapist_id: this.therapistId,
          status: 'פעיל'
        },
        context: 'patient-list',
        therapistId: this.therapistId
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result && result.success && result.data) {
          console.log('מטופל חדש נוסף:', result.data);
          // הוספה ישירה לרשימה
          this.patients = [...this.patients, result.data];
          // בחירת המטופל החדש
          if (result.data.patient_id) {
            const newPatientId = result.data.patient_id;
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
            // ניתן להציג את התוצאות בדיאלוג או לעדכן את הרשימה
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