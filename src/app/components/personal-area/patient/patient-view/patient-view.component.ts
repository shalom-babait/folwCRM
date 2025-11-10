import { Component, OnInit } from '@angular/core';
import { PatientCreationData } from 'src/app/models/patient.model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.css']
})
export class PatientViewComponent implements OnInit {
  patients: PatientCreationData[] = [];
  selectedPatient: PatientCreationData | null = null;
  activeTab: string = 'details';
  searchTerm: string = '';
  loading: boolean = false;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  /** טוען את כל המטופלים מהשרת */
  private loadPatients(): void {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.loading = false;
      },
      error: (err) => {
        console.error('שגיאה בטעינת מטופלים:', err);
        this.loading = false;
      }
    });
  }

  /** מחזיר רק את המטופלים שתואמים לחיפוש */
  get filteredPatients(): PatientCreationData[] {
    if (!this.searchTerm.trim()) return this.patients;
    const term = this.searchTerm.toLowerCase();
    return this.patients.filter(p =>
      (p.user.first_name + ' ' + p.user.last_name).toLowerCase().includes(term)
    );
  }

  /** כאשר נבחר מטופל מהרשימה */
  onPatientSelected(patient: PatientCreationData): void {
    this.selectedPatient = patient;
    this.activeTab = 'details';
  }

  /** החלפת טאב פעיל */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /** בודק אם טאב מסוים פעיל */
  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  /** סגירת תצוגת פרטים וחזרה לרשימה */
  onCloseDetails(): void {
    this.selectedPatient = null;
    this.activeTab = 'details';
  }
}
