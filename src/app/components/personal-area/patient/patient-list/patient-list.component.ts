import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from 'src/app/services/patient.service';
import { AddPatientDialogComponent } from '../add-patient-dialog/add-patient-dialog.component';
import { PatientCreationData } from 'src/app/models/patient.model';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['../../../../styles/list-cards.css']
})
export class PatientListComponent implements OnInit, OnDestroy {
  @Input() therapistId?: number;
  /** שליחה למעלה כאשר בוחרים מטופל לצפייה בפגישות */
  @Output() patientMeetingsRequested = new EventEmitter<PatientCreationData>();

  /** אם true — נטען את כל המטופלים */

  /** אם component-parent רוצה לשלוח group */
  @Input() group: any;

  /** שליחה למעלה כאשר בוחרים מטופל */
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
  ) { }

  ngOnInit() {

    // קבלת מזהה מטפל מה-@Input אם קיים, אחרת מה-localStorage
    if (this.therapistId && this.therapistId > 0) {
      this.therapist_id = this.therapistId;
    } else {
      const therapistStr = localStorage.getItem('therapist');
      const therapistObj = therapistStr ? JSON.parse(therapistStr) : {};
      this.therapist_id = therapistObj.therapist_id || 0;
    }
    console.log(this.therapist_id, " therapist_id");


    // אם יש therapist_id תקין — נטען מטופלים של מטפל
    if (this.therapist_id && this.therapist_id > 0) {
      this.loadPatientsByTherapist();
    }
    // אחרת — נטען את כולם
    else {
      this.loadAllPatients();
    }
    // האזנה לרשימת המטופלים
    this.patientService.patientsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(patients => {
        this.patients = patients;
      });

    // האזנה לטעינה
    this.patientService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    // האזנה למטופל נבחר
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

  /** טעינת כל המטופלים */
  loadAllPatients() {
    this.isLoading = true;
    this.patientService.getAllPatients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.patients = data || [];
        
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading ALL patients:', err);
          this.isLoading = false;
        }
      });
  }



  /** טעינת מטופלים לפי מטפל */
  loadPatientsByTherapist() {
    this.isLoading = true;
    this.patientService.getPatientsByTherapist(this.therapist_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.patients = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading patients by therapist:', err);
          this.isLoading = false;
        }
      });
  }

  /** הצגת פרטי מטופל */
  viewPatientDetails(patient: PatientCreationData) {
    const patient_id = patient.patient?.patient_id;
    if (patient_id) {
      this.selectedPatientId = patient_id;
      console.log('Selected patient id from list:', patient_id);
      this.patientSelected.emit(patient);
    }
  }

  /** הצגת רשימת פגישות עבור מטופל */
  viewPatientMeetings(patient: PatientCreationData) {
    const patient_id = patient.patient?.patient_id;
    if (patient_id) {
      this.selectedPatientId = patient_id;
      this.patientMeetingsRequested.emit(patient);
    }
  }

  /** פתיחת דיאלוג הוספת מטופל */
  openAddPatientDialog(): void {
    const dialogRef = this.dialog.open(AddPatientDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        therapist_id: this.therapist_id,
        initialData: {
          status: 'פעיל'
        },
        context: 'patient-list'
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result && result.success && result.data) {
          this.patients = [...this.patients, result.data];

          const newId = result.data.patient?.patient_id;
          if (newId) {
            setTimeout(() => this.patientService.selectPatient(newId), 500);
          }
        }
      });
  }

  /** חיפוש מטופל */
  openSearchDialog(): void {
    const searchTerm = prompt('הכנס שם לחיפוש:');
    if (!searchTerm) return;

    this.patientService.searchPatients(searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          if (results.length > 0) {
            this.patients = results;
          } else {
            alert('לא נמצאו תוצאות');
          }
        },
        error: (error) => console.error('Error searching patients:', error)
      });
  }

  logPatient(patient: any) {
    console.log('Patient:', patient);
  }
}
