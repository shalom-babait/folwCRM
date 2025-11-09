import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Patient, PatientCreationData } from 'src/app/models/patient.model';

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

  // עדכני את ה-URL לפי השרת שלך
  private apiUrl = 'http://localhost:3000/api'; // או כל URL אחר

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;
    
    // קבל את ה-therapist_id מהאחסון או מהשירות שלך
    const therapistId = localStorage.getItem('therapist_id'); // או מתוך שירות אימות
    
    this.http.get<PatientCreationData[]>(`${this.apiUrl}/patients/therapist/${therapistId}`)
      .subscribe({
        next: (data) => {
          this.patients = data;
          this.filteredPatients = [...this.patients];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading patients:', error);
          this.isLoading = false;
        }
      });
  }

  onSearch(term: string): void {
    const searchLower = term.toLowerCase().trim();
    
    if (!searchLower) {
      this.filteredPatients = [...this.patients];
      return;
    }

    this.filteredPatients = this.patients.filter(patient => {
      const firstName = (patient.user.first_name || '').toLowerCase();
      const lastName = (patient.user.last_name || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const city = (patient.user.city || '').toLowerCase();

      return fullName.includes(searchLower) || city.includes(searchLower);
    });
  }

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
          const firstNameA = a.user.first_name || '';
          const lastNameA = a.user.last_name || '';
          const firstNameB = b.user.first_name || '';
          const lastNameB = b.user.last_name || '';
          valueA = `${firstNameA} ${lastNameA}`.toLowerCase();
          valueB = `${firstNameB} ${lastNameB}`.toLowerCase();
          break;
        // case 'status':
        //   valueA = a.status || '';
        //   valueB = b.status || '';
          break;
        case 'date_of_birth':
          valueA = a.user.birth_date ? new Date(a.user.birth_date).getTime() : 0;
          valueB = b.user.birth_date ? new Date(b.user.birth_date).getTime() : 0;
          break;
        case 'city':
          valueA = (a.user.city || '').toLowerCase();
          valueB = (b.user.city || '').toLowerCase();
          break;
        case 'gender':
          valueA = a.user.gender || '';
          valueB = b.user.gender || '';
          break;
        default:
          return 0;
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  selectPatient(patient: PatientCreationData): void {
    this.selectedPatientId = patient.patient.patient_id || null;
    console.log('Selected patient:', patient);
  }

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

  getStatusLabel(status?: string): string {
    return status || '-';
  }

  getGenderLabel(gender?: string): string {
    return gender || '-';
  }

  getMaritalStatusLabel(maritalStatus?: string): string {
    switch (maritalStatus) {
      case 'single':
        return 'רווק/ה';
      case 'married':
        return 'נשוי/אה';
      case 'divorced':
        return 'גרוש/ה';
      case 'widowed':
        return 'אלמן/ה';
      default:
        return '-';
    }
  }
}
