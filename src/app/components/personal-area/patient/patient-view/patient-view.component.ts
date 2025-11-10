import { Component, OnInit } from '@angular/core';
import { PatientCreationData } from 'src/app/models/patient.model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.css']
})
export class PatientViewComponent  {
  selectedPatient: PatientCreationData | null = null;
  activeTab: string = 'details';
  searchTerm: string = '';
  loading: boolean = false;

  constructor(private patientService: PatientService) {}

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
