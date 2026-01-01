import { PatientNameFilterPipe } from './patient-name-filter.pipe';

// שים לב: יש להוסיף את PatientNameFilterPipe ל-declarations במודול המתאים (module)
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from 'src/app/services/patient.service';
import { AddPatientDialogComponent } from '../add-patient-dialog/add-patient-dialog.component';
import { PatientCreationData } from 'src/app/models/patient.model';
import { TherapistService } from 'src/app/services/therapist.service';
import { TherapistCreationData } from 'src/app/models/therapist.model';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['../../../../styles/list-cards.css']
})
export class PatientListComponent implements OnInit, OnDestroy {
  therapists: TherapistCreationData[] = [];
  selectedTherapistId: number | null = null;

  @Input() therapistId?: number;
  /** שליחה למעלה כאשר בוחרים מטופל לצפייה בפגישות */
  @Output() patientMeetingsRequested = new EventEmitter<PatientCreationData>();

  /** אם true — נטען את כל המטופלים */

  /** אם component-parent רוצה לשלוח group */
  @Input() group: any;

  /** שליחה למעלה כאשר בוחרים מטופל */
  @Output() patientSelected = new EventEmitter<PatientCreationData>();
  searchText: string = '';
  patients: PatientCreationData[] = [];
  filteredPatients: PatientCreationData[] = [];
  statusFilter: 'all' | 'active' | 'inactive' = 'active';
  selectedPatientId: number | null = null;
  therapist_id: number = 0;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private therapistService: TherapistService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    // קבלת מזהה מטפל מה-@Input אם קיים, אחרת מה-localStorage
    if (this.therapistId && this.therapistId > 0) {
      this.therapist_id = this.therapistId;
      this.loadPatientsByTherapist();
    } else {
      const therapistStr = localStorage.getItem('therapist');
      const therapistObj = therapistStr ? JSON.parse(therapistStr) : {};
      this.therapist_id = therapistObj.therapist_id || 0;
      this.loadAllPatients();
      this.loadAllTherapists();
    }
<<<<<<< HEAD
    // האזנה לרשימת המטופלים
    this.patientService.patientsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(patients => {
        this.patients = patients;
        this.applyFilters();
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
=======
  }

  loadAllTherapists() {
    this.therapistService.getAllTherapists().subscribe({
      next: (therapists) => {
        this.therapists = therapists || [];
      },
      error: (err) => {
        console.error('Error loading therapists:', err);
      }
    });
  }

  get filteredPatients(): PatientCreationData[] {
    if (!this.selectedTherapistId) {
      return this.patients;
    }
    return this.patients.filter(p => p.patient?.therapist_id === this.selectedTherapistId);
  }

  onTherapistFilterChange(id: number|null) {
    this.selectedTherapistId = id;
>>>>>>> 9c817448dd925ad50b107aa53b462d07c0de3c29
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
<<<<<<< HEAD
          this.patients = data || [];
          this.applyFilters();
=======
          this.patients = (data || []).slice().reverse();
>>>>>>> 9c817448dd925ad50b107aa53b462d07c0de3c29
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading all patients:', err);
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
<<<<<<< HEAD
        next: (data: any) => {
          this.patients = data || [];
          this.applyFilters();
=======
        next: (data) => {
          this.patients = (data || []).slice().reverse();
>>>>>>> 9c817448dd925ad50b107aa53b462d07c0de3c29
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error loading patients by therapist:', err);
          this.isLoading = false;
        }
      });
  }
  /** סינון לפי סטטוס */
  applyFilters(): void {
    if (this.statusFilter === 'all') {
      this.filteredPatients = [...this.patients];
    } else if (this.statusFilter === 'active') {
      this.filteredPatients = this.patients.filter(p => p.patient?.status === 'פעיל');
    } else if (this.statusFilter === 'inactive') {
      this.filteredPatients = this.patients.filter(p => p.patient?.status !== 'פעיל');
    } else {
      this.filteredPatients = [...this.patients];
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
        if (result) {
          // אחרי הוספה: טען את אותו סוג רשימה כמו בהתחלה
          if (this.therapistId && this.therapistId > 0) {
            this.loadPatientsByTherapist();
          } else {
            this.loadAllPatients();
          }
          const newId = result.patient?.patient_id;
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

  /** הצגת פרטי מטופל (שימושי ל-template) */
  viewPatientDetails(patient: PatientCreationData) {
    const patient_id = patient.patient?.patient_id;
    if (patient_id) {
      this.selectedPatientId = patient_id;
      this.patientSelected.emit(patient);
    }
  }

  logPatient(patient: any) {
    console.log('Patient:', patient);
  }
}
