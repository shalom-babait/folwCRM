import { Component, OnInit } from '@angular/core';
import { PatientCreationData } from 'src/app/models/patient.model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {
  patients: PatientCreationData[] = [];
  filteredPatients: PatientCreationData[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  selectedPatientId: number | null = null;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  /** טוען מטופלים לפי המטפל המחובר */
  loadPatients(): void {
    this.isLoading = true;
    const therapistId = localStorage.getItem('therapist_id'); // או משירות אימות

    if (!therapistId) {
      console.error('לא נמצא therapist_id');
      this.isLoading = false;
      return;
    }

    this.patientService.getPatientsByTherapist(+therapistId).subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = [...this.patients];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('שגיאה בטעינת מטופלים:', error);
        this.isLoading = false;
      }
    });
  }

  /** סינון לפי שם או עיר */
  onSearch(term: string): void {
    const searchLower = term.toLowerCase().trim();

    if (!searchLower) {
      this.filteredPatients = [...this.patients];
      return;
    }

    this.filteredPatients = this.patients.filter(p => {
      const firstName = (p.user.first_name || '').toLowerCase();
      const lastName = (p.user.last_name || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const city = (p.user.city || '').toLowerCase();
      return fullName.includes(searchLower) || city.includes(searchLower);
    });
  }

  /** מיון לפי עמודה */
  sortBy(column: string): void {
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
          valueA = `${a.user.first_name} ${a.user.last_name}`.toLowerCase();
          valueB = `${b.user.first_name} ${b.user.last_name}`.toLowerCase();
          break;
        case 'birth_date':
          valueA = a.patient.birth_date ? new Date(a.patient.birth_date).getTime() : 0;
          valueB = b.patient.birth_date ? new Date(b.patient.birth_date).getTime() : 0;
          break;
        case 'city':
          valueA = (a.user.city || '').toLowerCase();
          valueB = (b.user.city || '').toLowerCase();
          break;
        case 'gender':
          valueA = a.patient.gender || '';
          valueB = b.patient.gender || '';
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
    console.log('נבחר מטופל:', patient);
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
}
