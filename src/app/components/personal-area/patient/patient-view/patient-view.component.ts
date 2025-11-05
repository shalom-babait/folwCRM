import { Component, OnInit } from '@angular/core';
import { Patient } from '../../../../models/patient.model';
import { PatientService } from '../../../../services/patient.service';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.css']
})
export class PatientViewComponent implements OnInit {
  patients: Patient[] = [];
  searchTerm: string = '';
  selectedPatient: Patient | null = null;
  activeTab: string = 'details';
  loading: boolean = false;

  get filteredPatients() {
    if (!this.searchTerm) return this.patients;
return this.patients.filter(p =>
  ((p.first_name || '') + ' ' + (p.last_name || '')).includes(this.searchTerm)
);
  }

  selectPatient(patient: Patient) {
    this.selectedPatient = patient;
    this.activeTab = 'details';
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onCloseDetails() {
    this.selectedPatient = null;
    this.activeTab = 'details';
  }

  onPatientSelected(patient: Patient) {
    this.selectedPatient = patient;
    this.activeTab = 'details';
  }

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
