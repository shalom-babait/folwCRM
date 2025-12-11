import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PatientCreationData } from 'src/app/models/patient.model';
import { PatientService } from 'src/app/services/patient.service';
import { GroupsService } from 'src/app/services/groups.service';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddPatientDialogComponent } from '../../patient/add-patient-dialog/add-patient-dialog.component';
@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit, OnChanges {
  @Input() group: any;
  @Input() therapistId?: number;
  patients: PatientCreationData[] = [];
  filteredPatients: PatientCreationData[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  selectedPatientId: number | null = null;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  gridTemplate: string = '';
  showPatientDetails = false;
  selectedPatient: any = null;
  showAddPatientDialog: boolean = false;
  isEditModeOnOpen: boolean = false;


  constructor(private patientService: PatientService, private groupservice: GroupsService, private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.therapistId) {
      this.loadPatientsByTherapist(this.therapistId);
    } else {
      this.loadPatients();
    }
    this.setupGrid();
  }

  setupGrid(): void {//עיצוב תוכן השדות מתחת לעמודות
    const numberOfColumns = 7;
    const templateParts: string[] = [];
    for (let i = 0; i < numberOfColumns; i++) {
      if (i === 0) {
        templateParts.push('2fr');
      } else {
        templateParts.push('1fr');
      }
    }
    this.gridTemplate = templateParts.join(' ');
  }

  ngOnChanges(): void {
    if (this.therapistId) {
      this.loadPatientsByTherapist(this.therapistId);
    } else if (this.group) {
      this.loadPatients();
    }
  }
  loadPatientsByTherapist(therapistId: number): void {
    this.isLoading = true;
    this.patients = [];
    this.filteredPatients = [];
    this.selectedPatientId = null;
    this.selectedPatient = null;
    this.patientService.getPatientsByTherapist(therapistId).subscribe({
      next: (patients: PatientCreationData[]) => {
        this.patients = patients;
        this.filteredPatients = [...patients];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('שגיאה בטעינת מטופלים לפי מטפל:', error);
        this.isLoading = false;
      }
    });
  }

  loadPatients(): void {
    this.isLoading = true;
    this.patients = []; // אתחול המערכים לרשימה ריקה
    this.filteredPatients = [];
    this.selectedPatientId = null; // אתחול של selectedPatientId ל-null
    this.selectedPatient = null;
    if (this.group?.group_id) {
      this.groupservice.getGroupUsers(this.group.group_id).subscribe({
        next: (response) => {
          const users = response.data;
          if (users.length === 0) {
            // אם אין משתמשים בקבוצה, אתחל את isLoading ל-false
            this.isLoading = false;
            return;
          }

          const patientRequests = users.map(u => this.patientService.getPatientOnly(u.user_id));
          forkJoin(patientRequests).subscribe({
            next: (patients: any) => {

              this.patients = patients.map((p: any) => ({
                person: {
                  person_id: p.person_id,
                  first_name: p.first_name ?? "-",
                  last_name: p.last_name ?? "-",
                  phone: p.phone ?? "-",
                  city: p.city ?? "-",
                  birth_date: p.birth_date ?? "-",
                  address: p.address ?? "-",
                  teudat_zehut: p.teudat_zehut ?? "-",
                  gender: p.gender ?? "אחר"
                },
                patient: {
                  patient_id: p.patient_id,
                  user_id: p.user_id,
                  therapist_id: p.therapist_id,
                  status: p.status ?? "-",
                  history_notes: p.history_notes ?? ""
                },
                user:{
                  user_id: p.user_id,
                  email: p.email ?? "-"
                },
                selectedDepartments: []
              }));
              this.filteredPatients = [...this.patients];
              this.isLoading = false;
            },
            error: (error: any) => {
              console.error('שגיאה בטעינת מטופלים:', error);
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          console.error('שגיאה בטעינת משתמשי קבוצה:', error);
          this.isLoading = false;
        }
      });
    } else {
      // במקרה שאין group_id, יש לאתחל את המערכים
      this.patients = [];
      this.filteredPatients = [];
      this.isLoading = false;
    }
  }


  /** סינון לפי שם או עיר */
  onSearch(term: string): void {
    const searchLower = term.toLowerCase().trim();
    this.selectedPatient = null;
    this.selectedPatientId = null;
    if (!searchLower) {
      this.filteredPatients = [...this.patients];
      return;
    }

    this.filteredPatients = this.patients.filter(p => {
      const firstName = (p.person.first_name || '').toLowerCase();
      const lastName = (p.person.last_name || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const city = (p.person.city || '').toLowerCase();
      return fullName.includes(searchLower) || city.includes(searchLower);
    });
  }

  /** מיון לפי עמודה */
  sortBy(column: string): void {
    this.selectedPatient = null;
    this.selectedPatientId = null;
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredPatients.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (column) {
        case 'full_name':
          valueA = `${a.person.first_name} ${a.person.last_name}`.toLowerCase();
          valueB = `${b.person.first_name} ${b.person.last_name}`.toLowerCase();
          break;
        case 'birth_date':
          valueA = a.person.birth_date ? new Date(a.person.birth_date).getTime() : 0;
          valueB = b.person.birth_date ? new Date(b.person.birth_date).getTime() : 0;
          break;
        case 'city':
          valueA = (a.person.city || '').toLowerCase();
          valueB = (b.person.city || '').toLowerCase();
          break;
        case 'gender':
          valueA = a.person.gender || '';
          valueB = b.person.gender || '';
          break;
        case 'status':
          valueA = a.patient.status || '';
          valueB = b.patient.status || '';
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /** בחירת מטופל */
  selectPatient(patient: PatientCreationData): void {
  this.selectedPatientId = patient.patient.patient_id || null;
  console.log('Selected patient id:', patient.patient.patient_id);
    // אם בחרו מטופל אחר — לסגור תצוגה קודמת
    if (!this.selectedPatient || this.selectedPatient.patient.patient_id !== patient.patient.patient_id) {
      this.selectedPatient = null;
    }
  }


  /** חישוב גיל לפי תאריך לידה */
  getAge(dateOfBirth?: string): number | null {
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /** הצגת תוויות סטטוס/מין/מצב משפחתי */
  getStatusLabel(status?: string): string {
    return status || '-';
  }

  getGenderLabel(gender?: string): string {
    return gender || '-';
  }

  getMaritalStatusLabel(maritalStatus?: string): string {
    switch (maritalStatus) {
      case 'single': return 'רווק/ה';
      case 'married': return 'נשוי/אה';
      case 'divorced': return 'גרוש/ה';
      case 'widowed': return 'אלמן/ה';
      default: return '-';
    }
  }



  openPatientDetails(patient: any, editMode: boolean) {
    // אם אותו מטופל כבר פתוח — אל תסגור!
    if (this.selectedPatient && this.selectedPatient.patient.patient_id === patient.patient.patient_id) {
      // רק עדכן מצב עריכה
      this.isEditModeOnOpen = editMode;
      return; // אל תסגור אותו
    }

    // אם זה מטופל חדש — פתח אותו
    this.selectedPatient = patient;
    this.isEditModeOnOpen = editMode;
  }



  closePatientDetails() {
    this.selectedPatient = null;
  }


  openAddPatientDialog(): void {
    const dialogRef = this.dialog.open(AddPatientDialogComponent, {
      width: '600px',
      data: { user_id: 0, therapist_id: this.therapistId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.therapistId) {
          this.loadPatientsByTherapist(this.therapistId);
        } else {
          this.loadPatients();
        }
      }
    });
  }

}
